from flask import Flask, request, Response
app = Flask(__name__)
headers = {"Content-Type": "text/plain", "Accept": "Content-Type:text/plain"}

@app.route('/post', methods=['POST'])
def post_data():
    data = request.data.decode()
    with open('./main.txt','w') as file:
        fwrite = file.write(data)
    return Response(f"POSTED{data}\n", headers=headers)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


