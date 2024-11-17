// https://langchain-ai.github.io/langgraphjs/how-tos/cross-thread-persistence/?ref=blog.langchain.dev

import { InMemoryStore } from '@langchain/langgraph'

const inMemoryStore = new InMemoryStore()

import { v4 as uuidv4 } from 'uuid'
import { ChatOpenAI } from '@langchain/openai'
// import { ChatAnthropic } from "@langchain/anthropic";
// import { BaseMessage } from "@langchain/core/messages";
import {
  Annotation,
  StateGraph,
  START,
  MemorySaver,
  //   LangGraphRunnableConfig,
  messagesStateReducer
} from '@langchain/langgraph'

const StateAnnotation = Annotation.Root({
  messages: Annotation({
    reducer: messagesStateReducer,
    default: () => []
  })
})

// const model = new ChatAnthropic({ modelName: "claude-3-5-sonnet-20240620" });
const model = new ChatOpenAI({
  model: 'Llama 3.2 1B Instruct',
  temperature: 0,
  openAIApiKey: 'EMPTY',
  configuration: {
    // basePath: 'http://127.0.0.1:5677/v1/'
    basePath: 'http://192.168.1.48:5677/v1/'
  }
})

// NOTE: we're passing the Store param to the node --
// this is the Store we compile the graph with
const callModel = async (state, config) => {
  const store = config.store
  if (!store) {
    if (!store) {
      throw new Error('store is required when compiling the graph')
    }
  }
  if (!config.configurable?.userId) {
    throw new Error('userId is required in the config')
  }
  const namespace = ['memories', config.configurable?.userId]
  const memories = await store.search(namespace)
  const info = memories.map((d) => d.value.data).join('\n')
  const systemMsg = `You are a helpful assistant talking to the user. User info: ${info}`

  // Store new memories if the user asks the model to remember
  const lastMessage = state.messages[state.messages.length - 1]
  if (
    typeof lastMessage.content === 'string' &&
    lastMessage.content.toLowerCase().includes('remember')
  ) {
    await store.put(namespace, uuidv4(), { data: lastMessage.content })
  }

  const response = await model.invoke([{ type: 'system', content: systemMsg }, ...state.messages])
  return { messages: response }
}

const builder = new StateGraph(StateAnnotation)
  .addNode('call_model', callModel)
  .addEdge(START, 'call_model')

// NOTE: we're passing the store object here when compiling the graph
const graph = builder.compile({
  checkpointer: new MemorySaver(),
  store: inMemoryStore
})

console.log('STORE')

let config = { configurable: { thread_id: '1', userId: '1' } }
let inputMessage = { type: 'user', content: 'Hi! Remember: my name is Bob' }

for await (const chunk of await graph.stream(
  { messages: [inputMessage] },
  { ...config, streamMode: 'values' }
)) {
  console.log(chunk.messages[chunk.messages.length - 1])
}

console.log('RETRIEVE')

config = { configurable: { thread_id: '2', userId: '1' } }
inputMessage = { type: 'user', content: 'what is my name?' }

for await (const chunk of await graph.stream(
  { messages: [inputMessage] },
  { ...config, streamMode: 'values' }
)) {
  console.log(chunk.messages[chunk.messages.length - 1])
}

console.log('FACTS')

const memories = await inMemoryStore.search(['memories', '1'])
for (const memory of memories) {
  console.log(await memory.value)
}

console.log('OTHER USER')

config = { configurable: { thread_id: '3', userId: '2' } }
inputMessage = { type: 'user', content: 'what is my name?' }

for await (const chunk of await graph.stream(
  { messages: [inputMessage] },
  { ...config, streamMode: 'values' }
)) {
  console.log(chunk.messages[chunk.messages.length - 1])
}
