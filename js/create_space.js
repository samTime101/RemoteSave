import { post } from "../server/credentials/export.js";

var address = ''

document.addEventListener("DOMContentLoaded", async () => {    
    address=  await post()
});
window.create_space = create_space;
window.listen_options = listen_options;

var create_space_option = document.querySelector('#create_space')
var create_subspace_option = document.querySelector('#create_subspace')
var span = document.querySelector('span')

function listen_options(){
if(create_space_option.checked){
  span.innerText = 'create'
  alert('space')
}
if (create_subspace_option.checked){
  span.innerText = 'sub'
  alert('subspace')
}
}

async function create_space(event){
  event.preventDefault();
    try{
    var spacename = document.querySelector('#spacename').value
    var password = document.querySelector('#password').value
    if(spacename.includes(' ')){
      alert('dont put space invalid')
      return
    }
    var data = await fetch(`${address}/${span.innerText}/${spacename}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
         body: password
    });
    var response = await data.json()
    console.log(response)
    if (data.status == 200){
        document.querySelector('#details').innerHTML = `      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </symbol>
      </svg>
      <div class="alert alert-success alert-dismissible fade show d-flex align-items-center mt-2" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
          <use xlink:href="#check-circle-fill"/>
        </svg>
        <div>
          Success
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div> `

    }
    else{
      document.querySelector('#details').innerHTML = `      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </symbol>
    </svg>
<div class="alert alert-danger d-flex align-items-center" role="alert">
  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
  <div>
    Error Response from Server
  </div> `
    }
}catch(error){
    document.querySelector('#details').innerHTML = `ASK SAMIP TO TURN ON SERVER <br> THE SERVER IS CURRENTLY SWITCHED OFF`
    
}
}