from flask import Flask, request, jsonify
from flask_cors import CORS

from main import run_pipeline

app = Flask(__name__)
# Enable CORS for all routes (since the React frontend runs on localhost:3000)
CORS(app)

@app.route('/api/migrate', methods=['POST'])
def migrate():
    try:
        data = request.json or {}
        repo_url = data.get("repo_url", "")
        
        if not repo_url:
            return jsonify({"error": "repo_url cannot be empty"}), 400

        # Create initial data payload for the pipeline
        initial_state = {
            "repo_url": repo_url,
            # We purposely do not populate app_name, stack, etc. 
            # The dynamic analysis module will extract those!
        }
        
        # Run the pipeline just like we did in main.py tests
        # We pass case_label="LIVE API RUN" for logging clarity
        final_state = run_pipeline(initial_state, case_label="LIVE API RUN")
        
        # Strip temporary keys that might sneak in if mock testing passes them
        data_to_return = {k: v for k, v in final_state.items() if k != "repo_url"}
        
        # Enforce contract cleanup - remove trace_logs and ai_insights if they crept in from main test suite runs
        data_to_return.pop("trace_logs", None)
        data_to_return.pop("ai_insights", None)

        return jsonify(data_to_return), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on port 5000
    print("[INFO] Starting CloudMorph-AI Backend API on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
