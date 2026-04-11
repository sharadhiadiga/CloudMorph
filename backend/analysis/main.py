import sys 
import json 
import os 
from .extractor import extract_zip, get_all_files 
from .detector import detect_stack, detect_port, detect_app_name 
 
def analyze_application(source_path): 
    print(f"[Analysis] Starting analysis of: {source_path}") 
 
    extract_path = extract_zip(source_path, "extracted_app") 
    print(f"[Analysis] Extracted to: {extract_path}") 
 
    all_files = get_all_files(extract_path) 
    print(f"[Analysis] Found {len(all_files)} files") 
 
    stack = detect_stack(extract_path) 
    print(f"[Analysis] Detected stack: {stack}") 
 
    port = detect_port(stack, extract_path) 
    print(f"[Analysis] Suggested port: {port}") 
 
    app_name = detect_app_name(source_path) 
    print(f"[Analysis] App name: {app_name}") 
 
    result = { 
        "app_name": app_name, 
        "stack": stack, 
        "port": port, 
        "source_path": source_path, 
        "dockerfile_path": "", 
        "image_name": "", 
        "image_url": "", 
        "terraform_path": "", 
        "deployment_url": "", 
        "logs": [] 
    } 
 
    with open("analysis_output.json", "w") as f: 
        json.dump(result, f, indent=2) 
 
    print("[Analysis] Complete! JSON saved to analysis_output.json") 
    return result 
 
if __name__ == "__main__": 
    if len(sys.argv) < 2: 
        print("Usage: python -m backend.analysis.main ^<path-to-zip^>") 
        sys.exit(1) 
 
    result = analyze_application(sys.argv[1]) 
    print("\n" + "="*50) 
    print("FINAL OUTPUT JSON:") 
    print(json.dumps(result, indent=2)) 
