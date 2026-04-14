# Skill: Website Mirror
**Purpose:** Use `pywebcopy` to download a fully intact, offline mirror of a template's demo website for rapid integration.

## Usage prerequisites
Run the following in the terminal before using:
```bash
pip install pywebcopy
```

## Python Script Execution
The `mirror.py` script automates the process. To mirror a website:

1. Run the Python script from the frontend root:
```bash
python automation/skills/mirror.py <URL> <ProjectName>
```

2. The output will be saved to `vimi-frontend/templates/<ProjectName>`.

## Follow-up Action
Once mirrored, locate the main `index.html` and its associated CSS/JS folders, moving them incrementally into Vimi's public or component directories safely.
