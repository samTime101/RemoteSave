from flask import Flask, request, Response
import os
import datetime
from flask_cors import CORS 
import shutil

app = Flask(__name__)
CORS(app) 
headers = {"Content-Type": "text/plain", "Accept": "Content-Type:text/plain"}

# content write garda
@app.route('/post/<spacename>/<password>/<filename>',methods=['POST'])
def post_data(spacename,password,filename):
    content = request.data.decode()
    with open(f'./passwords/{spacename}/pass.pass','r') as x:
        y = x.read().strip()
        if password == y:
            if os.path.exists(f'./database/{spacename}/{filename}'):
                return Response("Invalid request: File already exists inside space\n", status=400)
            with open(f'./database/{spacename}/{filename}','w') as a:
                formatted_content = f'{content}\n------\nBY SERVER\nADDED ON: {datetime.datetime.now().strftime("%c")}\n------'
                b = a.write(formatted_content)
                return Response('SUCCESS')
        else:
            return Response('SERVER ERROR:INVALID ACCESS')
# space banauda
@app.route('/post/<spacename>/<password>', methods=['POST'])
def create_space(spacename, password):
    if not os.path.exists(f'./database/{spacename}'):
        os.makedirs(f'./passwords/{spacename}')
        with open(f'./passwords/{spacename}/pass.pass','w') as file:
            saved_pass = file.write(password)
        os.makedirs(f'./database/{spacename}')
        return Response(f'SUCCESSFULLY CREATED SPACE :{spacename}', status=200)
    return Response(f'SPACE ALREADY EXISTS {spacename}', status=400)

# ADMIN FUNCTIONS
# space ko file remove garna 
@app.route('/remove_file/<adminpass>/<spacename>/<filename>', methods=['POST'])
def remove_file_data(spacename,filename,adminpass):
    if os.path.exists(f'./database/{spacename}/{filename}'):
        with open('./passwords/admin/pass.pass','r') as x:
            y = x.read().strip()
            if y == adminpass:
                os.remove(f'./database/{spacename}/{filename}')
                return Response("Successfully removed",status=200)
            return Response("invalid request",status=400)
    return Response("invalid request",status=400)

# space remove garne func
@app.route('/remove_space/<adminpass>/<spacename>', methods=['POST'])
def remove_space_data(spacename,adminpass):
    if os.path.exists(f'./database/{spacename}'):
        with open('./passwords/admin/pass.pass','r') as x:
            y = x.read()
            if y == adminpass:
                shutil.rmtree(f'./database/{spacename}')
                shutil.rmtree(f'./passwords/{spacename}')
                return Response("Successfully removed",status=200)
            return Response("invalid request",status=400)
    return Response("invalid request",status=400)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
