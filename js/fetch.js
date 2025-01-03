
async function readFile(){
    const file_data = await fetch('./token.txt');
    var token_data = await file_data.text()
    return token_data
  } 
async function fetch_data(){
var address= ''
var filename = document.querySelector('#filename').value
var password = document.querySelector('#password').value
var token  = await readFile()
var result = document.querySelector("#result")
    if(filename !== null && password !== null){
    var data = await fetch(`${address}/get/${filename}?password=${password}`,{
            method:"GET",
            headers:{
                    "Content-Type":"text/plain",
                    "Authorization": `Bearer ${token}`
            }
    })
    var response = await data.text()
    console.log(response)
    if (response.includes('data:image/png;base64') || response.includes('data:image/jpeg;base64')) {
            result.innerHTML = `The response from server has <code><strong>data:image</strong></code><br>which is indicating that its an image data <br><img src = '${response.split('CONTENT:')[1].trim()}'>`;
        } else {
            result.innerHTML = `>>>${response}`
        }
    }

}