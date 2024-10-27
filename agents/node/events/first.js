import { EventEmitter } from 'node:events'

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()
myEmitter.on('event', () => {
  console.log('an event occurred!')
})
myEmitter.emit('event')

myEmitter.on('event', function (a, b) {
  console.log(a, b, this, this === myEmitter)
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
})
myEmitter.emit('event', 'a', 'b')

myEmitter.on('event', (a, b) => {
  console.log(a, b, this)
  // Prints: a b undefined
})
myEmitter.emit('event', 'a', 'b')

let m = 0
myEmitter.on('event', () => {
  console.log(++m)
})
myEmitter.emit('event')
// Prints: 1
myEmitter.emit('event')
// Prints: 2

myEmitter.once('event', () => {
  console.log(++m)
})
myEmitter.emit('event')
// Prints: 1
myEmitter.emit('event')
// Ignored

myEmitter.on('error', (err) => {
  console.error('whoops! there was an error')
})
myEmitter.emit('error', new Error('whoops!'))
