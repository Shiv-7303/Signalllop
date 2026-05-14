import inspect
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
url = os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

print(inspect.signature(supabase.auth.get_user))
