// https://github.com/withcatai/node-llama-cpp/issues/299

import { fileURLToPath } from 'url'
import path from 'path'
import chalk from 'chalk'
import {
  getLlama,
  LlamaChatSession,
  defineChatSessionFunction,
  Llama3_1ChatWrapper
} from 'node-llama-cpp'
import { url } from 'inspector'
import inquirer from 'inquirer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const modelsFolderDirectory = path.join(__dirname, '..', 'models')
// const chat_functions: { [function_name: string]: ChatSessionModelFunction<any> } = {};
const chat_functions = {}

const httpRequest = defineChatSessionFunction({
  description:
    'Perform an http request (GET, POST, PUT, DELETE,...) and return the response. It is an asynchronous function.',
  params: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'url to perform the request, e.g. http://localhost:3000/personnages/BioThek'
      }
    }
  },
  async handler(params = { url: 'http://localhost:3000/personnages/' }) {
    // import axios from 'axios'
    // try {
    const response = await fetch(params.url)
    if (response.ok) {
      return response.text()
    } else {
      return `Error fetching ${url}: ${response.statusText}, check the root directory http://localhost:3000/ to find the good container`
    }
  }
})

chat_functions['httpRequest'] = httpRequest

const llama = await getLlama()
// { gpu: false }

console.log(chalk.yellow('Loading model...'))
const model = await llama.loadModel({
  // modelPath: path.join(modelsFolderDirectory, "functionary-small-v3.2.F16.gguf")
  // modelPath: path.join(__dirname, '../../../../igora/models', 'llama-pro-8b-instruct.Q2_K.gguf')
  // modelPath: path.join(
  //   __dirname,
  //   '../../../../igora/models',
  //   'Meta-Llama-3.1-8B-Instruct.Q2_K.gguf'
  // )
  modelPath: path.join(
    __dirname,
    '../../../../igora/models',
    'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf'
  )
})

console.log(chalk.yellow('Creating context...'))
const context = await model.createContext()

const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  chatWrapper: new Llama3_1ChatWrapper() //https://github.com/withcatai/node-llama-cpp/issues/299
})
console.log()

async function infinite_run() {
  let input_message = `Bonjour, que puis-je faire pour toi, aujourd'hui ?`

  const q1 = `Explore http://localhost:3000/ et trouve la fiancée de BioThek, où travaille-t-elle et qui sont ses collègues ?`
  // const q1 = `
  // Can you try evaluating this javascript code?

  // Math.round(Math.random() * 100)`.trim();
  console.log(chalk.yellow('User: ') + q1)

  process.stdout.write(chalk.yellow('AI: '))
  const a1 = await session.prompt(q1, {
    functions: chat_functions,
    onTextChunk(chunk) {
      // stream the response to the console as it's being generated
      process.stdout.write(chunk)
    }
  })
  process.stdout.write('\n')
  console.log(chalk.yellow('Consolidated AI answer: ') + a1)
  console.log()

  const discuss = async () => {
    let controller = new AbortController()
    const { signal } = controller
    process.on('SIGINT', function () {
      console.log('Caught interrupt signal')

      controller.abort()
      // controller = null
      // if (i_should_exit)
      //     process.exit();
    })
    inquirer.prompt([{ name: 'user_input', message: input_message }]).then(async (response) => {
      // console.log('user_input', response, response.user_input)

      if (response.user_input == 'exit') {
        console.log("tape 'exit' pour sortir")
        process.exit(0)
      } else {
        console.log(chalk.yellow('User: ') + response.user_input)

        process.stdout.write(chalk.yellow('AI: '))

        const a1 = await session.prompt(response.user_input, {
          functions: chat_functions,
          onTextChunk(chunk) {
            // stream the response to the console as it's being generated
            process.stdout.write(chunk)
          },
          signal: signal,
          onAbort: async () => {
            /// pas utilisé
            console.log('#######################Abort')
            await discuss()
          },
          stopOnAbortSignal: true
        })
        // console.log('END2', chunk, 'END2')
        // process.stdout.write(chunk)
        process.stdout.write('\n')
        console.log(chalk.yellow('Consolidated AI answer: ') + a1)
        console.log()
        input_message = 'User: '
        console.log("tape 'exit' pour sortir")
        await discuss()
      }
    })
  }

  await discuss()
}

infinite_run()
