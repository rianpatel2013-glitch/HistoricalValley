from flask import Flask, send_from_directory, send_file, jsonify, request
from waitress import serve
import json
import os

app = Flask(__name__)

# Set the directories
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), 'frontend')
PAGES_DIR = os.path.join(FRONTEND_DIR, 'pages')
IMAGES_DIR = os.path.join(os.path.dirname(__file__), 'images')
BACKEND_DIR = os.path.join(os.path.dirname(__file__), 'backend')

# --- NEW: Define the JSON file path within the BACKEND_DIR ---
JSON_FILE_PATH = os.path.join(BACKEND_DIR, 'search.json')
# -----------------------------------------------------------

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

# Serve JS files from specific pages
@app.route('/<page_name>/<filename>.js')
def js(page_name, filename):
    page_folder = os.path.join(PAGES_DIR, page_name)
    return send_from_directory(page_folder, f'{filename}.js')

# Serve global CSS files and the home page's CSS file
@app.route('/<filename>.css')
def global_css(filename):
    if filename == 'home':
        return send_from_directory(PAGES_DIR, 'home.css')
    return send_from_directory(FRONTEND_DIR, f'{filename}.css')

# Serve the global JS file
@app.route('/navbar.js')
def global_js():
    return send_from_directory(FRONTEND_DIR, 'navbar.js')


if __name__ == '__main__':
    HOST = os.environ.get('FLASK_HOST', '0.0.0.0')
    PORT = int(os.environ.get('FLASK_PORT', 9000))

    serve(app, host=HOST, port=PORT)