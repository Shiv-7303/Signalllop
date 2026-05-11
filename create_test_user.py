import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('backend/.env')

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

try:
    # Use admin API to create a user that is automatically confirmed
    user = supabase.auth.admin.create_user({
        "email": "e4e_tester@signalloop.app",
        "password": "SecurePassword123!",
        "email_confirm": True,
        "user_metadata": {"full_name": "E4E Tester"}
    })
    print(f"User created: {user.user.id}")
except Exception as e:
    print(f"Error: {e}")
