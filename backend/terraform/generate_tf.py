import os

def generate_tf(config):
    template_path = os.path.join("templates", "terraform.tpl")

    with open(template_path, "r") as f:
        template = f.read()

    tf_code = template.replace("{{PROJECT_ID}}", config["project_id"]) \
                      .replace("{{REGION}}", config["region"]) \
                      .replace("{{APP_NAME}}", config["app_name"]) \
                      .replace("{{IMAGE_URL}}", config["image_url"])

    output_path = os.path.join("backend", "terraform", "main.tf")

    with open(output_path, "w") as f:
        f.write(tf_code)

    print("Terraform file generated at:", output_path)


# TEST (you can remove later)
if __name__ == "__main__":
    config = {
        "project_id": "your-project-id",
        "region": "asia-south1",
        "app_name": "test-app",
        "image_url": "gcr.io/your-project-id/test-app"
    }

    generate_tf(config)