import json
import time
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

from main import run_pipeline
# Also import individual modules for granular streaming control
from backend.analysis.analyze import analyze
from backend.docker.dockerize import dockerize
from backend.terraform.terraform import terraform
from backend.deploy.deploy import deploy
from backend.integration.report import generate_report

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

@app.route('/api/migrate', methods=['POST'])
def migrate():
    # Keep original for backward compatibility if needed, 
    # though frontend will switch to /api/stream
    try:
        data = request.json or {}
        repo_url = data.get("repo_url", "")
        if not repo_url:
            return jsonify({"error": "repo_url cannot be empty"}), 400
        initial_state = {"repo_url": repo_url}
        final_state = run_pipeline(initial_state, case_label="LIVE API RUN")
        data_to_return = {k: v for k, v in final_state.items() if k != "repo_url"}
        data_to_return.pop("trace_logs", None)
        data_to_return.pop("ai_insights", None)
        return jsonify(data_to_return), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stream', methods=['POST'])
def stream():
    data = request.json or {}
    repo_url = data.get("repo_url", "")
    
    if not repo_url:
        return jsonify({"error": "repo_url cannot be empty"}), 400

    def generate():
        state = {"repo_url": repo_url, "logs": []}
        
        stages = [
            ("Initializing Pipeline", 5,  None),
            ("Analyzing Repository",  15, analyze),
            ("Generating Docker Config", 30, dockerize),
            ("Building Container Image", 45, None), # Simulation step
            ("Provisioning Infrastructure", 65, terraform),
            ("Deploying Application", 85, deploy),
            ("Finalizing Report", 100, generate_report)
        ]

        for i, (name, progress, func) in enumerate(stages):
            # Update state if function provided
            if func:
                try:
                    state = func(state)
                except Exception as e:
                    state["logs"].append(f"[ERROR] Stage {name} failed: {str(e)}")
            
            # Reduced delay for frontend buffering
            time.sleep(0.5)
            
            # Prepare payload for this chunk
            payload = {
                "status": "running" if progress < 100 else "completed",
                "current_stage": name,
                "current_stage_index": i,
                "progress": progress,
                "logs": state.get("logs", []),
                # Include full data only in the final step or as it populates
                "data": state if progress == 100 else None 
            }
            
            yield json.dumps(payload) + "\n"

    return Response(stream_with_context(generate()), mimetype='application/x-ndjson')

if __name__ == '__main__':
    print("[INFO] Starting CloudMorph Streaming API on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
