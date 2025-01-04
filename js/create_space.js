import { authenticate } from "./obuscated.js";
window.onload=()=>{
authenticate()
}
async function readFile(){
    const file_data = await fetch('../js/token.txt');
    var token_data = await file_data.text()
    return token_data
  } 

async function create_space(event){
    if (event) event.preventDefault();
    var spacename = document.querySelector('#spacename').value
    var password = document.querySelector('#password').value
    // var address =  'http://127.0.0.1:5000'
    var address = ''
    var data = await fetch(`${address}/post/${spacename}/${password}`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
            "Authorization": `Bearer ${await readFile()}`
        },
    });
    var response = await data.text()
    document.querySelector('#details').innerHTML = response
}