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
  await fetch_data('space')
});



//yini haru chai global window variables hun

window.delete_space = delete_space;
window.delete_file = delete_file;
window.edit_file = edit_file;
//document load huda sabai vanda suruma load hune func

window.fetch_data = fetch_data;
window.back = back;
window.preview_file = preview_file
var current_path
/*
async function fetch_data(path) {
    if (path == 'space') {
        document.querySelector('#back').style.display = 'none';
    } else {
        document.querySelector('#back').style.display = 'block';
    }

    var response = await fetch(`${address_get}/${path}`);
    var data = await response.json();
    current_path = path;

    document.querySelector('#list').innerHTML = "";
    document.querySelector('#status').innerHTML = `CURRENT PATH : ${path.toUpperCase()}`;
    
    if ("folder" in data) {
        for (let item of data["folder"]) {
            let newPath = `${path}/${item}`;
            let itemResponse = await fetch(`${address_get}/${newPath}`);
            let itemData = await itemResponse.json();

            if ("folder" in itemData) {
document.querySelector('#list').innerHTML += `
    <div class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
        <a class="text-decoration-none flex-grow-1" onclick="fetch_data('${newPath}')">
            📁 ${item}
        </a>
        <div>
            <button onclick="delete_space('${newPath.split('/').slice(1).join('/')}')" class="btn btn-danger btn-sm">X</button>
        </div>
    </div>
`;;
            } else {
              document.querySelector('#list').innerHTML += `
    <div class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
        <a class="text-decoration-none flex-grow-1" onclick="preview_file('${newPath}')">
            📄 ${item}
        </a>
        <div>
            <button onclick="edit_file('${path.split('/').slice(1).join('/')}','${item}')" class="btn btn-primary btn-sm me-2" data-toggle="modal" data-target="#warningModal">✏️</button>
            <button onclick="delete_file('${path.split('/').slice(1).join('/')}','${item}')" class="btn btn-danger btn-sm">X</button>
        </div>
    </div>
`;
            }
        }
    } else {
        console.log("Unknown response format.");
    }
}
*/
async function fetch_data(path) {
    if (path == 'space') {
        document.querySelector('#back').style.display = 'none';
    } else {
        document.querySelector('#back').style.display = 'block';
    }

    var response = await fetch(`${address_get}/${path}`);
    var data = await response.json();
    current_path = path;

    document.querySelector('#list').innerHTML = "";
    document.querySelector('#status').innerHTML = `CURRENT PATH : ${path.toUpperCase()}`;

    if ("folder" in data) {
        const allPromises = data["folder"].map(async (item) => {
            let newPath = `${path}/${item}`;
            let item_response = await fetch(`${address_get}/${newPath}`);
            let item_data = await item_response.json();

            if ("folder" in item_data) {
                document.querySelector('#list').innerHTML += `<a class="list-group-item list-group-item-action" onclick="fetch_data('${newPath}')">📁${item}</a>`;
            } else {
                document.querySelector('#list').innerHTML += `<a class="list-group-item list-group-item-action" onclick="preview_file('${newPath}')">📄${item}</a>`;
            }
        });

        await Promise.all(allPromises);
    } else {
        console.log("something happened bro...");
    }
}
async function preview_file(path) {
    var response = await fetch(`${address_get}/${path}`);
    var data = await response.json(); 
    // console.log(data)
var newWindow = window.open('', '_blank');
if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(`<pre>${data['file']}</pre>`);
    newWindow.document.close();
} else {
    console.error("POP UP ERROR");
}
}

async function back(){
    current_path = current_path.split('/').slice(0, -1).join('/');
    // console.log(current_path.split('/').slice(0, -1))
    await fetch_data(current_path)
}
async function delete_file(space_name,targeted_file_name){
  // console.log(`${space_name} and ${targeted_file_name}`)
  password_prompt("Enter admin pass", "Submit", async function(pass) {
    var data = await fetch(`${address_post}/remove_file/${space_name}/${targeted_file_name}`,{
      method: "POST",
              headers: {
                "Content-Type": "text/plain",
            },
            body: `${pass}`,
  })
  var response = await data.text();
  // console.log(response)    
  if(data.status==200){
    alert("success")
    location.reload()

  }else{
    alert("invalid")
  }
  });
}

// space delete garne request
async function delete_space(space_name){
  password_prompt("Enter admin pass", "Submit", async function(pass) {

    var data = await fetch(`${address_post}/remove_space/${space_name}`,{
        method: "POST",
        headers: {
                "Content-Type": "text/plain",
            },
            body: `${pass}`,
    })
    var response = await data.text();
    // console.log(response)
    if(data.status==200){
      alert("success")
      location.reload()
    }else{
      alert("invalid")
    }
})
}

//edit content
async function edit_file(space_name, targeted_file_name) {
  var spacename = space_name;
  var filename = targeted_file_name;
  var password = document.querySelector("#pass-name")
  var new_content = document.querySelector("#message-text") 

  if(!password || !new_content){
    return
  }
  var data_get = await fetch(
    `${address_get}/space/${space_name}/${targeted_file_name}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  var response_data = await data_get.json();
  new_content.value = response_data['file']
  // yo pathaune ho
  const warningModal = new bootstrap.Modal(document.getElementById('warningModal'));
  warningModal.show();

  document.querySelector("#newSend").addEventListener("click",async () => {
       var content_to_be_sent = {
        password: password.value.trim(),  
        new_content: new_content.value.trim() 
    };
        console.log(content_to_be_sent)
    const message = document.querySelector("#message-text").value;
    // console.log(`${address_post}/edit/${spacename}/${password.value}/${filename}`);

     var data_new = await fetch(`${address_post}/edit/${spacename}/${filename}`, {
         method: "POST",
         headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify(content_to_be_sent)
     });
     var response_new = await data_new.text(); 
     alert(data_new.status)
    warningModal.hide(); 

  });

}
