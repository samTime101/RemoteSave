# duitai get.py ra post.py in one file
from flask import Flask, request, Response
import os
import datetime
import json
from flask_cors import CORS
import shutil

app = Flask(__name__)
CORS(app)

#relative directory ra aru le problem naaaos vaenra rakheko
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, 'database')
PASSWORDS_DIR = os.path.join(BASE_DIR, 'passwords')

headers = {"Content-Type": "text/plain", "Accept": "Content-Type:text/plain"}

# return the content of the file
@app.route('/space/<spacename>/<filename>', methods=['GET'])
def content(spacename, filename):
    with open(os.path.join(DATABASE_DIR, spacename, filename), 'r') as file:
        content = file.read()
        return Response(content, status=200, headers=headers)

# yesle space ko name list garxa jaba user le see spaces ma janxa
@app.route('/list', methods=['GET'])
def list():
    spaces = os.listdir(DATABASE_DIR)
    return Response(json.dumps(spaces), status=200, mimetype='application/json')

# yele space ko content list garxa ,aaile ko lagi no authentication paxi handle garxu aru
@app.route('/space/<spacename>', methods=['GET'])
def space(spacename):
    space_path = os.path.join(DATABASE_DIR, spacename)
    if os.path.exists(space_path) and os.path.isdir(space_path):
        spaces = os.listdir(space_path)
        return Response(json.dumps(spaces), status=200, mimetype='application/json')
    else:
        error_message = {'error': 'Space does not exist'}
        return Response(json.dumps(error_message), status=404, mimetype='application/json')

@app.route('/about', methods=['GET'])
def about():
    about = 'MADE BY SAMIP REGMI FIRST COMMIT ON JAN 1 2025\nNAMASTE :) currently V-4TC\n'
    return Response(about, status=200)

@app.route('/login/<adminpass>', methods=['GET'])
def login_checker(adminpass):
    try:
        with open(os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass'), 'r') as x:
            y = x.read().strip()
            if y == adminpass:
                return Response("True", status=200)
            else:
                return Response("False", status=400)
    except FileNotFoundError:
        return Response("Password file not found", status=404)

# content write garda
@app.route('/post/<spacename>/<password>/<filename>', methods=['POST'])
def post_data(spacename, password, filename):
    content = request.data.decode()
    spacename = spacename.strip()
    filename = filename.strip()
    password_path = os.path.join(PASSWORDS_DIR, spacename, 'pass.pass')
    if os.path.exists(password_path):
        with open(password_path, 'r') as x:
            y = x.read().strip()
            if password == y:
                file_path = os.path.join(DATABASE_DIR, spacename, filename)
                if os.path.exists(file_path):
                    return Response("Invalid request: File already exists inside space\n", status=400)
                with open(file_path, 'w') as a:
                    formatted_content = f'{content}\n------\nBY SERVER\nADDED ON: {datetime.datetime.now().strftime("%c")}\n------'
                    a.write(formatted_content)
                    return Response('SUCCESS')
    return Response('SERVER ERROR:INVALID ACCESS')

# space banauda
@app.route('/post/<spacename>/<password>', methods=['POST'])
def create_space(spacename, password):
    spacename = spacename.strip()
    space_path = os.path.join(DATABASE_DIR, spacename)
    password_path = os.path.join(PASSWORDS_DIR, spacename)
    if not os.path.exists(space_path):
        os.makedirs(password_path)
        with open(os.path.join(password_path, 'pass.pass'), 'w') as file:
            file.write(password)
        os.makedirs(space_path)
        return Response(f'SUCCESSFULLY CREATED SPACE :{spacename}', status=200)
    return Response(f'SPACE ALREADY EXISTS {spacename}', status=400)

# ADMIN FUNCTIONS
# space ko file remove garna
@app.route('/remove_file/<adminpass>/<spacename>/<filename>', methods=['POST'])
def remove_file_data(spacename, filename, adminpass):
    file_path = os.path.join(DATABASE_DIR, spacename, filename)
    if os.path.exists(file_path):
        with open(os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass'), 'r') as x:
            y = x.read().strip()
            if y == adminpass:
                os.remove(file_path)
                return Response("Successfully removed", status=200)
    return Response("invalid request", status=400)

# space remove garne func
@app.route('/remove_space/<adminpass>/<spacename>', methods=['POST'])
def remove_space_data(spacename, adminpass):
    space_path = os.path.join(DATABASE_DIR, spacename)
    password_path = os.path.join(PASSWORDS_DIR, spacename)
    if os.path.exists(space_path):
        with open(os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass'), 'r') as x:
            y = x.read()
            if y == adminpass:
                shutil.rmtree(space_path)
                shutil.rmtree(password_path)
                return Response("Successfully removed", status=200)
    return Response("invalid request", status=400)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000 , debug=True)
