'use strict'
const EventEmitter = require('events').EventEmitter
const async = require('async')
const dataURIBuffer = require('data-uri-to-buffer')
const uuid = require('uuid')
const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = function(images){

  let events = new EventEmitter()
  //Contador
  let count = 0
  //Generamos un nombre unico
  let baseName = uuid.v4()
  //Directorio donde guardamos las imagenes en el directorio temp del SO
  let tmpDir = os.tmpDir()

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
    //Decodificamos cada imagen
    async.eachSeries(images, decodeImage, done)
  }
  //Convertimos la imagen a buffer
  function decodeImage(image, done){
    //Creamos el nombre del archivo
    let fileName = `${baseName}-${count++}.jpg`
    //Creamos el buffer a partir de la imagen
    let buffer = dataURIBuffer(image)
    //Creamos el fichero donde guardamos
    let ws = fs.createWriteStream(path.join(tmpDir, fileName))

    //Si hay un error llamamos al callback con error
    ws.on('error', done)
      //Si no hay error, continua
      .end(buffer, done)

      events.emit(`log`, `Convertiendo ${fileName}`)

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
