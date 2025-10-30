from flask import Flask, send_from_directory, send_file
from waitress import serve
from flask_cors import CORS
import os

from backend.search import chat_post, chat_get

app = Flask(__name__)
CORS(app)

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), 'frontend')
PAGES_DIR = os.path.join(FRONTEND_DIR, 'pages')
IMAGES_DIR = os.path.join(FRONTEND_DIR, 'images')
BACKEND_DIR = os.path.join(os.path.dirname(__file__), 'backend')
JSON_FILE_PATH = os.path.join(BACKEND_DIR, 'search.json')

# Serve the root/home page
@app.route('/')
@app.route('/index.html')
def index():
    return send_file(os.path.join(PAGES_DIR, 'index.html'))

# Serve images
@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory(IMAGES_DIR, filename)

# Serve other HTML files
@app.route('/<page_name>/<filename>.html')
def html(page_name, filename):
    page_folder = os.path.join(PAGES_DIR, page_name)
    return send_file(os.path.join(page_folder, f'{filename}.html'))

# Serve CSS files for specific pages
@app.route('/<page_name>/<filename>.css')
def css(page_name, filename):
    page_folder = os.path.join(PAGES_DIR, page_name)
    return send_from_directory(page_folder, f'{filename}.css')

# Serve JS files for specific pages
@app.route('/<page_name>/<filename>.js')
def js(page_name, filename):
    page_folder = os.path.join(PAGES_DIR, page_name)
    return send_from_directory(page_folder, f'{filename}.js')

# Serve home.css and home.js from pages directory
@app.route('/home.css')
def home_css():
    return send_from_directory(PAGES_DIR, 'home.css')

@app.route('/home.js')
def home_js():
    return send_from_directory(PAGES_DIR, 'home.js')

# Serve map.js from pages directory
@app.route('/map.js')
def map_js():
    return send_from_directory(PAGES_DIR, 'map.js')

# Serve global CSS files (global.css and navbar.css)
@app.route('/<filename>.css')
def global_css(filename):
    return send_from_directory(FRONTEND_DIR, f'{filename}.css')

# Serve the global JS file
@app.route('/navbar.js')
def global_js():
    return send_from_directory(FRONTEND_DIR, 'navbar.js')

# AI Chat API
@app.route('/api/chat', methods=['POST'])
def api_chat_post():
    return chat_post()

@app.route('/api/chat', methods=['GET'])
def api_chat_get():
    return chat_get()

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 8000))
    HOST = '0.0.0.0'
    serve(app, host=HOST, port=PORT)