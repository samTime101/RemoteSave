# Remote Save
Remote save , a simple application on web that simply exists currently on development

## Preview
Vanilla JS : [https://remote-save.vercel.app/](https://remote-save.vercel.app/)

React : [https://remote-save-git-react-samtime101s-projects.vercel.app](https://remote-save-git-react-samtime101s-projects.vercel.app)
```
Project Name: SHARE VER
Author: Samip Regmi
Initial Commit: Jan 1 2025
```
```
 ┣ 📂database
 ┃ ┣ 📂`<space1>`
 ┃ ┃ ┣ 📜`<space1 file>`
 ┣ 📂passwords
 ┃ ┣ 📂`<space1>`
 ┃ ┃ ┣ 📜`<space1 password>`
```
## Jan 16 Updates
- Client side hosted
- Server side `app.py` also hosted
- used path of folders using `os` rather than hardcoding
- works on mobile too
- No CORS errors
- Used `react` in front end branch `react` and vanilla on `main`

## To run and preview
> requires cloudfare to not have any CORS errors and to host , to try locally u can use your own ip address
Linux: [https://pkg.cloudflare.com/index.html](https://pkg.cloudflare.com/index.html)
```sh
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

sudo apt-get update && sudo apt-get install cloudflared
```
Running now
```sh
python3 get.py
python3 post.py
cloudflared tunnel --url http://localhost:8080
cloudflared tunnel --url http://localhost:5000
```
The ports and ip address shall be same on cloudfared tunnel as we have hardcoded on our server
```py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

```
```py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```
Pop Up Window function: [Edited By Me , Originally : luc@ltdinteractive.com](https://stackoverflow.com/questions/9554987/how-can-i-hide-the-password-entered-via-a-javascript-dialog-prompt#:~:text=There%20is%20currently%20no%20way,it%20hide%20the%20text%20input.)
```js
/*
JavaScript Password Prompt by Luc (luc@ltdinteractive.com)
Edited by samip regmi
Originaly posted to http://stackoverflow.com/questions/9554987/how-can-i-hide-the-password-entered-via-a-javascript-dialog-prompt
This code is Public Domain :)

Syntax:
password_prompt(label_message, button_message, callback);
password_prompt(label_message, button_message, width, height, callback);

Example usage:
password_prompt("Please enter your password:", "Submit", function(password) {
    alert("Your password is: " + password);
});
*/
//ADDITION , 
function password_prompt(label_message, button_message, arg3, arg4, arg5) {
    if (typeof label_message !== "string") label_message = "Password:";
    if (typeof button_message !== "string") button_message = "Submit";
    let width, height, callback;

    if (typeof arg3 === "function") {
        callback = arg3;
    } else if (typeof arg3 === "number" && typeof arg4 === "number" && typeof arg5 === "function") {
        width = arg3;
        height = arg4;
        callback = arg5;
    }
    if (typeof width !== "number") width = 300;
    if (typeof height !== "number") height = 150;
    if (typeof callback !== "function") callback = function () {};

    const submit = function () {
        callback(input.value);
        document.body.removeChild(div);
        window.removeEventListener("resize", resize, false);
    };

    const resize = function () {
        div.style.left = (window.innerWidth / 2 - width / 2) + "px";
        div.style.top = (window.innerHeight / 2 - height / 2) + "px";
    };
    const div = document.createElement("div");
    div.id = "password_prompt";
    div.style.background = "white";
    div.style.color = "black";
    div.style.border = "1px solid black";
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.padding = "16px";
    div.style.position = "fixed";
    div.style.left = (window.innerWidth / 2 - width / 2) + "px";
    div.style.top = (window.innerHeight / 2 - height / 2) + "px";

    //yo chai maile haleko - ADDITION 
    div.addEventListener('dblclick',()=>{
        document.body.removeChild(div);
        window.removeEventListener("resize", resize, false);
    })

    const label = document.createElement("label");
    label.id = "password_prompt_label";
    label.innerHTML = label_message;
    label.for = "password_prompt_input";
    div.appendChild(label);

    div.appendChild(document.createElement("br"));

    const input = document.createElement("input");
    input.id = "password_prompt_input";
    input.type = "password";
    //ADDITION
    input.addEventListener("keypress", function (e) {
        if (e.key === 'Enter') submit();
    }, false);
    div.appendChild(input);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    document.body.appendChild(div);
    window.addEventListener("resize", resize, false);
}
// ADDITION
export { password_prompt };

```


