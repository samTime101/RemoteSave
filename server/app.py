# FEB 4 , SENDING DATA VIA JSON
# CODE BEING RE WRITTEN IN JAN 25,26,27
# AUTHOR SAMIP REGMI
# TODO [x] DONE: change the directly taken password from endpoint to JSON
# SHIT
# ADDED STATUS CODE 

# JULY 22
# ADDED TIME BASED SORTED LISTING

from flask import Flask, request, Response, jsonify
import os
import json
from flask_cors import CORS
import datetime
import shutil

app = Flask(__name__)
CORS(app)

# ---- RELATIVE DIRECTORY ASSIGNMENT ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, 'database')
PASSWORDS_DIR = os.path.join(BASE_DIR, 'passwords')
SPACES_DIR = os.path.join(DATABASE_DIR, 'space')

# ---- PATH FUNCTION ----
@app.route('/<path:spacename>', methods=['GET'])
def space(spacename):
    space_path = os.path.join(DATABASE_DIR, spacename)
    if not os.path.exists(space_path):
        return Response(json.dumps({"error": "Not Found" }), status=404, mimetype='application/json')

    if os.path.isdir(space_path):
        space_contents = os.listdir(space_path)
        # https://stackoverflow.com/questions/168409/how-do-you-get-a-directory-listing-sorted-by-creation-date-in-python
        # SEVENTH ANSWER by nic     
        full_list = [os.path.join(space_path,i) for i in space_contents]
        time_sorted_list = sorted(full_list, key=os.path.getmtime , reverse=True)
        sorted_filename_list = [ os.path.basename(i) for i in time_sorted_list]
        print(sorted_filename_list)
        return Response(json.dumps({"folder": sorted_filename_list}), status=200, mimetype='application/json')
        # return Response(json.dumps(space_contents), status=200, mimetype='application/json')

    if os.path.isfile(space_path):
        with open(f"{space_path}","r") as file:
            file_content = file.read()
            # return Response(file_content, status=200, mimetype='text/plain')
            return Response(json.dumps({"file" : file_content}), status=200, mimetype='text/plain')

# ---- SPACE CREATE ----
@app.route('/create/<spacename>', methods=['POST'])
def create_space(spacename):
    password = request.data.decode()
    spacename = spacename.strip()
    space_path = os.path.join(SPACES_DIR, spacename)
    password_path = os.path.join(PASSWORDS_DIR, spacename)

    if not os.path.exists(space_path):
        os.makedirs(password_path)
        with open(os.path.join(password_path, 'pass.pass'), 'w') as file:
            file.write(password)
        os.makedirs(space_path)
        return Response(json.dumps({"Success": "Successfully Created" }), status=200, mimetype='application/json')
    return Response(json.dumps({"Error": 'Path exists'}), status=400, mimetype='application/json')

#---- SUB SPACE CREATE ----
@app.route('/sub/<path:subspace_path>/<target>', methods=['POST'])
def create_subspace(subspace_path,target):
    password = request.data.decode()
    to_be_created = target
    space = subspace_path.strip().split("/")[0]

    space_path = os.path.join(SPACES_DIR, subspace_path)
    target_path = os.path.join(space_path,target)
    password_path = os.path.join(PASSWORDS_DIR, space)
    if not os.path.exists(space_path) :
        return Response(json.dumps({"Error": 'invalid path'}), status=400, mimetype='application/json')

    elif os.path.exists(space_path) and  os.path.exists(target_path):
        return Response(json.dumps({"Error": 'subspace already exists'}), status=400, mimetype='application/json')

    elif os.path.exists(space_path) and not os.path.exists(target_path):
        with open(os.path.join(password_path, 'pass.pass'), 'r') as file:
            file_content = file.read()
            if password == file_content:
                os.makedirs(target_path)
                return Response(json.dumps({"Success": f"subspace created | space: {os.path.join(subspace_path,target)}"}), status=200, mimetype='application/json')
            return Response(json.dumps({"Error": 'fuck it '}), status=400, mimetype='application/json')
        return Response(json.dumps({"Error": 'password didnt match'}), status=400, mimetype='application/json')
    return Response(json.dumps({"Error": 'inside else block'}), status=400, mimetype='application/json')

