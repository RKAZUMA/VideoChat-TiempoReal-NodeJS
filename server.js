'use strict'
//El modulo http nos permite crear un servidor web
const http = require('http')
const fs = require('fs')


//Llamamos al router que gestiona nuestras rutas
const router = require('./router')

//Indicamos el puerto por el que escuchará el servidor
const port = process.env.PORT || 8080

//Creamos un servidor
const server = http.createServer();

//Cuando obtenemos una peticion, redirigimos al router
server.on('request', router)

//Cuando el servidor esta a la escucha, redirigimos al listening
server.on('listening', onListening)

//El server escucha en el puerto que definimos
server.listen(port);

//Cuando se recibe un evento 'listening', se ejecuta esta funcion
function onListening () {
  console.log(`Servidor escuchando en el puerto ${port}`)
}
