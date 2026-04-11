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
    # 6. CONFIDENCE SCORE
    # -----------------------------
    if dep_url:
        logs.append("[INFO] Migration confidence: HIGH")
    else:
        logs.append("[INFO] Migration confidence: LOW")

    # -----------------------------
    # 7. AI SIGNATURE
    # -----------------------------
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