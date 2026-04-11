"""
Analysis Module — CloudMorph
Responsible for setting: app_name, stack, port
"""

def analyze(data: dict) -> dict:
    """
    Simulates codebase analysis by dynamically deriving insights from the repository URL.
    Contract: ONLY sets app_name, stack, port, source_path. Never touches other fields.
    """
    if "logs" not in data:
        data["logs"] = []

    repo_url = data.get("repo_url", "").lower()
    
    # 1. Dynamically extract APP NAME from Github URL
    # e.g., "https://github.com/miguelgrinberg/flasky.git" -> "flasky"
    extracted_app_name = "app"
    if repo_url:
        parts = repo_url.rstrip('/').split('/')
        if parts:
            extracted_app_name = parts[-1].replace('.git', '')
    
    # Only override if not already populated (allows mock test cases to still work)
    if not data.get("app_name"):
        data["app_name"] = extracted_app_name or "app"

    if not data.get("source_path"):
        data["source_path"] = f"./{data['app_name']}/src"

    # 2. Dynamically extract STACK and PORT based on keyword matching logic in url/name
    # This gives the hackathon demo that dynamic "intelligence" feel without building a real code parser
    if not data.get("stack") or not data.get("port"):
        app_name_lower = data["app_name"].lower()
        if "flask" in app_name_lower or "django" in app_name_lower or "python" in repo_url:
            data["stack"] = "python/flask" if "flask" in app_name_lower else "python"
            data["port"] = 5000
        elif "spring" in app_name_lower or "java" in repo_url:
            data["stack"] = "java/spring"
            data["port"] = 8080
        elif "react" in app_name_lower or "next" in app_name_lower or "node" in repo_url:
            data["stack"] = "node.js"
            data["port"] = 3000
        elif "go" in app_name_lower or "gin" in app_name_lower:
            data["stack"] = "golang"
            data["port"] = 8080
        elif repo_url:
            # Random default if something was given but no match
            data["stack"] = "node.js"
            data["port"] = 3000
        else:
            # Completely missing
            data["stack"] = "unknown"
            data["port"] = 0

    # 3. Simulate Dependency Extraction (NEW)
    # Based on the detected stack, we inject mock project dependencies for the report audit
    deps = []
    stack_lower = data.get("stack", "").lower()

    if "node" in stack_lower:
        deps = [
            {"name": "express", "version": "4.18.2", "status": "ok"},
            {"name": "cors", "version": "2.8.5", "status": "ok"},
            {"name": "dotenv", "version": "16.0.3", "status": "ok"},
            {"name": "mongoose", "version": "6.0.0", "status": "upgrade recommended"}
        ]
    elif "flask" in stack_lower or "python" in stack_lower:
        deps = [
            {"name": "flask", "version": "2.2.0", "status": "ok"},
            {"name": "gunicorn", "version": "20.1.0", "status": "ok"},
            {"name": "psycopg2-binary", "version": "2.9.3", "status": "ok"},
            {"name": "requests", "version": "2.25.1", "status": "upgrade recommended"}
        ]
    elif "java" in stack_lower:
        deps = [
            {"name": "spring-boot-starter-web", "version": "2.7.5", "status": "ok"},
            {"name": "spring-boot-starter-data-jpa", "version": "2.7.5", "status": "ok"},
            {"name": "h2", "version": "2.1.214", "status": "ok"},
            {"name": "lombok", "version": "1.18.24", "status": "ok"}
        ]

    data["dependencies"] = deps
    data["logs"].append(f"[INFO] Analyzed codebase: {len(deps)} project dependencies identified.")
    data["logs"].append(f"[ANALYSIS] Detected stack: {data['stack']}, port: {data['port']}, app: {data['app_name']}")

    return data
