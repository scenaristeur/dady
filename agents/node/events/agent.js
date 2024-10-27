// const EventEmitter = require('node:events');
import { EventEmitter } from 'node:events'
// https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#why-use-processnexttick

export class Agent extends EventEmitter {
  constructor() {
    super()

    this.on('create', this.create)
    this.on('mount', this.mount)
    this.on('run', this.run)
    this.on('unmount', this.unmount)

    // use nextTick to emit the event once a handler is assigned
    process.nextTick(() => {
      this.emit('create')
    })
  }
  create() {
    console.log('create!')

    process.nextTick(() => {
      this.emit('mount')
    })
  }

  mount() {
    console.log('mount!')

    process.nextTick(() => {
      this.emit('run')
    })
  }

  run() {
    const self = this
    console.log('run!')
    console.log('HELLO')
    setTimeout(function () {
      console.log('THIS IS')
      process.nextTick(() => {
        self.emit('unmount')
      })
    }, 2000)
    console.log('DOG')
  }

  unmount() {
    console.log('unmount!')

    // process.nextTick(() => {
    //     this.emit('mount')
    //   })
  }
}

// const myEmitter = new MyEmitter();
// myEmitter.on('event', () => {
//   console.log('an event occurred!');
// });
