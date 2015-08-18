'use strict'

const st = require('st')
const path = require('path')

//Configuramos el modulo st para servir ficheros estaticos
const mount = st({
  path: path.join(__dirname,'..','public'),
  index: 'index.html',
  passthrough: true
})

function onRequest(req, res){
  mount(req, res, function(err){
    if (err)
      return res.end(err.message)

    res.statusCode = 404
    res.end(`No se encuentra la ruta ${req.url}`)

  })
}

module.exports = onRequest;
