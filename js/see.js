// REWRITTEN 26,27 JAN
// corrected and tried to optimize the fetching ...
import { get } from "../server/credentials/export.js";
var address;

document.addEventListener("DOMContentLoaded", async () => {
    address = await get();
    await fetch_data('space');

});

window.fetch_data = fetch_data;
window.back = back;
window.preview_file = preview_file
var current_path

async function fetch_data(path) {
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
                document.querySelector('#list').innerHTML += `<li onclick="fetch_data('${newPath}')">📁${item}</li>`;
            } else {
                document.querySelector('#list').innerHTML += `<li onclick="preview_file('${newPath}')">📄${item}</li>`;
            }
        });

        await Promise.all(allPromises);
    } else {
        console.log("something happened bro...");
    }
}

async function preview_file(path) {
    var response = await fetch(`${address}/${path}`);
    var data = await response.json(); 
    console.log(data)
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
    console.log(current_path.split('/').slice(0, -1))
    await fetch_data(current_path)
}


