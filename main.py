# -*- coding: utf-8 -*-
"""
CloudMorph -- Main Pipeline Entry Point
Validates the full pipeline: analysis -> docker -> terraform -> deploy -> report

Includes:
  - validate_data_contract(): strict schema enforcement
  - [DEBUG] per-stage state logging
  - 4 failure simulation test cases
  - FINAL VALIDATED JSON output per case
"""

import json
import copy
import time

from backend.analysis.analyze import analyze
from backend.docker.dockerize import dockerize
from backend.terraform.terraform import terraform
from backend.deploy.deploy import deploy
from backend.integration.report import generate_report


# ---------------------------------------------
# DATA CONTRACT DEFINITION
# ---------------------------------------------

REQUIRED_FIELDS = {
    "app_name":       str,
    "stack":          str,
    "port":           int,
    "source_path":    str,
    "dockerfile_path":str,
    "image_name":     str,
    "image_url":      str,
    "terraform_path": str,
    "deployment_url": str,
    "logs":           list,
}

# Fields that must NOT be empty/zero in a success scenario
CRITICAL_FIELDS = ["app_name", "stack", "dockerfile_path", "image_name", "terraform_path"]


# ---------------------------------------------
# VALIDATION HELPER
# ---------------------------------------------

def validate_data_contract(data: dict, case_label: str = "UNKNOWN") -> dict:
    """
    Validates the data object against the strict data contract.

    Checks:
      - All required keys exist
      - Types match the contract
      - No extra/unexpected keys introduced
      - Critical fields are not empty

    Returns a validation result dict:
      {
        "passed": bool,
        "errors": [...],
        "warnings": [...],
      }
    """
    errors = []
    warnings = []

    # 1. Check for missing keys
    for field, expected_type in REQUIRED_FIELDS.items():
        if field not in data:
            errors.append(f"MISSING FIELD: '{field}' not found in data object.")

    # 2. Check types and detect extra keys
    for key, value in data.items():
        if key not in REQUIRED_FIELDS:
            errors.append(f"EXTRA FIELD: '{key}' is not part of the data contract.")
        else:
            expected_type = REQUIRED_FIELDS[key]
            if not isinstance(value, expected_type):
                errors.append(
                    f"TYPE MISMATCH: '{key}' expected {expected_type.__name__}, "
                    f"got {type(value).__name__} (value={repr(value)})"
                )

    # 3. Warn on empty critical fields (allowed in failure scenarios)
    for field in CRITICAL_FIELDS:
        if field in data and not data[field]:
            warnings.append(f"EMPTY CRITICAL FIELD: '{field}' is empty.")

    # 4. Specific value checks
    if data.get("port") == 0:
        warnings.append("INVALID VALUE: 'port' is 0 -- application may not be routable.")

    if data.get("stack", "").lower() == "unknown":
        warnings.append("INVALID VALUE: 'stack' is 'unknown' -- runtime compatibility risk.")

    if data.get("stack") == "" and "stack" in data:
        warnings.append("EMPTY CRITICAL FIELD: 'stack' is empty.")

    passed = len(errors) == 0

    # Print validation results
    status_icon = "[PASS]" if passed else "[FAIL]"
    print(f"\n  {status_icon} CONTRACT VALIDATION [{case_label}]")
    if errors:
        for e in errors:
            print(f"     [CONTRACT ERROR]   {e}")
    if warnings:
        for w in warnings:
            print(f"     [CONTRACT WARNING] {w}")
    if passed and not warnings:
        print("     All fields valid. Contract: PASS")
    elif passed:
        print(f"     Contract: PASS with {len(warnings)} warning(s).")

    return {"passed": passed, "errors": errors, "warnings": warnings}


# ---------------------------------------------
# MOCK DATA FACTORY
# ---------------------------------------------

