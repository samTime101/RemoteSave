// yo chai GET ko address , yaha join ma get request matrai xa 
import { get } from "../server/credentials/export.js";

var address = ''

document.addEventListener("DOMContentLoaded", async () => {    
    address=  await get()
});

window.join = join;
window.redirect_ = redirect_;
async function join(){
    try{
    var space_name = document.querySelector('#join_space').value
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
        document.querySelector('#details').innerHTML += `<a class="list-group-item list-group-item-action" onclick="redirect_(this)">${item}</a>`;
    });
    }
    else{
     document.querySelector('#details').innerHTML = `ERROR : THE SPACE DOESNOT EXIST`
    }}
    catch(error){
        document.querySelector('#details').innerHTML = `ASK SAMIP TO TURN ON SERVER <br> THE SERVER IS CURRENTLY SWITCHED OFF`

    }
}

async function redirect_(a){
    var targeted_file_name = a.innerText
    var space_name = document.querySelector('#join_space').value
    var data = await fetch(`${address}/space/${space_name}/${targeted_file_name}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",

        }
    })
    var response_data = await data.text()
    console.log(response_data)
    var newWindow = window.open('', '_blank');
if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(`<pre>${response_data}</pre>`);
    newWindow.document.close();
} else {
    console.error("ERROR IN POP Up");
}
}