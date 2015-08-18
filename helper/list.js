'use strict'
const fs = require('fs')

//Recuperamos los archivos segun un filtro
module.exports = function(folder, filter, callback){
  fs.readdir(folder, onReaddir)

  //Leemos los archivos del directorio
  function onReaddir(err, results){
    if(err)
      return callback(err)

    //Los filtramos
    let files = results.filter(filterFiles)

    callback(null, files)
  }

  function filterFiles(file){
    return file.startsWith(filter)
  }
}
