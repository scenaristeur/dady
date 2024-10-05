export class MemoryManager {
  constructor({ session }) {
    this.session = session
    // this.callbacks = callbacks
    // console.log("store", store)
    //handleAction("one")
    //   this.id = uuidv4()
    //   this.listening = []
    //   this.awareness = null
    //   this.connect()
  }

  run() {
    console.log(this.session.context.contextSize, this.session.sequence, this.session._chatHistory)
    console.log(this.session.sequence.nextTokenIndex)
    let chatHistory = this.session.chatWrapper.generateInitialChatHistory()
    this.session._chatHistory = chatHistory
  }
  debug() {
    console.log(this.session)
  }
}
