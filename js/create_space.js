const address =  'http://127.0.0.1:5000'

async function create_space(){
    var spacename = document.querySelector('#spacename').value
    var password = document.querySelector('#password').value
    var data = await fetch(`${address}/post/${spacename}/${password}`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
    });
    var response = await data.text()
    document.querySelector('#details').innerHTML = response
}