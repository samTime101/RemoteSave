
/** @type {HTMLCanvasElement} */

var camera_button = document.querySelector("#start-camera");
var video = document.querySelector("#video");
var canvas = document.querySelector("#canvas");
camera_button.addEventListener('click', async function() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = stream;
  document.querySelector('input').style.display = 'none';
  click()
});
async function sdata(image_data_url) {
  const token = '';
  var data = image_data_url;
  const send = await fetch('', {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Authorization": `Bearer ${token}`
    },
    body: data
  });
  const response = await send.text();
  console.log(response);
  document.querySelector('p').innerText = 'POSTED IMAGE DATA TO SERVER';
}
function readImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function(event) {
      const image_data_url = event.target.result;
      console.log(image_data_url);
      const img = new Image();
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        sdata(image_data_url);
      };
      img.src = image_data_url;
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    console.log('No file selected');
  }
}



function click() {
  addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      canvas.width = video.width
      canvas.height = video.height
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      var image_data_url = canvas.toDataURL('image/png');
      sdata(image_data_url)

    }
  })
}


