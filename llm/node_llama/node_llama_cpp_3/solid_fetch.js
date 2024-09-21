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

// const httpRequest = defineChatSessionFunction({
//   description:
//     'Perform an http request WITH NO BODY/DATA (GET, HEAD) and return the response. It is an asynchronous function.',
//   params: {
//     type: 'object',
//     properties: {
//       url: {
//         type: 'string',
//         description: 'url to perform the request, e.g. http://localhost:3000/'
//       },
//       method: {
//         type: 'string',
//         description: '(optional) method to send with the request (e.g. GET, HEAD), default is GET'
//       }
//     }
//   },
//   async handler(params = { url: 'http://localhost:3000/' }) {
//     // try {
//     const response = await fetch(params.url)
//     if (response.ok) {
//       return response.text()
//     } else {
//       return `Error fetching ${url}: ${response.statusText}, check the root directory http://localhost:3000/ to find the good container`
//     }
//   }
// })

const httpRequest = defineChatSessionFunction({
  description:
    'Perform an http request (GET, HEAD,  PUT, POST, DELETE, PATCH, OPTIONS...) and return the response. It is an asynchronous function.',
  params: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description:
          'url to perform the request, e.g. http://localhost:3000/ to POST, PUT in the root container'
      },
      method: {
        type: 'string',
        description:
          '(optional) method to send with the request (e.g. POST, PUT, DELETE, PATCH, OPTIONS)'
      },
      data: {
        type: 'string',
        description:
          '(optional) data to send with the request au format jsonld avec un @id identique au url de la ressource'
      }
    }
    // properties: {
    //   url: {
    //     type: 'string',
    //     description: `url to perform the request,
    //     e.g. http://localhost:3000/ to get the list of containers`
    //     // description: `url to perform the request,
    //     //  e.g. http://localhost:3000/ to get the list of containers,
    //     //  or http://localhost:3000/personnages/ to get a container and a list of resources,
    //     //  or http://localhost:3000/personnages/BioThek to get a resources.
    //     //  Containers end with '/'.
    //     //  Get the list of personnages at http://localhost:3000/personnages/,
    //     //  get the list of lieux at http://localhost:3000/lieux/ ,
    //     //  get the list of objets at http://localhost:3000/objets/,
    //     //  !!! get the list of containers at http://localhost:3000/ when you are lost !!!`
    //   },
    //   payload: {
    //     type: 'object',
    //     description: `(optional) payload in jsonld format to send with the request to create or patch a resource,
    //     with a '@id' key identical to the url of the resource.`
    //   },
    //   method: {
    //     type: 'string',
    //     description:
    //       '(optional) method to send with the request (e.g. GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS), default is GET'
    //   }
    // }
  },
  async handler(params = { url: 'http://localhost:3000/', method: 'GET', data: '{}' }) {
    // try {
    if (params.method == 'GET' || params.method == 'HEAD' || params.method == 'OPTIONS') {
      const response = await fetch(params.url)
      if (response.ok) {
        return response.text()
      } else {
        return `Error fetching ${url}: ${response.statusText}, check the root directory http://localhost:3000/ to find the good container`
      }
    } else {
      let options = {
        method: params.method,
        // headers: {
        //   // Accept: 'application/ld+json',
        //   'Content-Type': 'application/ld+json'
        // },
        body: params.data
      }

      const response = await fetch(params.url, options)
      if (response.ok) {
        return response.text()
      } else {
        return `Error fetching ${url}: ${response.statusText}, check the root directory http://localhost:3000/ to find the good container`
      }
    }
    // } catch (error) {
    //   console.error(error)
    //   return {
    //     status: 'ko',
    //     code: error.status,
    //     error: error.message,
    //     err: error,
    //     url: params.url,
    //     payload: params.payload,
    //     method: params.method
    //   }
    // }
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

// const systemPrompt = `Tu es une grenouille et commence toutes tes phrases par 'Croa Croa'.
// Tu as accès à un serveur à l'adresse http://localhost:3000/ qui comprend les requetes GET,PUT, POST, DELETE, PATCH, HEAD, OPTIONS,
// et qui te donneras les containers où sont stockées les informations.
// commence par explorer ce serveur et affiche la liste des containers.
// des exemples de requetes sont accessible à cette adresse https://raw.githubusercontent.com/CommunitySolidServer/CommunitySolidServer/refs/heads/main/documentation/markdown/usage/example-requests.md.
// on va aussi s'intéresser à l'Holacratie https://raw.githubusercontent.com/holacracyone/Holacracy-Constitution-5.0-FRENCH/main/Holacracy-Constitution.md`
const systemPrompt = `Tu as accès à un serveur à l'adresse http://localhost:3000/ 
qui comprend les requetes GET, HEAD, PUT, POST, DELETE, PATCH, HEAD, OPTIONS,
commence par un GET sur http://localhost:3000/ et affiche la liste des containers.
Préfère PUT à POST pour créer des ressources dont tu connais l'url, et PATCH pour modifier des ressources.
A chaque nouvelle demande, fais un plan d'execution.
Détaille chaque étape de ta réflexion.
`

console.log(chalk.green('SystemPrompt : ', systemPrompt))

const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  chatWrapper: new Llama3_1ChatWrapper(), //https://github.com/withcatai/node-llama-cpp/issues/299
  systemPrompt: systemPrompt
})
console.log()

async function infinite_run() {
  let input_message = `Bonjour, que puis-je faire pour toi, aujourd'hui ?`

  // const q1 = `Explore http://localhost:3000/ et trouve la fiancée de BioThek, où travaille-t-elle et qui sont ses collègues ?`
  // // const q1 = `
  // // Can you try evaluating this javascript code?

  // // Math.round(Math.random() * 100)`.trim();
  // console.log(chalk.yellow('User: ') + q1)

  // process.stdout.write(chalk.yellow('AI: '))
  // const a1 = await session.prompt(q1, {
  //   functions: chat_functions,
  //   onTextChunk(chunk) {
  //     // stream the response to the console as it's being generated
  //     process.stdout.write(chunk)
  //   }
  // })
  // process.stdout.write('\n')
  // console.log(chalk.yellow('Consolidated AI answer: ') + a1)
  // console.log()

  const discuss = async () => {
    // let controller = new AbortController()
    // const { signal } = controller
    // process.on('SIGINT', function () {
    //   console.log('Caught interrupt signal')

    //   controller.abort()
    //   // controller = null
    //   // if (i_should_exit)
    //   //     process.exit();
    // })
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
          }
          // signal: signal,
          // onAbort: async () => {
          //   /// pas utilisé
          //   console.log('#######################Abort')
          //   await discuss()
          // },
          // stopOnAbortSignal: true
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
