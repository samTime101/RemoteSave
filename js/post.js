async function readFile(){
    const file_data = await fetch('./token.txt');
    var token_data = await file_data.text()
    return token_data
  } 
function readImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (event) {
            var image_data_url = event.target.result;
            console.log(image_data_url);
            window.imageContent = image_data_url;
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        console.log('No file selected');
    }
}

async function post_data(content) {
    console.log(content);
    var address = '';
    var token = await readFile()
    var filename = document.querySelector('#filename').value;
    var password = document.querySelector('#password').value;
    var result = document.querySelector("#result");

    if (filename && password && content) {
        var data = await fetch(`${address}/post`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Authorization": `Bearer ${token}`
            },
            body: `${filename}->${password}->${content}`
        });
        var response = await data.text();
        console.log(response);
        result.innerHTML = response;
    } else {
        result.innerHTML = ">>Please provide all required fields!";
    }
}

document.querySelector('#selector').addEventListener('change', function () {
    var content_section = document.querySelector('#content-section');
    var image_input = document.querySelector('#image_content');
    if (this.value === '0') { 
        content_section.style.display = 'block';
        image_input.style.display = 'none';
    } else {  
        content_section.style.display = 'none';
        image_input.style.display = 'block';
    }
});
document.querySelector('#image_content').addEventListener('change', function () {
    readImage(this);
});

document.querySelector('#button').addEventListener('click', function (event) {
    event.preventDefault()
    var text_content = document.querySelector('#text_content').value;
    var contentToPost;

    if (document.querySelector('#selector').value === '0') { 
        contentToPost = text_content;
    } else {  
        contentToPost = window.imageContent;
    }
    if (contentToPost) {
        post_data(contentToPost);
    }
});
