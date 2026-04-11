"""
Deployment Module — CloudMorph
Responsible for setting: deployment_url
"""


def deploy(data: dict) -> dict:
    """
    Simulates cloud deployment.
    In production: run gcloud/kubectl commands, verify service URL.
    Contract: ONLY sets deployment_url. Never touches other fields.
    """
    if "logs" not in data:
        data["logs"] = []

    app_name = data.get("app_name", "app")

    # In LIVE mode, we dynamically generate the URL instead of leaving it empty
    if not data.get("deployment_url") and "deployment_url" not in data:
        data["deployment_url"] = f"https://{app_name}.cloudmorph.run"
    elif "deployment_url" in data and not data["deployment_url"]:
        # Mock sets it deliberately empty to test failures
        pass

    if data.get("deployment_url"):
        data["logs"].append(f"[DEPLOY] Application deployed -> {data['deployment_url']}")
    else:
        data["logs"].append(f"[DEPLOY] Deployment failed -- deployment_url not set for {app_name}.")

    return data