def get_mock_data(case: str = "success") -> dict:
    """
    Returns a pre-populated data object for the given test case.
    Mirrors what real analysis/docker/terraform/deploy would produce.

    Cases:
      success       -- All fields correctly populated.
      docker_fail   -- image_url is empty (Docker build failure).
      deploy_fail   -- deployment_url is empty (Cloud deploy failure).
      invalid_config -- port=0, stack=unknown (misconfigured app).
    """
    base = {
        "app_name":        "inventory-api",
        "stack":           "node",
        "port":            3000,
        "source_path":     "./src",
        "dockerfile_path": "./Dockerfile",
        "image_name":      "inventory-api-v1",
        "image_url":       "gcr.io/cloudmorph/inventory-api:v1",
        "terraform_path":  "./infra/main.tf",
        "deployment_url":  "https://inventory-api.cloudmorph.run",
        "logs":            [],
    }

    if case == "success":
        return base

    data = copy.deepcopy(base)

    if case == "docker_fail":
        data["image_url"] = ""                   # Docker build failed
        data["image_name"] = ""                  # No image produced
        data["deployment_url"] = ""              # Cannot deploy without image

    elif case == "deploy_fail":
        data["deployment_url"] = ""              # Cloud deploy failed

    elif case == "invalid_config":
        data["port"] = 0                         # Port undefined
        data["stack"] = "unknown"                # Stack not detected

    return data


# ---------------------------------------------
# PIPELINE RUNNER
# ---------------------------------------------

def run_pipeline(initial_data: dict, case_label: str = "UNNAMED") -> dict:
    """
    Executes the migration pipeline stage by stage.

    Order: analysis -> docker -> terraform -> deploy -> report

    After each stage:
      - Prints [DEBUG] state snapshot
      - Verifies only the expected fields changed

    Always produces a report and never crashes.
    """

    data = copy.deepcopy(initial_data)

    if "logs" not in data:
        data["logs"] = []

    print(f"\n" + "-"*60)
    print(f"  >> Starting Pipeline: {case_label}")
    print(f"     App: {data.get('app_name', 'N/A')}  |  Stack: {data.get('stack', 'N/A')}  |  Port: {data.get('port', 'N/A')}")
    print("-"*60)

    data["logs"].append(f"[INFO] Pipeline started for case: {case_label}")

    start_time = time.time()

    # -- Stage definitions: (label, function, fields_it_must_set)
    stages = [
        ("ANALYSIS",  analyze,         ["app_name", "stack", "port"]),
        ("DOCKER",    dockerize,        ["dockerfile_path", "image_name", "image_url"]),
        ("TERRAFORM", terraform,        ["terraform_path"]),
        ("DEPLOY",    deploy,           ["deployment_url"]),
    ]

    for stage_name, stage_func, owned_fields in stages:
        snapshot_before = copy.deepcopy(data)
        try:
            data = stage_func(data)
        except Exception as e:
            msg = f"[ERROR] {stage_name} stage raised an exception: {e}"
            data["logs"].append(msg)
            print(f"\n  [FAIL] {msg}")
            continue

        # Debug output after each stage
        _debug_stage(stage_name, data, snapshot_before, owned_fields)

    # Reporting stage
    print(f"\n  [STAGE] REPORT")
    try:
        data = generate_report(data)
        print(f"     [DEBUG] Report generated - {len(data['logs'])} total log entries.")
    except Exception as e:
        data["logs"].append(f"[CRITICAL] Reporting failed: {e}")
        print(f"     [FAIL] Reporting failed: {e}")

    duration = max(0.1, round(time.time() - start_time, 3))
    data["logs"].append(f"[INFO] Pipeline completed in {duration}s.")

    print(f"\n  [DONE] Pipeline finished in {duration}s.")

    return data


def _debug_stage(
    stage_name: str,
    data_after: dict,
    data_before: dict,
    owned_fields: list,
) -> None:
    """Prints a structured debug snapshot after a pipeline stage."""
    print(f"\n  [STAGE] {stage_name}")

    # Show owned field values after the stage
    for field in owned_fields:
        val_before = data_before.get(field)
        val_after  = data_after.get(field)

        changed = val_before != val_after
        change_tag = " <- CHANGED" if changed else ""
        status = "[OK] " if val_after else "[WARN]"
        print(f"     {status} {field}: {repr(val_after)}{change_tag}")

    # Verify no non-owned fields were corrupted
    non_owned = [k for k in REQUIRED_FIELDS if k not in owned_fields and k != "logs"]
    for field in non_owned:
        if data_before.get(field) != data_after.get(field):
            print(f"     [INTEGRITY VIOLATION] '{field}' was modified by {stage_name}!")

    # Show data snapshot as debug JSON (excluding logs for brevity)
    snapshot = {k: v for k, v in data_after.items() if k != "logs"}
    print(f"\n     [DEBUG] After {stage_name} ->")
    for k, v in snapshot.items():
        print(f"       {k}: {repr(v)}")


