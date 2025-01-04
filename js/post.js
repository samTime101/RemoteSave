async function readFile(){
    const file_data = await fetch('../js/token.txt');
    var token_data = await file_data.text()
    return token_data
  } 
async function post_data() {
    // var address = 'http://127.0.0.1:5000';
    var address = ''
    var space_name = document.querySelector('#space_name').value;
    var password = document.querySelector('#password').value;
    var result = document.querySelector("#result");

    if (space_name && password ) {
        var data = await fetch(`${address}/post`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Authorization": `Bearer ${await readFile()}`
            },
            body: `${space_name}->${password}`
        });
        var response = await data.text();
        console.log(response);
        result.innerHTML = response;
    } else {
        result.innerHTML = ">>connecting....";
    }
    document.querySelector('#button').innerText = 'Submit'
}

