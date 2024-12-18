#ProxyAuthRequired/backend/app.py

from flask import Flask
from flask_socketio import SocketIO
from dotenv import load_dotenv
from flask_cors import CORS
from flask_session import Session
from pymongo import MongoClient
import redis
import os
import logging
from flask import request, jsonify
from routes.xploit_routes import xploit_bp  
from routes.scenario_routes import scenario_bp 
from routes.analogy_routes import analogy_bp
from routes.email_routes import email_bp
from routes.subscribe_routes import subscribe_bp
from routes.unsubscribe_routes import unsubscribe_bp
from routes.update_routes import update_bp
from database.models import create_user
from routes.grc_routes import grc_bp
from routes.log_routes import log_bp





load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


mongo_uri = os.getenv("MONGO_URI")


client = MongoClient(mongo_uri)


db = client.get_database()


    

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')



app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'flask_session:'
app.config['SESSION_REDIS'] = redis.StrictRedis(host='redis', port=6379, db=0)

Session(app)


@app.route('/health')
def home():
    return 'Backend is running'


@app.before_request
def log_request_info():
    logger.info(f"Handling request to {request.path} with method {request.method}")
    
    
app.register_blueprint(xploit_bp, url_prefix='/payload')
app.register_blueprint(scenario_bp, url_prefix='/scenario')
app.register_blueprint(analogy_bp, url_prefix='/analogy')
app.register_blueprint(email_bp, url_prefix='/email')
app.register_blueprint(subscribe_bp, url_prefix='/subscribe')
app.register_blueprint(unsubscribe_bp, url_prefix='/unsubscribe')
app.register_blueprint(update_bp, url_prefix='/update')
app.register_blueprint(grc_bp, url_prefix='/grc')
app.register_blueprint(log_bp, url_prefix='/logs')

@app.route('/register', methods=['POST'])
def register():
    user_data = request.json
    user_id = create_user(user_data)
    return jsonify({"message": "User created", "user_id": str(user_id)})
    


# WebSocket for real-time updates
@socketio.on('connect')
def handle_connect():
    logger.info('Client connected')
    socketio.emit('message', {'data': 'Connected to server'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)

