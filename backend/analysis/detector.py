import os
import os
import json

def detect_stack(extracted_path):
    files = []
    for root, dirs, filenames in os.walk(extracted_path):
        for f in filenames:
            files.append(f)

    if any(f.endswith('.java') for f in files) or 'pom.xml' in files or 'build.gradle' in files:
        return 'java'
    if 'requirements.txt' in files or 'setup.py' in files or 'Pipfile' in files:
        return 'python'
    if 'package.json' in files:
        return 'nodejs'
    if any(f.endswith('.html') for f in files):
        return 'static'
    return 'unknown'

def detect_port(stack, extracted_path):
    defaults = {
        'python': 5000,
        'nodejs': 3000,
        'java': 8080,
        'static': 8080,
        'unknown': 8080
    }
    return defaults.get(stack, 8080)

def detect_app_name(zip_path):
    base_name = os.path.basename(zip_path)
    name = base_name.replace('.zip', '').replace('.tar.gz', '')
    name = name.replace(' ', '_').lower()
    return name

def detect_database(extracted_path):
    files = []
    for root, dirs, filenames in os.walk(extracted_path):
        for f in filenames:
            files.append(f)
    
    if any('mysql' in f.lower() for f in files) or 'my.cnf' in files:
        return 'mysql'
    if any('postgres' in f.lower() for f in files) or 'pg_hba.conf' in files:
        return 'postgresql'
    if 'mongodb' in files or 'mongod.conf' in files:
        return 'mongodb'
    if 'oracle' in files or 'tnsnames.ora' in files:
        return 'oracle'
    return 'none'