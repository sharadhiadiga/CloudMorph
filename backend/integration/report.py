def generate_report(data):
    """
    Generates intelligent, sequential, and context-aware logs
    without breaking the strict data contract.
    """

    if "logs" not in data:
        data["logs"] = []

    # ✅ FIX: create safe copy (prevents corruption)
    logs = list(data.get("logs", []))

    stack = data.get("stack", "").lower()
    port = data.get("port", 0)
    img_url = data.get("image_url", "")
    dep_url = data.get("deployment_url", "")
    tf_path = data.get("terraform_path", "")

    # -----------------------------
    # 1. PIPELINE TRACE (SEQUENTIAL)
    # -----------------------------
    if data.get("app_name"):
        logs.append("[INFO] Analysis phase completed successfully.")

    if img_url:
        logs.append("[SUCCESS] Docker image built and available.")
    else:
        logs.append("[ERROR] Dockerization failed — image not found.")

    if tf_path:
        logs.append("[INFO] Infrastructure configuration generated via Terraform.")
    else:
        logs.append("[ERROR] Terraform configuration missing.")

    if dep_url:
        logs.append("[SUCCESS] Deployment completed successfully.")
    else:
        logs.append("[FAILURE] Deployment stage failed.")

    # -----------------------------
    # 2. VALIDATION
    # -----------------------------
    if port == 0:
        logs.append("[WARNING] Application port is undefined (0). This may break routing.")

    if stack == "unknown" or not stack:
        logs.append("[WARNING] Could not confidently detect tech stack.")

    # -----------------------------
    # 3. STACK INTELLIGENCE
    # -----------------------------
    if stack == "node":
        logs.append("[SUGGESTION] Use PM2 for Node.js process management in production.")

    elif stack == "flask":
        logs.append("[SUGGESTION] Use Gunicorn or Waitress for Flask production deployment.")

    # -----------------------------
    # 4. CONTEXTUAL INSIGHTS
    # -----------------------------
    if img_url:
        logs.append(f"[INFO] Container image stored at: {img_url}")

    if dep_url:
        logs.append(f"[INFO] Application live at: {dep_url}")
        logs.append("[INFO] Consider enabling monitoring and alerts.")
    else:
        logs.append("[TROUBLESHOOTING] Check cloud credentials, Terraform logs, and service quotas.")

    # -----------------------------
    # 5. PIPELINE CONSISTENCY CHECK
    # -----------------------------
    if not img_url and dep_url:
        logs.append("[WARNING] Deployment succeeded despite Docker failure. Verify pipeline integrity.")

    # -----------------------------
    # 7. AUDIT INTELLIGENCE (FOR PDF SECTIONS)
    # -----------------------------
    
    # Narrative Summary
    container_status = "successfully analyzed and containerized" if img_url else "facing critical containerization issues"
    deploy_status = "deployed to the target cloud environment" if dep_url else "awaiting infrastructure provisioning"
    summary_text = f"The application '{data.get('app_name', 'Unnamed')}' was {container_status} and {deploy_status} using a {stack.capitalize()} stack. "
    if dep_url:
        summary_text += "The primary services are operational with a verified deployment endpoint."
    else:
        summary_text += "Infrastructure deployment is currently pending, indicating a requirement for manual environment verification."
    logs.append(f"[SUMMARY] {summary_text}")

    # Risk Assessment
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

    # Manual Actions
    if not img_url or not dep_url:
        logs.append("[MANUAL] Fix Docker build issues and validate Dockerfile repository structure.")
        logs.append("[MANUAL] Define correct application port configuration and ingress rules.")
        logs.append("[MANUAL] Identify and configure correct runtime environment and stack dependencies.")
        logs.append("[MANUAL] Verify cloud provider credentials and deployment stage permissions.")
        logs.append("[MANUAL] Re-run the migration deployment pipeline after addressing configuration errors.")
    else:
        logs.append("[MANUAL] Configure production environment variables and implement secure secrets management.")
        logs.append("[MANUAL] Set up cloud monitoring and automated alerting (e.g., logs, performance metrics).")
        logs.append("[MANUAL] Implement a CI/CD pipeline to automate future application deployments.")
        logs.append("[MANUAL] Configure custom domain and validate DNS routing records for the live service.")
        logs.append("[MANUAL] Perform security hardening including authentication and rate limiting configuration.")

    # AI SIGNATURE
    logs.append("[AI] CloudMorph-AI analysis complete. Actionable insights generated.")

    # -----------------------------
    # 8. REMOVE DUPLICATES
    # -----------------------------
    unique_logs = []
    seen = set()

    for log in logs:
        if isinstance(log, str) and log not in seen:
            unique_logs.append(log)
            seen.add(log)

    data["logs"] = unique_logs

    return data