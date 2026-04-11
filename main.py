import json
import copy
import time

from backend.analysis.analyze import analyze
from backend.docker.dockerize import dockerize
from backend.terraform.terraform import terraform
from backend.deploy.deploy import deploy
from backend.integration.report import generate_report


# Toggle between mock and real pipeline
USE_MOCK = True


def get_mock_data(case="success"):
    """
    Generates mock data objects according to the strict JSON data contract.
    Cases: success, docker_fail, deploy_fail, unknown_stack, missing_port
    """
    base_data = {
        "app_name": "inventory-api",
        "stack": "node",
        "port": 3000,
        "source_path": "./src",
        "dockerfile_path": "./Dockerfile",
        "image_name": "inventory-api-v1",
        "image_url": "gcr.io/cloudmorph-ai/inventory-api:v1",
        "terraform_path": "./infra/main.tf",
        "deployment_url": "https://inventory-api.cloudmorph.run",
        "logs": []
    }

    if case == "success":
        return base_data

    elif case == "docker_fail":
        data = copy.deepcopy(base_data)
        data["image_url"] = ""
        return data

    elif case == "deploy_fail":
        data = copy.deepcopy(base_data)
        data["deployment_url"] = ""
        return data

    elif case == "unknown_stack":
        data = copy.deepcopy(base_data)
        data["stack"] = "unknown"
        return data

    elif case == "missing_port":
        data = copy.deepcopy(base_data)
        data["port"] = 0
        return data

    return base_data


def run_pipeline(initial_data):
    """
    Executes the migration pipeline.
    - Maintains single data object
    - Never crashes
    - Always produces report
    """

    data = copy.deepcopy(initial_data)

    # Ensure logs exist
    if "logs" not in data:
        data["logs"] = []

    # Start timing
    start_time = time.time()

    # Pipeline start log
    data["logs"].append("[INFO] Migration pipeline started.")

    stages = [
        ("Analysis", analyze),
        ("Dockerization", dockerize),
        ("Terraform Infrastructure", terraform),
        ("Deployment", deploy)
    ]

    print(f"\n--- Starting Migration Pipeline for: {data.get('app_name', 'Unnamed App')} ---")

    for stage_name, stage_func in stages:
        try:
            data = stage_func(data)
        except Exception as e:
            error_msg = f"[ERROR] {stage_name} failed — {str(e)}"
            data["logs"].append(error_msg)
            print(error_msg)

    # Always generate report
    try:
        data = generate_report(data)
    except Exception as e:
        data["logs"].append(f"[CRITICAL] Reporting system failed — {str(e)}")

    # End timing (avoid 0.0 seconds)
    end_time = time.time()
    duration = max(0.1, round(end_time - start_time, 2))

    data["logs"].append(f"[INFO] Pipeline executed in {duration} seconds.")
    data["logs"].append("[INFO] Migration pipeline completed.")

    print("--- Pipeline Execution Finished ---\n")

    return data


if __name__ == "__main__":
    test_cases = [
        "success",
        "docker_fail",
        "deploy_fail",
        "unknown_stack",
        "missing_port"
    ]

    for case in test_cases:
        print(f"\n========== RUNNING TEST CASE: {case.upper()} ==========")

        # Step 1: Get data
        if USE_MOCK:
            initial_state = get_mock_data(case)
        else:
            # Replace with real input later
            initial_state = get_mock_data("success")

        # Step 2: Run pipeline
        final_state = run_pipeline(initial_state)

        # Step 3: Output JSON
        print("FINAL OUTPUT JSON:")
        print(json.dumps(final_state, indent=2))

        print("=" * 60)