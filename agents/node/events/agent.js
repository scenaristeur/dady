// const EventEmitter = require('node:events');
import { EventEmitter } from 'node:events'
// https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#why-use-processnexttick

export class Agent extends EventEmitter {
  constructor(options) {
    super()
    this.name = options.name

    this.on('create', this.create)

    // use nextTick to emit the event once a handler is assigned
    process.nextTick(() => {
      this.emit('create')
    })
  }
  async create() {
    const self = this
    this.on('mount', this.mount)
    this.on('run', this.run)
    this.on('unmount', this.unmount)
    this.log('start creation!')

    await setTimeout(function () {
      self.log('CREATION done')
      process.nextTick(() => {
        self.emit('mount')
      })
    }, 2000)
  }

  async mount() {
    this.log('mount!')

    process.nextTick(() => {
      this.emit('run')
    })
  }

  async run() {
    const self = this
    this.log('run!')
    this.log('HELLO')
    await setTimeout(function () {
      self.log('THIS IS')
      process.nextTick(() => {
        self.emit('unmount')
      })
    }, 2000)
    this.log('DOG')
  }

  async unmount() {
    this.log('unmount!')

    // process.nextTick(() => {
    //     this.emit('mount')
    //   })
  }

  log(message) {
    console.log('[' + this.name + ']', message)
  }
}

// const myEmitter = new MyEmitter();
// myEmitter.on('event', () => {
//   this.log('an event occurred!');
// });
