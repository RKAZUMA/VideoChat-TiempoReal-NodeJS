'use strict'
const EventEmitter = require('events').EventEmitter

module.exports = function(images){
  let events = new EventEmitter()

  setTimeout(function (){
    events.emit('video', 'Esto será el video codificado')
  })

  return events
}
