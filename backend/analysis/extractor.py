import zipfile 
import os 
import shutil 
 
def extract_zip(zip_path, extract_to="extracted_app"): 
    if os.path.exists(extract_to): 
        shutil.rmtree(extract_to) 
    os.makedirs(extract_to, exist_ok=True) 
    with zipfile.ZipFile(zip_path, 'r') as zip_ref: 
        zip_ref.extractall(extract_to) 
    return extract_to 
 
def get_all_files(directory): 
    file_paths = [] 
    for root, dirs, files in os.walk(directory): 
        for file in files: 
            full_path = os.path.join(root, file) 
            rel_path = os.path.relpath(full_path, directory) 
            file_paths.append(rel_path) 
    return file_paths 
