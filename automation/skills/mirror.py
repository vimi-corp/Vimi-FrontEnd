import sys
import os
from pywebcopy import save_webpage

def mirror_website(url, project_name):
    # Set the destination directory relative to the script execution path
    project_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../templates'))
    
    os.makedirs(project_folder, exist_ok=True)
    
    print(f"Starting mirror for: {url}")
    print(f"Destination: {project_folder}/{project_name}")
    
    try:
        save_webpage(
            url=url,
            project_folder=project_folder,
            project_name=project_name,
            bypass_robots=True,
            debug=False,
            open_in_browser=False
        )
        print("Mirroring complete!")
    except Exception as e:
        print(f"Error mirroring website: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python mirror.py <URL> <ProjectName>")
        sys.exit(1)
        
    target_url = sys.argv[1]
    name = sys.argv[2]
    mirror_website(target_url, name)
