// REWRITTEN 26,27 JAN
// corrected and tried to optimize the fetching ...

//updated on March 11
import { get } from "../server/credentials/export.js";
var address;

document.addEventListener("DOMContentLoaded", async () => {
    address = await get();
    const urlParams = new URLSearchParams(window.location.search);
    const path = urlParams.get('path') || 'space';
    var response = await fetch(`${address}/${path}`);
    var data = await response.json();
    // alert(path)
    // await fetch_data(path);

    //file huda direct preview garne 
    if ("file" in data) {
        await preview_file(path);
    } else {
        await fetch_data(path);
    }
});

window.fetch_data = fetch_data;
window.back = back;
window.preview_file = preview_file
var current_path
window.download_file = download_file

async function fetch_data(path) {

    // state , title , url
    window.history.pushState({}, null, `?path=${path}`);

    if (path == 'space') {
        document.querySelector('#back').style.display = 'none';
    } else {
        document.querySelector('#back').style.display = 'block';
    }

    var response = await fetch(`${address}/${path}`);
    var data = await response.json();
    current_path = path;

    document.querySelector('#list').innerHTML = "";
    document.querySelector('#status').innerHTML = `CURRENT PATH : ${path.toUpperCase()}`;

    if ("folder" in data) {
        const allPromises = data["folder"].map(async (item) => {
            let newPath = `${path}/${item}`;
            let item_response = await fetch(`${address}/${newPath}`);
            let item_data = await item_response.json();

            if ("folder" in item_data) {
                document.querySelector('#list').innerHTML += `
                    <div class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
        <a class="text-decoration-none flex-grow-1" onclick="fetch_data('${newPath}')">
            📁 ${item}
        </a>
    </div>
    `;            } else {
        document.querySelector('#list').innerHTML += `
        <div class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
            <a class="text-decoration-none flex-grow-1" onclick="preview_file('${newPath}')">
                📄 ${item}
            </a>
            <div>
                <button onclick="download_file('${newPath}')" class="btn btn-primary btn-sm">📥</button>
            </div>
        </div>
                    `            }
        });

        await Promise.all(allPromises);
    } else {
        console.log("something happened bro...");
    }
}

async function preview_file(path) {
    current_path = path;

    document.querySelector('#back').style.display = 'block';
    
    window.history.pushState({}, null, `?path=${path}`);
    var response = await fetch(`${address}/${path}`);
    var data = await response.json(); 
    console.log(data)
    document.querySelector('#list').innerHTML = "";
    document.querySelector('#status').innerHTML = `CURRENT PATH : ${path.toUpperCase()}`;
    document.querySelector('#list').innerHTML = `

 <div class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
<a class="text-decoration-none flex-grow-1">
    📄 ${path.split('/').slice(-1)[0]}
</a>
<div>
    <button onclick="download_file('${path}')" class="btn btn-primary btn-sm">📥</button>
</div>
</div>
<div class="d-flex justify-content-between align-items-center list-group-item list-group-item-action">
<pre>${data['file']}</pre>
</div>
    `;
// var newWindow = window.open('', '_blank');
// if (newWindow) {
//     newWindow.document.open();
//     newWindow.document.write(`<pre>${data['file']}</pre>`);
//     newWindow.document.close();
// } else {
//     console.error("POP UP ERROR");
// }
}

async function back(){
    current_path = current_path.split('/').slice(0, -1).join('/');
    console.log(current_path.split('/').slice(0, -1))
    await fetch_data(current_path)
}



//download garna
async function download_file(path){
    var response = await fetch(`${address}/${path}`);
    var data = await response.json();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data['file']));
    element.setAttribute('download', `${path.split('/').slice(-1)[0]}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}