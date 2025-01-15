from flask import Flask, request, Response 
import os
import datetime
import json
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  
headers = {"Content-Type": "text/plain"}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, 'database')
PASSWORDS_DIR = os.path.join(BASE_DIR, 'passwords')

# return the content of the file
@app.route('/space/<spacename>/<filename>', methods=['GET'])
def content(spacename,filename):
    file_path = os.path.join(DATABASE_DIR, spacename, filename)
    with open(file_path, 'r') as file:
        content = file.read()
        return Response(content,status=200,headers=headers)

# yesle space ko name list garxa jaba user le see spaces ma janxa
@app.route('/list', methods=['GET'])
def list():
    spaces = os.listdir(DATABASE_DIR)
    return Response(json.dumps(spaces),status=200,mimetype='application/json')

# yele space ko content list garxa ,aaile ko lagi no authentication paxi handle garxu aru  
@app.route('/space/<spacename>', methods=['GET'])
def space(spacename):
    space_path = os.path.join(DATABASE_DIR, spacename)
    if os.path.exists(space_path) and os.path.isdir(space_path):
        spaces = os.listdir(space_path)
        return Response(json.dumps(spaces),status=200,mimetype='application/json')
    else:
        error_message = {'error': 'Space does not exist'}
        return Response(json.dumps(error_message), status=404, mimetype='application/json')

@app.route('/about', methods=['GET'])
def about():
    about = 'MADE BY SAMIP REGMI FIRST COMMIT ON JAN 1 2025\nNAMASTE :) currently V-4TC\n'
    return Response(about,status=200)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080,debug=True)
