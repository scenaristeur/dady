// https://langchain-ai.github.io/langgraphjs/how-tos/cross-thread-persistence/?ref=blog.langchain.dev
// https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises
// lancement serveur python http://127.0.0.1:5677 :
//  depuis igora-reloaded : python3 -m llama_cpp.server --model ./models/Llama-3.2-1B-Instruct.Q4_K_M.gguf --port 5677 --host 0.0.0.0
// persistence sqlite saver https://github.com/langchain-ai/langgraphjs/tree/main/libs/checkpoint-sqlite

import inquirer from 'inquirer'
import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import fs from 'fs/promises'

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
  // MemorySaver,
  //   LangGraphRunnableConfig,
  messagesStateReducer
} from '@langchain/langgraph'

import { SqliteSaver } from '@langchain/langgraph-checkpoint-sqlite'
// const checkpointer = SqliteSaver.fromConnString(':memory:')
const checkpointer = SqliteSaver.fromConnString('./memory.db')

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

  maxTokens: 2048,
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
  checkpointer: checkpointer, //new MemorySaver(),
  store: inMemoryStore
})

// CHAT LOOP

let config = { configurable: { thread_id: 'conversation_1', userId: 'user_1' } }
let threads = {}
let users = {}
threads[config.configurable.thread_id] = Date.now()
users[config.configurable.userId] = Date.now()
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
  switch (key.name) {
    case 'escape':
      exit()
      break
    // case 'up':
    //   // inquirer.prompt({
    //   //   type: 'list',
    //   //   name: 'beverage',
    //   //   message: 'And your favorite beverage?',
    //   //   choices: ['Pepsi', 'Coke', '7up', 'Mountain Dew', 'Red Bull']
    //   // });
    // break
    // case 'down':

    // break
    // default:
    // console.log(key.name)
  }
})

console.log('"/t Ma conversation" pour changer de conversation"')
console.log("'/u Bob' pour changer d'utilisateur")
console.log("'/l' pour lister les utilisateurs et les conversations")
console.log("'remember' dans l'input pour que le LLM sauvegarde des infos de l'utilisateur")
console.log("'/f' pour voir la memoire")
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
      // console.log(answer)
      if (answer == 'exit') {
        console.log('save & exit')
        loop = false
        // process.exit(0)
      } else {
        const memories = await inMemoryStore.search(['memories', config.configurable?.userId])

        switch (answer.substring(0, 3)) {
          case '/t ':
            // console.log('t')
            config.configurable.thread_id = answer.substring(3)
            threads[config.configurable.thread_id] = Date.now()
            break
          case '/u ':
            // console.log('u')
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
          case '/s':
            await fs.writeFile(
              'mem/' + config.configurable?.userId + '.json',
              JSON.stringify(graph.checkpointer, null, 2),
              'utf8'
            )
            break
          case '/u':
            console.log('u')
            graph.checkpointer = JSON.parse(
              await fs.readFile('mem/' + config.configurable?.userId + '.json', 'utf8')
            )
            console.log(graph.checkpointer)

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
