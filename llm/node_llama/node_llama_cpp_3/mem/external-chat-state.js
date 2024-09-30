// https://node-llama-cpp.withcat.ai/guide/external-chat-state#external-chat-state

import { fileURLToPath } from 'url'
import path from 'path'
import { getLlama, LlamaChat } from 'node-llama-cpp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const llama = await getLlama()
const model = await llama.loadModel({
  //   modelPath: path.join(__dirname, 'models', 'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf')
  modelPath: path.join(__dirname, '../../../../../igora/models', 'Llama-3.2-1B-Instruct.Q8_0.gguf')
})
const context = await model.createContext()
const llamaChat = new LlamaChat({
  contextSequence: context.getSequence()
})

let chatHistory = llamaChat.chatWrapper.generateInitialChatHistory()

const prompt = 'Hi there, how are you?'

// add the user prompt to the chat history
chatHistory.push({
  type: 'user',
  text: prompt
})

// add a slot for the model response, for the model to complete.
// if we want the model response to start with a specific text,
// we can do so by adding it to the response array
chatHistory.push({
  type: 'model',
  response: []
})

console.log('User: ' + prompt)
const res = await llamaChat.generateResponse(chatHistory, {
  onTextChunk(text) {
    // stream the text to the console
    process.stdout.write(text)
  }
})

console.log('AI: ' + res.response)

console.log('chatHistory', chatHistory)
chatHistory = res.lastEvaluation.cleanHistory
let chatHistoryContextWindow = res.lastEvaluation.contextWindow
let lastContextShiftMetadata = res.lastEvaluation.contextShiftMetadata

console.log('chatHistoryContextWindow', chatHistoryContextWindow)
console.log('lastContextShiftMetadata', lastContextShiftMetadata)

const prompt2 = 'Résume ce que tu as dit en français'

// add the user prompt to the chat history
chatHistory.push({
  type: 'user',
  text: prompt2
})
// add the user prompt to the chat history context window
chatHistoryContextWindow.push({
  type: 'user',
  text: prompt2
})

// add a slot for the model response, for the model to complete
chatHistory.push({
  type: 'model',
  response: []
})
// add a slot for the model response in the context window
chatHistoryContextWindow.push({
  type: 'model',
  response: []
})

console.log('User: ' + prompt2)
const res2 = await llamaChat.generateResponse(chatHistory, {
  onTextChunk(text) {
    // stream the text to the console
    process.stdout.write(text)
  },
  contextShift: {
    // pass the context shift metadata from the previous evaluation
    lastEvaluationMetadata: lastContextShiftMetadata
  },
  lastEvaluationContextWindow: {
    history: chatHistoryContextWindow
  }
})

console.log('AI: ' + res2.response)
