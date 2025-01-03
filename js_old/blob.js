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
  document.querySelector('p').innerText = 'SENDING ................';
  document.querySelector('p').style.color = 'red';

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
  document.querySelector('p').style.color = 'darkgreen';
  document.querySelector('p').innerText = 'POSTED IMAGE DATA TO SERVER';
}
function readImage(input) {
  const context = canvas.getContext("2d");
  let imgSrc = '';
  if (input.value !== '') {
    imgSrc = window.URL.createObjectURL(input.files[0]);
  }
  const img = new Image();
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  img.src = imgSrc;
  sdata(imgSrc)
}
canvas.width = video.width
canvas.height = video.height
function click() {
  addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      var image_data_url = canvas.toDataURL('image/png');
      canvas.toBlob(async (blob) => {
        var imgblob = URL.createObjectURL(blob);
        console.log(imgblob)
        await sdata(imgblob)
      }, 'image/png')
    }
  })
}
