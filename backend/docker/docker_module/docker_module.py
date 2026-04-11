import os
import subprocess
import uuid
from .config import PROJECT_ID


# ---------- Run command ----------
def run_command(cmd):
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        raise Exception(f"Command failed: {cmd}")


# ---------- Generate Dockerfile ----------
def generate_dockerfile(data):
    path = data["source_path"]
    stack = data["stack"]
    port = data["port"]

    dockerfile_path = os.path.join(path, "Dockerfile")

    if stack == "node":
        content = f"""
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE {port}
CMD ["npm", "start"]
"""

    elif stack == "python":
        content = f"""
FROM python:3.10
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE {port}
CMD ["python", "app.py"]
"""

    elif stack == "java":
        content = f"""
FROM openjdk:17
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE {port}
CMD ["java", "-jar", "app.jar"]
"""

    else:
        raise Exception("Unsupported stack")

    with open(dockerfile_path, "w") as f:
        f.write(content.strip())

    return dockerfile_path


# ---------- Build image ----------
def build_image(path, image_name):
    cmd = f"docker build -t {image_name} {path}"
    run_command(cmd)


# ---------- Tag image (IMPORTANT) ----------
def tag_image(image_name):
    image_url = f"gcr.io/{PROJECT_ID}/{image_name}"
    cmd = f"docker tag {image_name} {image_url}"
    run_command(cmd)
    return image_url


# ---------- MAIN FUNCTION ----------
def docker_module(data):

    print("\n--- Docker Module Started ---")

    # Unique image name
    unique_id = str(uuid.uuid4())[:6]
    image_name = f"{data['app_name']}-{unique_id}"

    # Step 1: Dockerfile
    dockerfile_path = generate_dockerfile(data)
    print("Dockerfile created")

    # Step 2: Build
    build_image(data["source_path"], image_name)
    print("Image built")

    # Step 3: Tag (this gives cloud-style URL)
    image_url = tag_image(image_name)
    print("Image tagged (simulated cloud URL)")

    # ❌ Step 4 REMOVED (no push)

    # Step 4: Update data
    data["dockerfile_path"] = dockerfile_path
    data["image_name"] = image_name
    data["image_url"] = image_url
    

    print("--- Docker Module Completed ---\n")

    return data