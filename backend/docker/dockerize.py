"""
Dockerization Module — CloudMorph-AI
Responsible for setting: dockerfile_path, image_name, image_url
"""


def dockerize(data: dict) -> dict:
    """
    Simulates Docker image build and push.
    In production: generate Dockerfile, build image, push to registry.
    Contract: ONLY sets dockerfile_path, image_name, image_url. Never touches other fields.
    """
    if "logs" not in data:
        data["logs"] = []

    app_name = data.get("app_name", "app")

    if not data.get("dockerfile_path"):
        data["dockerfile_path"] = "./Dockerfile"

    if not data.get("image_name"):
        data["image_name"] = f"{app_name}-v1"

    # In LIVE mode, we should dynamically generate the URL instead of leaving it empty
    if not data.get("image_url") and "image_url" not in data:
        data["image_url"] = f"gcr.io/cloudmorph-ai/{app_name}:v1"
    elif "image_url" in data and not data["image_url"]:
        # Mock sets it deliberately empty to test failures
        pass

    if data.get("image_url"):
        data["logs"].append(f"[DOCKER] Image built: {data['image_name']} -> {data['image_url']}")
    else:
        data["logs"].append(f"[DOCKER] Image build failed -- image_url not set for {data['image_name']}.")

    return data
