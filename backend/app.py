#xploitcraft/backend/app.py

from flask import Flask
from flask_socketio import SocketIO
from dotenv import load_dotenv
from flask_cors import CORS
from flask_session import Session
import redis
import os
import logging
from routes.payload_routes import payload_bp  #payload-related routes
from routes.scenario_routes import scenario_bp #scenario routes
from routes.analogy_routes import analogy_bp




# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask, CORS, and SocketIO
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

app.config['SECRET_KEY'] = '69420yoshi2003llmp0p1sealingtechSAAS'  # Replace this with a long, secure random value

# Redis configuration for sessions
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'flask_session:'
app.config['SESSION_REDIS'] = redis.StrictRedis(host='redis', port=6379, db=0)

Session(app)

# Register blueprints
app.register_blueprint(payload_bp, url_prefix='/api')
app.register_blueprint(scenario_bp, url_prefix='/scenario')
app.register_blueprint(analogy_bp, url_prefix='/analogy')

# WebSocket for real-time updates
@socketio.on('connect')
def handle_connect():
    logger.info('Client connected')
    socketio.emit('message', {'data': 'Connected to server'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)

