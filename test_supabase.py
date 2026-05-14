import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('backend/.env')
url = os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
print(f"URL: {url}")
print(f"KEY starts with: {key[:10] if key else 'None'}")
try:
    supabase = create_client(url, key)
    print("Supabase client created successfully.")
except Exception as e:
    print(f"Failed: {e}")