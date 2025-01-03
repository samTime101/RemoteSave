from flask import Flask, request, Response
import os
import datetime
app = Flask(__name__)
headers = {"Content-Type": "text/plain"}

@app.route('/get/<filename>', methods=['GET'])
def fetch_data(filename):
    password = request.args.get('password')
    if not os.path.exists(f'./database/{filename}'):
        return Response(f"File {filename} not found.\n", status=404)
    with open(f"{filename}", 'r') as file:
        read = file.read()
        splitted_file = read.splitlines()
        password_file = splitted_file[0].replace('Password:',"").strip()
        content_file = splitted_file[1]
        if password != password_file:
            return Response('SERVER SIDE WARNING : INVALID PASSWORD !\n',status=200)
        
    return Response(f'SUCCESSFULLY AUTHENTICATED:{datetime.datetime.now().strftime("%Y-%m-%d %H:%M")}<br>FILENAME: {filename}<br>CONTENT: {content_file}\n',status=200)


@app.route('/about', methods=['GET'])
def about():
    about = 'MADE BY SAMIP REGMI FIRST COMMIT ON JAN 1 2025\nNAMASTE :) currently V-4TC\n'
    return Response(about,status=200)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