# ---------------------------------------------
# TEST RUNNER
# ---------------------------------------------

TEST_CASES = [
    {
        "id":    "CASE 1: SUCCESS",
        "case":  "success",
        "desc":  "All fields present -- full pipeline expected to succeed.",
    },
    {
        "id":    "CASE 2: DOCKER FAIL",
        "case":  "docker_fail",
        "desc":  "image_url missing -- Docker build failure simulation.",
    },
    {
        "id":    "CASE 3: DEPLOY FAIL",
        "case":  "deploy_fail",
        "desc":  "deployment_url missing -- Cloud deploy failure simulation.",
    },
    {
        "id":    "CASE 4: INVALID CONFIG",
        "case":  "invalid_config",
        "desc":  "port=0 and stack=unknown -- misconfigured application.",
    },
]


if __name__ == "__main__":
    print("\n" + "="*60)
    print("  CloudMorph -- Full Pipeline Validation")
    print("="*60)

    all_results = {}

    for tc in TEST_CASES:
        print(f"\n\n" + "="*60)
        print(f"  {tc['id']}")
        print(f"  {tc['desc']}")
        print("="*60)

        # 1. Prepare initial state
        initial_state = get_mock_data(tc["case"])

        # 2. Run the pipeline
        final_state = run_pipeline(initial_state, case_label=tc["id"])

        # 3. Validate the contract
        validation = validate_data_contract(final_state, case_label=tc["id"])

        # 4. Print final output
        # Print strictly following the agreed data contract.
        # Removing trace_logs and ai_insights from the output schema.
        output = {k: v for k, v in final_state.items() if k != "repo_url"}
        output.pop("trace_logs", None)
        output.pop("ai_insights", None)

        print(f"\n  FINAL VALIDATED JSON [{tc['id']}]:")
        print(json.dumps(output, indent=4))

        # 5. Summary checklist
        print(f"\n  VALIDATION CHECKLIST [{tc['id']}]:")
        print(f"    {'[PASS]' if final_state.get('app_name')        else '[FAIL]'} app_name populated")
        print(f"    {'[PASS]' if final_state.get('stack')           else '[FAIL]'} stack populated")
        print(f"    {'[PASS]' if final_state.get('port')            else '[FAIL]'} port non-zero")
        print(f"    {'[PASS]' if final_state.get('dockerfile_path') else '[FAIL]'} dockerfile_path set")
        print(f"    {'[PASS]' if final_state.get('image_name')      else '[FAIL]'} image_name set")
        print(f"    {'[PASS]' if final_state.get('image_url')       else '[FAIL]'} image_url set")
        print(f"    {'[PASS]' if final_state.get('terraform_path')  else '[FAIL]'} terraform_path set")
        print(f"    {'[PASS]' if final_state.get('deployment_url')  else '[FAIL]'} deployment_url set")
        print(f"    {'[PASS]' if isinstance(final_state.get('logs'), list) else '[FAIL]'} logs is a list")
        print(f"    {'[PASS]' if validation['passed']               else '[FAIL]'} contract schema valid")
        print(f"    {'[PASS]' if not validation['errors']           else '[FAIL]'} no contract errors")

        all_results[tc["id"]] = {
            "passed": validation["passed"],
            "errors": validation["errors"],
            "warnings": validation["warnings"],
        }

        print("\n" + "="*60)

    # -- Grand Summary
    print("\n\n" + "="*60)
    print("  GRAND SUMMARY -- All Test Cases")
    print("="*60)
    for case_id, result in all_results.items():
        icon = "[PASS]" if result["passed"] else "[FAIL]"
        errs = f"  ({len(result['errors'])} error(s), {len(result['warnings'])} warning(s))"
        print(f"  {icon}  {case_id}{errs}")
    print("="*60 + "\n")