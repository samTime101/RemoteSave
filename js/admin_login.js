import { get } from "../server/credentials/export.js";

window.login = login;
async function login(){
var address = await get()
var username = document.querySelector('#username').value
var password = document.querySelector('#password').value

var res = await fetch(`${address}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:`${password}`
        });
    if (res.status == 200){
        alert("User validated")
        sessionStorage.setItem("authenticated", "true"); 
        window.location.href = '../pages/admin.html'
    }
    else{
        alert('Invalid admin login request')
    }
}

