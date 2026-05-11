from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import g

limiter = Limiter(key_func=get_remote_address, default_limits=["100 per minute"])

def setup_limiter(app):
    limiter.init_app(app)
    limiter.storage_uri = app.config.get('REDIS_URL', 'memory://')

    @limiter.request_filter
    def exempt_pro_users():
        # Users on 'pro' plan could be exempted or given higher limits
        if hasattr(g, 'user_plan') and g.user_plan == 'pro':
            return False 
        return False

    return limiter
