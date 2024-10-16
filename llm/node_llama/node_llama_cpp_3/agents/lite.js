/* this is a test for llama 3B & 1B functions
https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_2/
*/

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs/promises'
import {
  getLlama,
  LlamaChatSession,
  Llama3_1ChatWrapper
  // defineChatSessionFunction
} from 'node-llama-cpp'
import inquirer from 'inquirer'
import chalk from 'chalk'

import { httpRequest } from '../functions/httpRequest.js'
import { getPageContent } from '../functions/getPageContent.js'

// choose chat mode : my infinite run or chat inspired by node-llama-cpp cli.
// inifinite let you start the conversation
let infinite = true

// let promptFiles = {
//   // baseFile: '.././mem/prompts/memgpt_base_fr.txt',
//   baseFile: '.././mem/prompts/solid.txt',
//   personaFile: '.././mem/prompts/persona_sam_fr.txt',
//   humanFile: '.././mem/prompts/human_david_fr.txt'
// }

// let basePrompt = ''
// let coreMemory = { persona: '', human: '' }

// async function initPrompt() {
//   try {
//     basePrompt = await fs.readFile(promptFiles.baseFile, 'utf8')
//   } catch (err) {
//     console.error(err)
//   }
//   try {
//     coreMemory['persona'] = await fs.readFile(promptFiles.personaFile, 'utf8')
//   } catch (err) {
//     console.error(err)
//   }
//   try {
//     coreMemory['human'] = await fs.readFile(promptFiles.humanFile, 'utf8')
//   } catch (err) {
//     console.error(err)
//   }

//   return basePrompt + '\nPERSONA: \n' + coreMemory.persona + '\nHUMAN: \n' + coreMemory.human
// }

// let systemPrompt = await initPrompt()
// console.log(systemPrompt)
// const fruitPrices = {
//   apple: '$6',
//   banana: '$4'
// }
// let function_definitions = [
//   {
//     name: 'get_user_info',
//     description:
//       'Retrieve details for a specific user by their unique identifier. Note that the provided function is in Python 3 syntax.',
//     parameters: {
//       type: 'dict',
//       required: ['user_id'],
//       properties: {
//         user_id: {
//           type: 'integer',
//           description:
//             'The unique identifier of the user. It is used to fetch the specific user details from the database.'
//         },
//         special: {
//           type: 'string',
//           description:
//             'Any special information or parameters that need to be considered while fetching user details.',
//           default: 'none'
//         }
//       }
//     },
//     return: {
//       type: 'string',
//       description:
//         'The function call in python 3 syntax. It should return the user details as a JSON string.'
//     }
//   },
//   {
//     name: 'get_fruit_price',
//     description: 'Get the price of a fruit',
//     parameters: { type: 'string', required: ['name'] },
//     return: { type: 'string', description: 'The price of the fruit as a string' },
//     async handler(params) {
//       const name = params.name.toLowerCase()
//       if (Object.keys(fruitPrices).includes(name))
//         return {
//           name: name,
//           price: fruitPrices[name]
//         }

//       return `Unrecognized fruit "${params.name}"`
//     }
//   }
// ]

let chat_functions = {}
chat_functions['httpRequest'] = httpRequest
chat_functions['getPageContent'] = getPageContent

let system_prompt = `You are an expert in composing functions. You are given a question and a set of possible functions. 
Based on the question, you will need to make one or more function/tool calls to achieve the purpose. 
If none of the function can be used, point it out. If the given question lacks the parameters required by the function,
also point it out. You should only return the function call in tools call sections.

If you decide to invoke any of the function(s), you MUST put it in the format of [func_name1(params_name1=params_value1, params_name2=params_value2...), func_name2(params)]\n
You SHOULD NOT include any other text in the response.

Here is a list of functions in JSON format that you can invoke.\n\n${JSON.stringify(chat_functions)}\n`

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const llama = await getLlama()
const model = await llama.loadModel({
  // modelPath: path.join(__dirname, "models", "Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf")
  modelPath: path.join(
    __dirname,
    '../../../../../igora/models',
    // 'Llama-3.2-3B-Instruct-uncensored.i1-Q4_K_M.gguf'
    // 'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf' // fonctions
    'Llama-3.2-1B-Instruct.Q4_K_M.gguf' // pas de functions
    // 'Llama-3.2-1B-Instruct.Q8_0.gguf'
  )
})
const context = await model.createContext()
const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  chatWrapper: new Llama3_1ChatWrapper(),
  systemPrompt: system_prompt
})

// Save the initial chat history
// const initialChatHistory = session.getChatHistory()

// console.log(initialChatHistory)

// const q1 = 'Qui es-tu?'
// console.log('User: ' + q1)

// const a1 = await session.prompt(q1)
// console.log('AI: ' + a1)

// Reset the chat history
// session.setChatHistory(initialChatHistory)

// const q2 = 'résume ce que tu as dit'
// console.log('User: ' + q2)

// // This response will not be aware of the previous interaction
// const a2 = await session.prompt(q2)
// console.log('AI: ' + a2)

// const q3 = 'Qui suis-je ?'
// console.log('User: ' + q3)

