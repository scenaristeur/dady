// const EventEmitter = require('node:events');
import { EventEmitter } from 'node:events'
// https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#why-use-processnexttick

export class Agent extends EventEmitter {
  constructor(options) {
    super()
    this.name = options.name

    this.on('create', this.create)
    this.on('mount', this.mount)
    this.on('run', this.run)
    this.on('unmount', this.unmount)

    // use nextTick to emit the event once a handler is assigned
    process.nextTick(() => {
      this.emit('create')
    })
  }
  async create() {
    const self = this

    this.log('start creation!')
    process.nextTick(() => {
      self.emit('mount')
    })
  }

  async mount() {
    const self = this
    this.log('mount!')

    process.nextTick(() => {
      self.emit('run')
    })
  }

  async run() {
    const self = this
    this.log('run!')
    process.nextTick(() => {
      self.emit('unmount')
    })
  }

  async unmount() {
    const self = this
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
