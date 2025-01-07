
var space_name = ""
const address= 'http://127.0.0.1:8080'
async function fetch_data() {
    try {
        var data = await fetch(`${address}/list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        var response = await data.json();
        console.log(response);

        response.forEach(item => {
            document.querySelector('#list').innerHTML += `<br><li><a onclick="join(this)">${item}</a></li>`;
        });
    } catch (error) {
        document.querySelector('#list').innerHTML = 'ASK SAMIP TO TURN ON SERVER <br> THE SERVER IS CURRENTLY SWITCHED OFF'
    }
}

async function join(b){
     space_name = b.innerText
    var data = await fetch(`${address}/space/${space_name}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",

        }
    })
    var response = await data.json()
    document.querySelector('#details').innerHTML = ""
    document.querySelector('#status').innerText = ''
    if(data.ok){
    document.querySelector('#status').innerHTML = `CONNECTED TO ${space_name}`
    console.log(data.ok)
    response.forEach(item => {
        document.querySelector('#details').innerHTML += `<br><li><a onclick="redirect_(this)">${item}</a></li>`;
    });
    }
    else{
     document.querySelector('#details').innerHTML = `ERROR : THE SPACE DOESNOT EXIST`
    }
}
async function redirect_(a) {
var targeted_file_name = a.innerText;
var data = await fetch(`${address}/space/${space_name}/${targeted_file_name}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    
    }
});
var response_data = await data.text();
console.log(response_data);

var newWindow = window.open('', '_blank');
if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(`<pre>${response_data}</pre>`);
    newWindow.document.close();
} else {
    console.error("POP UP ERROR");
}
}

