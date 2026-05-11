import os

def load_prompt(filename):
    """Reads a prompt template from the prompts directory."""
    # Assume prompts/ is at the same level as services/
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(current_dir, 'prompts', filename)
    
    try:
        with open(path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        print(f"ERROR: Prompt file {filename} not found at {path}")
        return ""
