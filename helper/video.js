'use strict'
const EventEmitter = require('events').EventEmitter
const async = require('async')
const dataURIBuffer = require('data-uri-to-buffer')
const uuid = require('uuid')
const os = require('os')
const fs = require('fs')
const path = require('path')
const listFiles = require('./list')
const ffmpeg = require('./ffmpeg')
const concat = require('concat-stream')

module.exports = function(images){

  let events = new EventEmitter()
  //Contador
  let count = 0
  //Generamos un nombre unico
  let baseName = uuid.v4()
  //Directorio donde guardamos las imagenes en el directorio temp del SO
  let tmpDir = os.tmpDir()
  //Donde almacenamos el video final
  let video

  //Ejecutamos las funciones en serie
  async.series([
    decodeImages,
    createVideo,
    encodeVideo,
    cleanup
  ],convertFinished)


  //Decodificamos las imagenes de base64 a buffer
  function decodeImages(done){
          console.log('Decodificando')
    //Decodificamos cada imagen
    async.eachSeries(images, decodeImage, done)
  }
  //Convertimos la imagen a buffer
  function decodeImage(image, done){
        console.log('Convirtiendo ${fileName}')
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
  }

  //Creamos el video a partir de las imagenes
  function createVideo(done){
      console.log('Creando el video')
      ffmpeg({
          baseName: baseName,
          folder: tmpDir
      }, done)
  }

  //Codificamos el video
  function encodeVideo(done){

    let fileName = `${baseName}.webm`
    let rs = fs.createReadStream(path.join(tmpDir, fileName))


    console.log(`Codificando el video ${fileName}`)
    //Convertimos a base64 el video
    rs.pipe(concat(function (videoBuffer) {
      video = `data:video/webm;base64,${videoBuffer.toString('base64')}`
      done()
    }))

    rs.on('error', done)

  }

  //Borramos los archivos temporales de las imagenes
  function cleanup(done){
    console.log('Limpiando')
    listFiles(tmpDir, baseName, function(err, files){
      if(err)
        return done(err)

      //Borramos los archivos
      deleteFiles(files, done)
    })
  }

  function deleteFiles(files, done){
    async.each(files, deleteFile, done)
  }

  function deleteFile(file, done){
      console.log(`Borrando ${file}`)
      fs.unlink(path.join(tmpDir, file), function(err){

        done()
      })
  }

  //Cuando se termina la conversion
  function convertFinished(err){
    if(err)
      return events.emit('error', err)

    events.emit('video', video)
  }

  return events
}
