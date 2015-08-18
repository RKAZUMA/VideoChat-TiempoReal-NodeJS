'use strict'

const os = require('os')
const path = require('path')
const spawn = require('child_process').spawn

module.exports = function (options, callback) {
  if (!options.baseName) return callback(new TypeError('Debes de especificar un nombre base'))

  let folder = options.folder || os.tmpDir()
  let baseName = options.baseName
  let fileSrc = path.join(folder, `${baseName}-%d.jpg`)
  let fileDest = path.join(folder, `${baseName}.webm`)

  // ffmpeg -i images-%d.jpg -filter:v "setpts=2.5*PTS" -vcodec libvpx -an video.webm
  let ffmpeg = spawn('ffmpeg', [
    '-i',
    fileSrc,
    '-filter:v',
    'setpts=2.5*PTS',
    '-vcodec',
    'libvpx',
    '-an',
    fileDest
  ])

  //Cuando termina de convertir, llama a close
  ffmpeg.stdout.on('close', function (code) {
      //Si un comando termina con 0, se ejecutó bien
      if (!code)
        return callback(null)
    //Si el resultado es mayor a 0 (cualquier numero), hubo un error
    callback(new Error(`ffmpeg salió con codig de error ${code}`))
  })
}
