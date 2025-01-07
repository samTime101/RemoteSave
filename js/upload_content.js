
const address = 'http://127.0.0.1:5000';
async function post_data() {
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

            },
            body: `${content}`
        });
        var response = await data.text();
        console.log(response);
        result.innerHTML = response

}
