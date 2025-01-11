import { password_prompt } from './passprompt.js';
import {get,post} from '../server/credentials/export.js'
var address_get ;
var address_post;
var space_name;
var targeted_file_name;

document.addEventListener("DOMContentLoaded", async () => {
  //suruma check garne ani matra aru content load garne
    if (sessionStorage.getItem("authenticated") !== "true") {
      alert("Access denied. Please log in first.");
      window.location.href = "admin_login.html"; 
  }
      
  address_get=  await get()
  address_post = await post()
  await fetch_data()
});



//yini haru chai global window variables hun
window.join = join;
window.redirect_ = redirect_;
window.delete_space = delete_space;
window.delete_file = delete_file;

//document load huda sabai vanda suruma load hune func

async function fetch_data() {
  try {
    var data = await fetch(`${address_get}/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    var response = await data.json();
    console.log(response);

    response.forEach((item) => {
      document.querySelector(
        "#list"
      ).innerHTML += `<br><li><a onclick="join(this)">${item}</a><button onclick="delete_space('${item}')">X</button></li>`;
    });
  } catch (error) {
    document.querySelector("#list").innerHTML =
      "ASK SAMIP TO TURN ON SERVER <br> THE SERVER IS CURRENTLY SWITCHED OFF";
  }
}

async function join(b) {
  space_name = b.innerText;
  var data = await fetch(`${address_get}/space/${space_name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  var response = await data.json();
  document.querySelector("#details").innerHTML = "";
  document.querySelector("#status").innerText = "";
  if (data.ok) {
    document.querySelector("#status").innerHTML = `CONNECTED TO ${space_name}`;
    console.log(data.ok);
    response.forEach((item) => {
      document.querySelector(
        "#details"
      ).innerHTML += `<br><li><a onclick="redirect_(this)">${item}</a><button onclick="delete_file('${space_name}','${item}')">X</button></li>`;
    });
  } else {
    document.querySelector(
      "#details"
    ).innerHTML = `ERROR : THE SPACE DOESNOT EXIST`;
  }
}
async function redirect_(a) {
    targeted_file_name = a.innerText;
  var data = await fetch(
    `${address_get}/space/${space_name}/${targeted_file_name}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  var response_data = await data.text();
//   console.log(response_data);
console.log(`TEST: ${space_name} ${targeted_file_name}`)

  var newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(`<pre>${response_data}</pre>`);
    newWindow.document.close();
  } else {
    console.error("POP UP ERROR");
  }
}
//file delete garne request

function delete_file(space_name,targeted_file_name){
  password_prompt("Enter admin pass", "Submit", async function(pass) {
    var data = await fetch(`${address_post}/remove_file/${pass}/${space_name}/${targeted_file_name}`,{
      method: "POST"
  })
  var response = await data.text();
  console.log(response)    
  if(data.status==200){
    alert("success")
  }else{
    alert("invalid")
  }
  });
}

// space delete garne request
async function delete_space(space_name){
  password_prompt("Enter admin pass", "Submit", async function(pass) {

    var data = await fetch(`${address_post}/remove_space/${pass}/${space_name}`,{
        method: "POST"
    })
    var response = await data.text();
    console.log(response)
    if(data.status==200){
      alert("success")
    }else{
      alert("invalid")
    }
})
}
