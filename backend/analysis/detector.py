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
def detect_stack_version(extracted_path, stack):
    if stack == 'python':
        # Method 1: Check runtime.txt
        runtime_path = os.path.join(extracted_path, 'runtime.txt')
        if os.path.exists(runtime_path):
            with open(runtime_path, 'r') as f:
                version = f.read().strip()
                if version.startswith('python-'):
                    return version.replace('python-', '')
                return version
        
        # Method 2: Check requirements.txt for python version
        req_path = os.path.join(extracted_path, 'requirements.txt')
        if os.path.exists(req_path):
            with open(req_path, 'r') as f:
                content = f.read()
                lines = content.split('\n')
                for line in lines:
                    # Look for python==3.9, python3.9, python-3.9, etc.
                    if 'python' in line.lower():
                        import re
                        match = re.search(r'python[= -]*(\d+\.\d+)', line.lower())
                        if match:
                            return match.group(1)
        
        # Method 3: Check Pipfile
        pipfile_path = os.path.join(extracted_path, 'Pipfile')
        if os.path.exists(pipfile_path):
            with open(pipfile_path, 'r') as f:
                content = f.read()
                if 'python_version' in content:
                    import re
                    match = re.search(r'python_version\s*=\s*"(\d+\.\d+)"', content)
                    if match:
                        return match.group(1)
        
        # Method 4: Check setup.py
        setup_path = os.path.join(extracted_path, 'setup.py')
        if os.path.exists(setup_path):
            with open(setup_path, 'r') as f:
                content = f.read()
                import re
                match = re.search(r'python_requires\s*=[\'"]>=(\d+\.\d+)', content)
                if match:
                    return match.group(1)
        
        # Method 5: Check .python-version file
        pyversion_path = os.path.join(extracted_path, '.python-version')
        if os.path.exists(pyversion_path):
            with open(pyversion_path, 'r') as f:
                return f.read().strip()
        
        return 'unknown'
    
    elif stack == 'nodejs':
        pkg_path = os.path.join(extracted_path, 'package.json')
        if os.path.exists(pkg_path):
            try:
                with open(pkg_path, 'r') as f:
                    pkg = json.load(f)
                    engines = pkg.get('engines', {})
                    if 'node' in engines:
                        return engines['node']
                    # Check devDependencies for node version hints
                    dev_deps = pkg.get('devDependencies', {})
                    for dep, version in dev_deps.items():
                        if '@types/node' in dep:
                            return version.replace('^', '').replace('~', '')
            except:
                pass
        return 'unknown'
    
    elif stack == 'java':
        pom_path = os.path.join(extracted_path, 'pom.xml')
        if os.path.exists(pom_path):
            with open(pom_path, 'r') as f:
                content = f.read()
                if '<java.version>17' in content:
                    return '17'
                if '<java.version>11' in content:
                    return '11'
                if '<java.version>1.8' in content or '<java.version>8' in content:
                    return '8'
                if '<java.version>21' in content:
                    return '21'
        gradle_path = os.path.join(extracted_path, 'build.gradle')
        if os.path.exists(gradle_path):
            with open(gradle_path, 'r') as f:
                content = f.read()
                if "JavaVersion.VERSION_21" in content:
                    return '21'
                if "JavaVersion.VERSION_17" in content:
                    return '17'
                if "JavaVersion.VERSION_11" in content:
                    return '11'
                if "JavaVersion.VERSION_1_8" in content:
                    return '8'
        return 'unknown'
    
    elif stack == 'static':
        return 'html5'
    
    return 'unknown'