import uuid
from flask import request, g

def setup_tracing(app):
    @app.before_request
    def add_request_id():
        request_id = request.headers.get('X-Request-Id', str(uuid.uuid4()))
        g.request_id = request_id

    @app.after_request
    def add_request_id_header(response):
        response.headers['X-Request-Id'] = getattr(g, 'request_id', 'unknown')
        return response
