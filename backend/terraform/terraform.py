"""
Terraform Module — CloudMorph-AI
Responsible for setting: terraform_path
"""


def terraform(data: dict) -> dict:
    """
    Simulates Terraform infrastructure generation.
    In production: render HCL templates, run terraform init/apply.
    Contract: ONLY sets terraform_path. Never touches other fields.
    """
    if "logs" not in data:
        data["logs"] = []

    app_name = data.get("app_name", "app")

    if not data.get("terraform_path"):
        data["terraform_path"] = f"./infra/{app_name}.tf"

    data["logs"].append(f"[TERRAFORM] Infrastructure config generated at: {data['terraform_path']}")

    return data
