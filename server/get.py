from flask import Flask,request,Response
app = Flask(__name__)
headers = {"Content-Type": "text/plain", "Accept": "Content-Type:text/plain"}

@app.route('/get', methods=['GET'])
def fetch_data():
    with open('./main.txt','r') as file:
        fread = file.read()
    return Response(f"{fread}\n",headers=headers)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)



