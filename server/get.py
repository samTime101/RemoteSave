from flask import Flask, request, Response
import os
import datetime
import json

app = Flask(__name__)
headers = {"Content-Type": "text/plain"}

# return the content of the file
@app.route('/space/<spacename>/<filename>', methods=['GET'])
def content(spacename,filename):
    with open(f'./database/{spacename}/{filename}','r') as file:
        content = file.read()
        return Response(content,status=200,headers=headers)

# yesle space ko name list garxa jaba user le see spaces ma janxa
@app.route('/list', methods=['GET'])
def list():
    spaces = os.listdir('./database/')
    return Response(json.dumps(spaces),status=200,mimetype='application/json')

#yele space ko content list garxa ,aaile ko lagi no authentication paxi handle garxu aru  
@app.route('/space/<spacename>', methods=['GET'])
def space(spacename):
    if os.path.exists(f'./database/{spacename}') and os.path.isdir(f'./database/{spacename}'):
        spaces = os.listdir(f'./database/{spacename}')
        return Response(json.dumps(spaces),status=200,mimetype='application/json')
    else:
        error_message = {'error': 'Space does not exist'}
        return Response(json.dumps(error_message), status=404, mimetype='application/json')


@app.route('/about', methods=['GET'])
def about():
    about = 'MADE BY SAMIP REGMI FIRST COMMIT ON JAN 1 2025\nNAMASTE :) currently V-4TC\n'
    return Response(about,status=200)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
