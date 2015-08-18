'use strict'

const st = require('st')
const course = require('course')
const path = require('path')
const jsonBody = require('body/json')

const router = course();

//Configuramos el modulo st para servir ficheros estaticos
const mount = st({
  path: path.join(__dirname,'..','public'),
  index: 'index.html',
  passthrough: true
})

router.post('/process', function (req, res){
  jsonBody(req, res,{ limit: 3 * 1024  * 1024}, function (err, body){
    if (err)
      return fail(err, res)

    console.log(body)

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ok: true}))

  })
})

function onRequest(req, res){
  mount(req, res, function(err){
    if (err)
      return res.end(err.message)

    router(req, res, function(err){
      if(err)
        return fail(err, res)

      res.statusCode = 404
      res.end(`No se encuentra la ruta ${req.url}`)
    })


  })
}

function fail(req, res){
  res.statusCode = 500;
  res.end('Algo extraño ocurrio')
}
module.exports = onRequest;
