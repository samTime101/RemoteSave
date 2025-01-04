async function readFile(){
    const file_data = await fetch('../js/token.txt');
    var token_data = await file_data.text()
    return token_data
  } 
var space_name = ""
async function fetch_data(){
// var address= 'http://127.0.0.1:8080'
var address = ''


    var data = await fetch(`${address}/list`,{
            method:"GET",
            headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${await readFile()}`

            }
    })
    var response = await data.json()
    console.log(response)
    response.forEach(item => {
        document.querySelector('#list').innerHTML += `<br><li><a onclick="join(this)">${item}</a></li>`;
    });
}
async function join(b){
    // var address= 'http://127.0.0.1:8080'
    var address = ''
     space_name = b.innerText
    var data = await fetch(`${address}/space/${space_name}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${await readFile()}`

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
// var address = 'http://127.0.0.1:8080';
var address = ''
var data = await fetch(`${address}/space/${space_name}/${targeted_file_name}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await readFile()}`
    
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
    console.error("Unable to open new window. Check your browser's popup blocker settings.");
}
}

//     async function redirect_(a) {
//     var targeted_file_name = a.innerText;
//     var address = 'http://127.0.0.1:8080';
//     var file_url = `${address}/space/${space_name}/${targeted_file_name}`;
//     var anchor = document.createElement('a');
//     anchor.href = file_url;
//     anchor.target = '_blank';
//     anchor.rel = 'noopener noreferrer';
//     anchor.click();
// }
