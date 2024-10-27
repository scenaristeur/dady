import { Agent } from './agent.js'

export class Agent2Seconds extends Agent {
  constructor(options) {
    super(options)
  }

  async create() {
    super.create()
    await setTimeout(() => {
      this.emit('run')
    }, 2000)
  }
}
