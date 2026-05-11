import os
try:
    import resend
except ImportError:
    resend = None

class EmailService:
    def __init__(self):
        self.api_key = os.environ.get('RESEND_API_KEY')
        if resend and self.api_key:
            resend.api_key = self.api_key

    def send_email(self, to, subject, html_content):
        """Sends an email using Resend."""
        if not resend or not self.api_key:
            print(f"WARNING: Resend not configured. Email to {to} NOT sent.")
            return False
            
        try:
            params = {
                "from": "AI Distribution Engine <onboarding@resend.dev>", # Replace with verified domain in prod
                "to": [to],
                "subject": subject,
                "html": html_content,
            }
            resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Resend Email Error: {e}")
            return False

    @staticmethod
    def get_welcome_template(name):
        return f"<h1>Welcome {name}!</h1><p>Thanks for joining AI Distribution Engine. Your growth journey starts here.</p>"

    @staticmethod
    def get_digest_template(business_name, stats):
        return f"<h1>Weekly Digest for {business_name}</h1><p>You have {stats.get('new_opportunities', 0)} new opportunities this week.</p>"
