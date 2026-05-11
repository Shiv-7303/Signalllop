import os
import sys
from dotenv import load_dotenv

# Add the project root to path so we can import backend
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.services.email_service import EmailService

def test_email():
    # Load env from the backend folder
    env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
    load_dotenv(env_path)
    print(f"Loading env from: {env_path}")
    print(f"API Key present: {'Yes' if os.environ.get('RESEND_API_KEY') else 'No'}")
    
    print("Testing Resend Email Service...")
    
    email_service = EmailService()
    
    # Get the user's registered email if possible, or ask
    # Resend Free Tier restriction: Must send to account owner email
    test_receiver = "shivraj7303@gmail.com" 
    
    print(f"Attempting to send test email to: {test_receiver}")
    
    success = email_service.send_email(
        to=test_receiver,
        subject="SignalLoop Email Test",
        html_content="<h1>Connection Successful!</h1><p>If you are reading this, your Resend API integration is working perfectly.</p>"
    )
    
    if success:
        print("✅ SUCCESS: Email sent! Check your inbox (and spam folder).")
    else:
        print("❌ FAILURE: Email could not be sent. Check backend terminal logs for errors.")

if __name__ == "__main__":
    test_email()
