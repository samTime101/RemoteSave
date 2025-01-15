from flask import Flask, request, Response
import os
import datetime
from flask_cors import CORS 
import shutil

app = Flask(__name__)
CORS(app) 
headers = {"Content-Type": "text/plain", "Accept": "Content-Type:text/plain"}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, 'database')
PASSWORDS_DIR = os.path.join(BASE_DIR, 'passwords')

# content write garda
@app.route('/post/<spacename>/<password>/<filename>',methods=['POST'])
def post_data(spacename,password,filename):
    content = request.data.decode()
    pass_path = os.path.join(PASSWORDS_DIR, spacename, 'pass.pass')
    with open(pass_path, 'r') as x:
        y = x.read().strip()
        if password == y:
            file_path = os.path.join(DATABASE_DIR, spacename, filename)
            if os.path.exists(file_path):
                return Response("Invalid request: File already exists inside space\n", status=400)
            with open(file_path, 'w') as a:
                formatted_content = f'{content}\n------\nBY SERVER\nADDED ON: {datetime.datetime.now().strftime("%c")}\n------'
                a.write(formatted_content)
                return Response('SUCCESS')
        else:
            return Response('SERVER ERROR:INVALID ACCESS')

# space banauda
@app.route('/post/<spacename>/<password>', methods=['POST'])
def create_space(spacename, password):
    space_path = os.path.join(DATABASE_DIR, spacename)
    pass_dir = os.path.join(PASSWORDS_DIR, spacename)
    if not os.path.exists(space_path):
        os.makedirs(pass_dir)
        with open(os.path.join(pass_dir, 'pass.pass'), 'w') as file:
            file.write(password)
        os.makedirs(space_path)
        return Response(f'SUCCESSFULLY CREATED SPACE :{spacename}', status=200)
    return Response(f'SPACE ALREADY EXISTS {spacename}', status=400)

# ADMIN FUNCTIONS
@app.route('/remove_file/<adminpass>/<spacename>/<filename>', methods=['POST'])
def remove_file_data(spacename,filename,adminpass):
    file_path = os.path.join(DATABASE_DIR, spacename, filename)
    admin_pass_path = os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass')
    if os.path.exists(file_path):
        with open(admin_pass_path, 'r') as x:
            y = x.read().strip()
            if y == adminpass:
                os.remove(file_path)
                return Response("Successfully removed",status=200)
            return Response("invalid request",status=400)
    return Response("invalid request",status=400)

@app.route('/remove_space/<adminpass>/<spacename>', methods=['POST'])
def remove_space_data(spacename,adminpass):
    space_path = os.path.join(DATABASE_DIR, spacename)
    pass_path = os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass')
    if os.path.exists(space_path):
        with open(pass_path, 'r') as x:
            y = x.read()
            if y == adminpass:
                shutil.rmtree(space_path)
                shutil.rmtree(os.path.join(PASSWORDS_DIR, spacename))
                return Response("Successfully removed",status=200)
            return Response("invalid request",status=400)
    return Response("invalid request",status=400)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
