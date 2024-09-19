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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelsFolderDirectory = path.join(__dirname, '..', 'models')
// const chat_functions: { [function_name: string]: ChatSessionModelFunction<any> } = {};
const chat_functions = {}
// const evalJavaScript = defineChatSessionFunction({
//   description: 'Evaluate a JavaScript code.',
//   params: {
//     type: 'object',
//     properties: {
//       code: {
//         type: 'string',
//         description: 'JavaScript code to evaluate.'
//       }
//     }
//   },
//   handler(params) {
//     console.log('[evalJavaScript called]')
//     console.log(params)

//     try {
//       const hrStart = process.hrtime()
//       const lastResult = eval(params.code)
//       const hrDiff = process.hrtime(hrStart)
//       return {
//         error: false,
//         execution_time: `${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms`,
//         result: lastResult
//       }
//     } catch (err) {
//       return { error: true, reason: err }
//     }
//   }
// })

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
      throw new Error(`Error fetching ${url}: ${response.statusText}`)
    }
    // // Dynamic import
    // import('axios')
    //   .then(async ({ axios }) => {
    //     const response = await axios.get(params.url, {
    //       // params: {
    //       //   ID: 12345
    //       // }
    //     })
    //     console.log(response)
    //     return { status: 'ok cool', response: response.data }
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //     return 'import error'
    //   })
    // } catch (err) {
    //   // console.error(error)
    //   return { status: 'ko', code: err.status, error: err.message, err: err }
    // }

    // try {
    //   const response = await axios.get(params.url, {
    //     // params: {
    //     //   ID: 12345
    //     // }
    //   })
    //   console.log(response)
    //   return { status: 'ok cool', response: response }
    // } catch (error) {
    //   // console.error(error)
    //   return { status: 'ko', error: error }
    // }
  }
})

// chat_functions['evalJavaScript'] = evalJavaScript
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

const q1 = `Can you try to retrieve a list of the containers at http://localhost:3000/ and find who is BioThek fiancée?`
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

process.exit(0)
