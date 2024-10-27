import { Agent } from './agent.js'

export class Agent2Seconds extends Agent {
  constructor(options) {
    super(options)
  }

  async create() {
    super.create()
    const self = this
    await setTimeout(function () {
      self.log('CREATION done')
      process.nextTick(() => {
        self.emit('mount')
      })
    }, 2000)
  }

  async run() {
    super.run()
    const self = this
    this.log('custom run!')
    await setTimeout(function () {
      self.log('THIS IS')
      process.nextTick(() => {
        self.emit('unmount')
      })
    }, 2000)
    this.log('DOG')
  }
}
