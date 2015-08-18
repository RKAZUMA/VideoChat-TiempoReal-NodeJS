'use strict'

const Webrtc2images = require('webrtc2images')
const xhr = require('xhr')
const record = document.querySelector('#record')

//Opciones para la captura de video a imagenes
const rtc = new Webrtc2images({
  width: 200,
  height: 200,
  frames: 10,
  type: 'image/jpeg',
  quality: 0.4,
  inverval: 200
})

//Inicializamos la camara
rtc.startVideo(function(err){
  if(err)
    console.log(err)
})

record.addEventListener('click', function(e){
  e.preventDefault()

  //Empezamos a grabar video
  rtc.recordVideo(function (err, frames) {
    if (err)
      console.log(err)
    else
      console.log(frames)
      xhr({
        url:'/process',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ images:frames })
      }, function (err, res, body){

          if(err)
            return logError(err)

          console.log(JSON.parse(body))
      })
  });


  //Grabamos el video con el modulo webrtc2images
  console.log('Grabando video')
})
