from flask import Flask, request, Response
import os

app = Flask(__name__)
headers = {"Content-Type": "text/plain"}

@app.route('/post', methods=['POST'])
def post_data():
    data = request.data.decode()
    if '->' not in data:
        return Response('NOT ALLOWED syntax: "filename"->"password"->"filedata\n"', status=400)
    else:
        splitted_data = data.split("->")
        filename = splitted_data[0]
        password = splitted_data[1]
        content = splitted_data[2]
        
        if not filename or not content:
            return Response("BRO empty file and content not allowed \n", status=400)
        
        if os.path.exists(filename):
            return Response("Invalid request: create a new filename, the space is already occupied\n", status=400)
        
        with open(f'./database/{filename}', 'w') as file:
            file.write(f"Password:{password}\n")
            file.write(content)
    
    return Response(f"POSTED in {filename}\n", headers=headers)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
