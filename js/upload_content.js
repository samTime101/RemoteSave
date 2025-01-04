async function readFile(){
    const file_data = await fetch('../js/token.txt');
    var token_data = await file_data.text()
    return token_data
  } 
async function post_data() {
    // var address = 'http://127.0.0.1:5000';
    var address = ''
    var spacename = document.querySelector('#spacename').value;
    var password = document.querySelector('#password').value;
    var filename = document.querySelector('#filename').value;
    var password = document.querySelector('#password').value;
    var content = document.querySelector('#text_content').value;
    var result = document.querySelector("#result");
        var data = await fetch(`${address}/post/${spacename}/${password}/${filename}`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Authorization": `Bearer ${await readFile()}`

            },
            body: `${content}`
        });
        var response = await data.text();
        console.log(response);
        result.innerHTML = response

}