# ---- WRITE IN PATH ----
@app.route('/write/<path:target_path>/<filename>', methods=['POST'])
def post_data(target_path, filename):
    data = request.get_json()
    password = data.get("password", "").strip()
    content = data.get("content", "").strip()
    # content = request.data.decode()
    space = target_path.strip().split('/')[0]
    filename = filename.strip()

    password_path = os.path.join(PASSWORDS_DIR, space, 'pass.pass')
    space_path = os.path.join(SPACES_DIR, space)

    file_path = os.path.join(SPACES_DIR, target_path, filename)

    if not os.path.exists(space_path) or not os.path.exists(password_path):
        return Response(json.dumps({"Error": 'Space doesnot exists'}), status=400, mimetype='application/json')

    if os.path.exists(file_path):
        return Response(json.dumps({"Error": 'file already exists'}), status=400, mimetype='application/json')

    with open(password_path, 'r') as file:
        stored_password = file.read().strip()
        if password != stored_password:
            return Response(json.dumps({"Error": 'Wrong pass'}), status=400, mimetype='application/json')
        try:
            with open(file_path, 'w') as file:
                file_content = file.write(content)
                return Response(json.dumps({"Success": 'Written'}), status=200, mimetype='application/json')
        except Exception as e:
            return Response(json.dumps({"Error": 'File opening'}), status=400, mimetype='application/json')

    return Response(json.dumps({"Error": 'Invalid server access'}), status=400, mimetype='application/json')

#
#   ADMIN FUNCTIONS BELOW
#

# ---- LOGIN VALIDATER ----
@app.route('/login', methods=['POST'])
def login_checker():
    adminpass = request.data.decode()
    try:
        with open(os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass'), 'r') as file:
            file_content = file.read().strip()
            if file_content == adminpass:
                return Response("True", status=200)
            else:
                return Response("False", status=400)
    except FileNotFoundError:
        return Response("Password file not found", status=404)

# ---- REMOVE FILE ----
@app.route('/remove_file/<path:target_path>/<filename>', methods=['POST'])
def remove_file_data(target_path, filename):
    # mula k sochi rathe yaar yo lekhda , wasted so much time in this fucking single line
    # file_path = os.path.join(DATABASE_DIR,'space',target_path, filename)
    adminpass = request.data.decode()
    file_path = os.path.join(SPACES_DIR,target_path,filename)
    print(f"Trying to remove file at: {file_path}")

    if os.path.exists(file_path):
        with open(os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass'), 'r') as file:
            file_content = file.read().strip()
            if adminpass == file_content:
                os.remove(file_path)
                return Response(json.dumps({"Success": "removed"}), status=200, mimetype='application/json')
            return Response(json.dumps({"Error": "Invalid password"}), status=400, mimetype='application/json')
    return Response(json.dumps({"Error": "File doesnot exist"}), status=400, mimetype='application/json')


# ---- REMOVE SPACE OR SUB SPACE ----
@app.route('/remove_space/<path:target_path>', methods=['POST'])
def remove_space_data(target_path):
    adminpass = request.data.decode()
    space = target_path.strip().split('/')[0]
    space_path = os.path.join(SPACES_DIR, space)
    list_path = list(target_path.strip().split('/'))
    password_path = os.path.join(PASSWORDS_DIR, space)
    target_path = os.path.join(SPACES_DIR, target_path)
    if os.path.exists(target_path):
        with open(os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass'),'r') as file:
            file_content = file.read().strip()
            if adminpass == file_content:
                if len(list_path) > 1:
                    shutil.rmtree(target_path)
                    return Response(json.dumps({"Success": len(list_path)}), status=200, mimetype='application/json')
                else:
                    shutil.rmtree(password_path)
                    shutil.rmtree(target_path)
                    return Response(json.dumps({"Success": len(list_path)}), status=200, mimetype='application/json')
        return Response('opening error', status=400)
    return Response(json.dumps({"Error": len(list_path)}), status=400, mimetype='application/json')

# ---- EDIT CONTENT ----
@app.route('/edit/<path:target_path>/<filename>', methods=['POST'])
def edit_data(target_path, filename):
    data = request.get_json()
    password = data.get("password", "").strip()
    new_content = data.get("new_content", "").strip()
    target_path = target_path.strip()
    filename = filename.strip()
    password_path = os.path.join(PASSWORDS_DIR, 'admin', 'pass.pass')
    space_path = os.path.join(SPACES_DIR,target_path.strip().split('/')[0])
    file_path = os.path.join(os.path.join(SPACES_DIR,target_path),filename)

    if not os.path.exists(space_path):
        return Response("Error: space does not exist\n", status=400)

    if not os.path.exists(password_path):
        return Response("Error: space does not exist\n", status=400)

    with open(password_path, 'r') as file:
        stored_password = file.read().strip()
        if password != stored_password:
            return Response("wrong pass\n", status=400)
    if os.path.exists(file_path):
        with open(file_path, 'w') as file:
            # updated content lai save garne , paili logs haru hunthyo maile remove garidiye
            formatted_content = f"{new_content}"
            file.write(formatted_content)
            return Response('SUCCESS', status=200)

    return Response({file_path}, status=500)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
