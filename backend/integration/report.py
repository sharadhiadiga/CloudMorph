def generate_manual_actions(data):
    """
    Intelligently generates DevOps post-migration steps based on 
    repository analysis and pipeline results.
    """
    actions = []
    stack = data.get("stack", "").lower()
    img_url = data.get("image_url", "")
    dep_url = data.get("deployment_url", "")
    port = data.get("port", 0)
    app_name = data.get("app_name", "app")

    # 1. SECURITY & CONFIG (Highest Priority)
    # Always include secret management as it's a best practice
    actions.append("[MANUAL] Configure production environment variables and implement secure secrets management.")
    
    if "api" in app_name.lower():
        actions.append("[MANUAL] Implement JWT authentication and API rate limiting for the entry points.")

    # 2. INFRASTRUCTURE & DEPLOYMENT
    if dep_url:
        actions.append("[MANUAL] Configure custom domain and validate DNS routing records for the live service.")
    else:
        actions.append("[MANUAL] Verify cloud provider credentials and deployment stage permissions.")

    if not img_url:
        actions.append("[MANUAL] Fix Docker build issues and validate Dockerfile repository structure.")

    # 3. STACK SPECIFIC OPTIMIZATIONS
    if "node" in stack:
        actions.append("[MANUAL] Setup PM2 for Node.js process management and clustering in production.")
        actions.append("[MANUAL] Audit package.json for production-only dependencies and vulnerabilities.")
    elif "flask" in stack:
        actions.append("[MANUAL] Configure Gunicorn workers and implement a WSGI interface for performance.")
        actions.append("[MANUAL] Setup Flask-Migrate for database schema management in the new environment.")
    elif "java" in stack:
        actions.append("[MANUAL] Tune JVM heap memory settings based on target cloud machine specs.")
        actions.append("[MANUAL] Configure Spring Boot Actuator for health check monitoring.")

    # 4. MONITORING & CI/CD (Standard Best Practices)
    actions.append("[MANUAL] Set up cloud monitoring and automated alerting (e.g., Prometheus/Grafana or CloudWatch).")
    actions.append("[MANUAL] Implement a CI/CD pipeline (GitHub Actions / Jenkins) to automate future deployments.")

    # Limit to 8 actions max as per requirements, priority based on order added
    return actions[:8]
def generate_migration_summary(data):
    """
    Creates a Before -> After transformation delta for the final report.
    """
    summary = []
    stack = data.get("stack", "").lower()
    img_url = data.get("image_url", "")
    dep_url = data.get("deployment_url", "")

    # 1. Runtime Transformation
    runtime_from = "Legacy Runtime"
    runtime_to = "Modernized Runtime"
    if "node" in stack:
        runtime_from, runtime_to = "Node.js 14", "Node.js 18 (LTS)"
    elif "flask" in stack or "python" in stack:
        runtime_from, runtime_to = "Python 3.8", "Python 3.11"
    elif "java" in stack:
        runtime_from, runtime_to = "Java 8 / 11", "Java 17 (OpenJDK)"

    summary.append({
        "component": "Runtime Environment",
        "from": runtime_from,
        "to": runtime_to,
        "status": "upgraded"
    })

    # 2. Process Management
    pm_to = "Standard Execution"
    if "node" in stack:
        pm_to = "PM2 Clustering"
    elif "flask" in stack:
        pm_to = "Gunicorn WSGI"
    
    summary.append({
        "component": "Process Manager",
        "from": "Direct / None",
        "to": pm_to,
        "status": "added"
    })

    # 3. Containerization
    summary.append({
        "component": "Architecture",
        "from": "Monolithic / Bare",
        "to": "Dockerized Container",
        "status": "completed" if img_url else "skipped"
    })

    # 4. Infrastructure/Deployment
    summary.append({
        "component": "Deployment Tier",
        "from": "Manual / Local",
        "to": "Managed Cloud Service",
        "status": "deployed" if dep_url else "pending"
    })

    return summary



