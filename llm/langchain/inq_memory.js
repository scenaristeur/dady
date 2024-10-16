// https://langchain-ai.github.io/langgraphjs/how-tos/cross-thread-persistence/?ref=blog.langchain.dev
// https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises

// import inquirer from 'inquirer'
import { input } from '@inquirer/prompts'
import chalk from 'chalk'
// MODEL

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
    basePath: 'http://127.0.0.1:5677/v1/'
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

// CHAT LOOP

let threads = {}
let users = {}
let config = { configurable: { thread_id: '1', userId: '1' } }

// Clear the screen
process.stdout.write('\u001b[2J\u001b[0;0H')

// https://github.com/SBoudrias/Inquirer.js#canceling-prompt
const controller = new AbortController()

// Exit the inquirer prompt
function exit() {
  controller.abort()
}

// close inquirer input if user press "escape" key
process.stdin.on('keypress', (_, key) => {
  if (key.name === 'escape') {
    exit()
  }
})

console.log('"/t Ma conversation" pour changer de conversation"')
console.log("'/u Bob' pour changer d'utilisateur")
console.log("'/l' pour lister les utilisateurs et les conversations")
console.log("'/f' pour pour voir la memoire")
console.log('touche Echap ou Tape exit pour quitter')

const user_input = () => {
  console.log(config)
  return input({ message: 'User : ' }, { signal: controller.signal })
}

// infinite run https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises
const main = async () => {
  let loop = true
  let inputMessage = ''
  // let inputs = []
  while (loop) {
    // await showMenu()
    await user_input().then(async (answer) => {
      console.log(answer)
      if (answer == 'exit') {
        console.log('save & exit')
        loop = false
        // process.exit(0)
      } else {
        const memories = await inMemoryStore.search(['memories', config.configurable?.userId])

        switch (answer.substring(0, 3)) {
          case '/t ':
            console.log('t')
            config.configurable.thread_id = answer.substring(3)
            threads[config.configurable.thread_id] = Date.now()
            break
          case '/u ':
            console.log('u')
            config.configurable.userId = answer.substring(3)
            users[config.configurable.userId] = Date.now()
            break
          case '/l':
            console.log('l')
            console.log('Conversations', threads)
            console.log('Utilisateurs', users)
            break
          case '/f':
            console.log('f')
            for (const memory of memories) {
              console.log(await memory.value)
            }

            break
          default:
            inputMessage = { type: 'user', content: answer }
            // inputs = { messages: [{ role: 'user', content: answer }] }
            // process.stdout.write(chalk.yellow('AI: '))
            // for await (const { messages } of await graph.stream(inputs, {
            //   streamMode: 'values'
            // })) {
            //   let msg = messages[messages?.length - 1]
            //   if (msg?.content) {
            //     console.log(msg.content)
            //   } else if (msg?.tool_calls?.length > 0) {
            //     console.log(msg.tool_calls)
            //   } else {
            //     console.log(msg)
            //   }
            //   console.log('-----\n')
            // }
            for await (const update of await graph.stream(
              { messages: [inputMessage] },
              { ...config, streamMode: 'updates' }
            )) {
              console.log(update.call_model.messages.content)
              // process.stdout.write(chunk)
              // console.log(chunk.messages[chunk.messages.length - 1])
            }
        }
        console.log('continue')
      }
    })
  }
}

main()
