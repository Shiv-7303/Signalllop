import os
import requests

RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
RESEND_URL = "https://api.resend.com/emails"

def send_email(to: str, subject: str, html: str):
    if not RESEND_API_KEY:
        print(f"Warning: RESEND_API_KEY not found. Skipping email to {to}")
        return

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "from": "SignalLoop <onboarding@resend.dev>",
        "to": [to],
        "subject": subject,
        "html": html
    }

    try:
        response = requests.post(RESEND_URL, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Email sent successfully to {to}")
    except Exception as e:
        print(f"Failed to send email to {to}: {e}")

def send_report_ready_email(to: str, name: str, business_name: str, growth_score: int):
    subject = f"Your SignalLoop Report for {business_name} is Ready!"
    html = f"""
    <h2>Hi {name or 'there'},</h2>
    <p>Great news! The AI has finished analyzing the market for <strong>{business_name}</strong>.</p>
    <p>Your Growth Opportunity Score is: <strong>{growth_score}/100</strong>.</p>
    <p><a href="http://10.166.96.7:3000/dashboard/reports/latest">Click here to view your full report</a></p>
    <p>Best,<br>The SignalLoop Team</p>
    """
    send_email(to, subject, html)

def send_weekly_digest_email(to: str, name: str, business_name: str, digest: dict):
    subject = f"Weekly Growth Digest: {business_name}"
    html = f"""
    <h2>Hi {name or 'there'},</h2>
    <p>Here is your weekly growth digest for <strong>{business_name}</strong>:</p>
    <p>{digest.get('summary', 'New opportunities await in your dashboard.')}</p>
    <p><a href="http://10.166.96.7:3000/dashboard/opportunities">View Opportunities</a></p>
    """
    send_email(to, subject, html)