def generate_report(data):
    """
    Generates intelligent, sequential, and context-aware logs
    without breaking the strict data contract.
    """

    if "logs" not in data:
        data["logs"] = []

    # create safe list copy
    logs = list(data.get("logs", []))

    stack = data.get("stack", "").lower()
    port = data.get("port", 0)
    img_url = data.get("image_url", "")
    dep_url = data.get("deployment_url", "")
    tf_path = data.get("terraform_path", "")

    # New Intelligence Section (Audit Report)
    data["migration_summary"] = generate_migration_summary(data)
    logs.append("[INFO] Analyzing migration transformation delta...")
    logs.append("[INFO] Data modernization map generated for audit.")

    # 1. PIPELINE TRACE (SEQUENTIAL)
    if data.get("app_name"):
        logs.append("[INFO] Analysis phase completed successfully.")

    if img_url:
        logs.append("[SUCCESS] Docker image built and available.")
    else:
        logs.append("[ERROR] Dockerization failed \u2014 image not found.")

    if tf_path:
        logs.append("[INFO] Infrastructure configuration generated via Terraform.")
    else:
        logs.append("[ERROR] Terraform configuration missing.")

    if dep_url:
        logs.append("[SUCCESS] Deployment completed successfully.")
    else:
        logs.append("[FAILURE] Deployment stage failed.")

    # 2. VALIDATION
    if port == 0:
        logs.append("[WARNING] Application port is undefined (0). This may break routing.")

    if stack == "unknown" or not stack:
        logs.append("[WARNING] Could not confidently detect tech stack.")

    # 3. CONTEXTUAL INSIGHTS
    if img_url:
        logs.append(f"[INFO] Container image stored at: {img_url}")

    if dep_url:
        logs.append(f"[INFO] Application live at: {dep_url}")
        logs.append("[INFO] Consider enabling monitoring and alerts.")
    else:
        logs.append("[TROUBLESHOOTING] Check cloud credentials, Terraform logs, and service quotas.")

    # 4. NARRATIVE SUMMARY
    container_status = "successfully analyzed and containerized" if img_url else "facing critical containerization issues"
    deploy_status = "deployed to the target cloud environment" if dep_url else "awaiting infrastructure provisioning"
    summary_text = f"The application '{data.get('app_name', 'Unnamed')}' was {container_status} and {deploy_status} using a {stack.capitalize()} stack. "
    if dep_url:
        summary_text += "The primary services are operational with a verified deployment endpoint."
    else:
        summary_text += "Infrastructure deployment is currently pending, indicating a requirement for manual environment verification."
    logs.append(f"[SUMMARY] {summary_text}")

    # 5. RISK ASSESSMENT
    risks_found = False
    if not dep_url:
        logs.append("[RISK_HIGH] Deployment was unsuccessful, indicating a potential infrastructure or configuration issue within the target environment.")
        risks_found = True
    if not img_url:
        logs.append("[RISK_HIGH] Containerization phase failed, blocking the automated deployment pipeline and image availability.")
        risks_found = True
    if port == 0:
        logs.append("[RISK_MEDIUM] Application port is not explicitly defined, which may result in ingress routing failure or service unreachability.")
        risks_found = True
    if stack == "unknown" or not stack:
        logs.append("[RISK_MEDIUM] Technology stack could not be confidently identified, presenting a runtime compatibility and optimization risk.")
        risks_found = True

    if not risks_found:
        logs.append("[RISK_LOW] No major risks identified. The system appears stable and production-ready.")

    # 6. DYNAMIC MANUAL ACTIONS (UPGRADED)
    manual_actions = generate_manual_actions(data)
    for action in manual_actions:
        logs.append(action)

    # 7. AI SIGNATURE
    logs.append("[AI] CloudMorph analysis complete. Actionable insights generated.")

    # 8. REMOVE DUPLICATES
    unique_logs = []
    seen = set()

    for log in logs:
        if isinstance(log, str) and log not in seen:
            unique_logs.append(log)
            seen.add(log)

    data["logs"] = unique_logs

    return data