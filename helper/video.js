'use strict'
const EventEmitter = require('events').EventEmitter
const async = require('async')

module.exports = function(images){
  let events = new EventEmitter()

  //Ejecutamos las funciones en serie
  async.series([
    decodeImages,
    createVideo,
    encodeVideo,
    cleanup,
    convertFinished
  ])


  //Decodificamos las imagenes de base64 a buffer
  function decodeImages(done){
    done()
  }

  //Creamos el video a partir de las imagenes
  function createVideo(done){
    done()
  }

  //Codificamos el video
  function encodeVideo(done){
    done()
  }

  //Borramos los archivos temporales de las imagenes
  function cleanup(done){
    done()
  }

  //Cuando se termina la conversion
  function convertFinished(err){
    setTimeout(function(){
      events.emit('video', 'Este sera el video codificado')
    }, 100)
  }

  return events
}
