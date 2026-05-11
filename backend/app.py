import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Tracing
    from backend.utils.tracing import setup_tracing
    setup_tracing(app)

    # Initialize CORS
    CORS(app, resources={r"/*": {"origins": "*"}}) # Update with Vercel domain in production

    # Initialize Rate Limiter
    from backend.utils.limiter import setup_limiter
    limiter = setup_limiter(app)

    # Initialize Scheduler
    from apscheduler.schedulers.background import BackgroundScheduler
    from apscheduler.events import EVENT_JOB_ERROR
    import atexit
    
    scheduler = BackgroundScheduler(timezone="Asia/Kolkata")

    def job_error_listener(event):
        if event.exception:
            logger.error(f"Background Job {event.job_id} failed: {event.exception}")
        else:
            logger.warning(f"Background Job {event.job_id} failed with no exception.")

    scheduler.add_listener(job_error_listener, EVENT_JOB_ERROR)
    
    # Register Jobs (Phases 4.2, 4.3, 4.4)
    # Note: These will be implemented in their respective files
    try:
        from backend.jobs.weekly_digest import run_weekly_digest
        from backend.jobs.trend_scanner import run_opportunity_scanner
        from backend.jobs.competitor_monitor import run_competitor_monitor
        
        scheduler.add_job(func=run_weekly_digest, trigger="cron", day_of_week="mon", hour=6, minute=0)
        scheduler.add_job(func=run_opportunity_scanner, trigger="interval", hours=4)
        scheduler.add_job(func=run_competitor_monitor, trigger="cron", hour=8, minute=0)
        
        scheduler.start()
        logger.info("Background Scheduler started")
    except ImportError as e:
        logger.warning(f"Background jobs not fully implemented yet: {e}")
    except Exception as e:
        logger.error(f"Failed to start scheduler: {e}")

    atexit.register(lambda: scheduler.shutdown())

    # Register Blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.usage import usage_bp
    from backend.routes.businesses import businesses_bp
    from backend.routes.competitors import competitors_bp
    from backend.routes.reports import reports_bp
    from backend.routes.opportunities import opportunities_bp
    from backend.routes.billing import billing_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(usage_bp, url_prefix='/usage')
    app.register_blueprint(businesses_bp, url_prefix='/businesses')
    app.register_blueprint(competitors_bp, url_prefix='/businesses')
    app.register_blueprint(reports_bp, url_prefix='/reports')
    app.register_blueprint(opportunities_bp, url_prefix='/opportunities')
    app.register_blueprint(billing_bp, url_prefix='/billing')

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "ok", 
            "environment": app.config['FLASK_ENV']
        }), 200

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal Server Error: {error}")
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(405)
    def method_not_allowed_error(error):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"Unhandled Exception: {e}")
        return jsonify({"error": str(e)}), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], port=int(os.getenv('PORT', 5000)))
