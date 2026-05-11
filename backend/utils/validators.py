import re

def validate_email(email):
    """Simple email validation."""
    if not email: return False
    # More robust regex
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))

def validate_url(url):
    """Simple URL validation."""
    if not url: return True # Optional fields
    return bool(re.match(r"^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", url))

def validate_plan(plan):
    """Validates if the plan is a valid enum value."""
    return plan in ["free", "starter", "pro"]

def validate_business_input(data):
    """Validates business creation/update data."""
    errors = []
    if not data.get('business_name'):
        errors.append("business_name is required")
    
    website = data.get('website')
    if website and not validate_url(website):
        errors.append("Invalid website URL format")
        
    return errors

def validate_business(data):
    """Matches checklist name for business validation."""
    errors = validate_business_input(data)
    is_valid = len(errors) == 0
    error_msg = errors[0] if not is_valid else ""
    return is_valid, error_msg

def sanitise_string(s, limit=500):
    """Strips whitespace, limits length, and removes null bytes."""
    if not s: return ""
    s = s.strip().replace('\0', '')
    return s[:limit]

def validate_competitor_limit(user_id):
    """Re-validates competitor limit before insert."""
    from backend.services.usage_service import UsageService
    return UsageService.check_competitor_limit(user_id)