// // This response will not be aware of the previous interaction
// const a3 = await session.prompt(q3)
// console.log('AI: ' + a3)

// const ChatHistory = session.getChatHistory()

// console.log(ChatHistory)

// const fruitPrices = {
//   apple: '$6',
//   banana: '$4'
// }
// const chat_functions = {
//   getFruitPrice: defineChatSessionFunction({
//     description: 'Get the price of a fruit',
//     params: {
//       type: 'object',
//       properties: {
//         name: {
//           type: 'string'
//         }
//       }
//     },
//     async handler(params) {
//       const name = params.name.toLowerCase()
//       if (Object.keys(fruitPrices).includes(name))
//         return {
//           name: name,
//           price: fruitPrices[name]
//         }

//       return `Unrecognized fruit "${params.name}"`
//     }
//   })
// }
// let chat_functions = {}

// chat_functions['httpRequest'] = httpRequest
// chat_functions['getPageContent'] = getPageContent
// chat_functions['coreMemoryGet'] = persister.coreMemoryGet
// chat_functions['coreMemoryAppend'] = persister.coreMemoryAppend
// chat_functions['coreMemoryReplace'] = persister.coreMemoryReplace

async function infinite_run() {
  let input_message = `Bonjour, que puis-je faire pour toi, aujourd'hui ?`

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
      // console.log(session._lastEvaluation)
      // persister.run()

      if (response.user_input == 'exit') {
        console.log("tape 'exit' pour sortir, load & save pour history")
        process.exit(0)
      } else if (response.user_input == 'save') {
        const chatHistory = session.getChatHistory()
        await fs.writeFile('chatHistory.json', JSON.stringify(chatHistory), 'utf8')
        discuss()
      } else if (response.user_input == 'load') {
        const chatHistory = JSON.parse(await fs.readFile('chatHistory.json', 'utf8'))
        session.setChatHistory(chatHistory)
        discuss()
      } else {
        console.log(chalk.yellow('User: ') + response.user_input)

        process.stdout.write(chalk.yellow('AI: '))
        const a1 = await session.prompt(response.user_input, {
          // functions: chat_functions,
          onTextChunk(chunk) {
            // stream the response to the console as it's being generated

            process.stdout.write(chunk)
          },
          signal: signal,
          onAbort: async (reason) => {
            /// pas utilisé
            console.log('#######################Abort', reason)
            await discuss()
          },
          stopOnAbortSignal: true
        })
        // console.log('END2', chunk, 'END2')
        // process.stdout.write(chunk)
        process.stdout.write('\n')
        console.log(chalk.yellow('\nConsolidated AI answer: ') + a1)
        console.log(
          // 'next',
          session.sequence.nextTokenIndex,
          // 'size',
          '/',
          session.context.contextSize
        )
        console.log()
        input_message = 'User: '
        console.log("tape 'exit' pour sortir")

        // mm.run()
        await discuss()
      }
    })
  }

  await discuss()
}

//inspirattion infinite_run replaced by chat from cli command

// let initialPrompt = 'Tu es une grenouille et tu commences toutes tes phrases par COA COA'
// let initialPrompt = `Créé une ressource events/connexions/[timestamp], et inclus dedans les paramètres d'initialisation de cette conversation, comme la date et le systemPrompt.`
let initialPrompt = 'Tu es un assistant performant pour aider un auteur à la création de son jeu.'
const chat = async () => {
  while (true) {
    let hadNoWhitespaceTextInThisIteration = false
    let nextPrintLeftovers = ''
    const input = initialPrompt
    // != null
    //     ? initialPrompt
    //     : await getPrompt();
    if (initialPrompt != null) {
      console.log(chalk.green('> ') + initialPrompt)
      initialPrompt = null
    }
    // else
    //     await replHistory.add(input);
    if (input === '.exit') break
    process.stdout.write(chalk.yellow('AI: '))
    const [startColor, endColor] = chalk.blue('MIDDLE').split('MIDDLE')
    process.stdout.write(startColor)
    await session.prompt(input, {
      // grammar: grammar, // this is a workaround to allow passing both `functions` and `grammar`
      // temperature,
      // minP,
      // topK,
      // topP,
      // repeatPenalty: {
      //     penalty: repeatPenalty,
      //     frequencyPenalty: repeatFrequencyPenalty != null ? repeatFrequencyPenalty : undefined,
      //     presencePenalty: repeatPresencePenalty != null ? repeatPresencePenalty : undefined,
      //     penalizeNewLine: penalizeRepeatingNewLine,
      //     lastTokens: lastTokensRepeatPenalty
      // },
      // maxTokens: maxTokens === -1
      //     ? context.contextSize
      //     : maxTokens <= 0
      //         ? undefined
      //         : maxTokens,
      onTextChunk(chunk) {
        let text = nextPrintLeftovers + chunk
        nextPrintLeftovers = ''

        process.stdout.write(text)
      }
      // functions: chat_functions
    })
    process.stdout.write(endColor)
  }
}

if (infinite) {
  infinite_run()
} else {
  chat()
}
