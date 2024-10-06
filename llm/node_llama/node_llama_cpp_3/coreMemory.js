import { fileURLToPath } from 'url'
import path from 'path'
import chalk from 'chalk'
import {
  getLlama,
  LlamaChatSession,
  // ChatWrapper,
  // LlamaText,
  Llama3_1ChatWrapper,
  defineChatSessionFunction
  // ChatWrapperSettings, ChatWrapperGenerateContextStateOptions,
  // ChatWrapperGeneratedContextState,
  //LlamaText
} from 'node-llama-cpp'
import inquirer from 'inquirer'
import fs from 'fs/promises'

import { httpRequest } from './functions/httpRequest.js'
import { getPageContent } from './functions/getPageContent.js'
import { Persister } from './utils/persister.js'

let persister = new Persister({promptBase: './mem/prompts/memgpt_base.txt', personaFile: './mem/prompts/persona_sam.txt', humanFile: './mem/prompts/human_chad.txt'})
// let persister = new Persister({promptBase: './mem/prompts/memgpt_chat_compressed.txt', personaFile: './mem/prompts/persona_sam.txt', humanFile: './mem/prompts/human_chad.txt'})
await persister.init()
let systemPrompt = await persister.prompt()
console.log(systemPrompt)




// import { MemWrapper } from './utils/MemWrapper.js'

// choose chat mode : my infinite run or chat inspired by node-llama-cpp cli.
// inifinite let you start the conversation
let infinite = true

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const llama = await getLlama()
const model = await llama.loadModel({
  // modelPath: path.join(__dirname, "models", "Meta-Llama-3-8B-Instruct.Q4_K_M.gguf")
  modelPath: path.join(
    __dirname,
    '../../../../igora/models',
    // 'Llama-3.2-3B-Instruct-uncensored.i1-Q4_K_M.gguf'
    'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf'
    // 'Llama-3.2-1B-Instruct.Q8_0.gguf'
  )
})






async function memoryManager({
  chatHistory,
  maxTokensCount,
  tokenizer,
  chatWrapper,
  lastShiftMetadata = {
    removedCharactersNumber: 0
  }
}) {
  console.log('MEMORYMANAGER', {
    // chatHistory,
    maxTokensCount,
    tokenizer,
    chatWrapper,
    lastShiftMetadata
  }) 
  // console.log(lastShiftMetadata)

  // let charactersLeftToRemove = 100

// EDIT CHAT HISTORY
//https://node-llama-cpp.withcat.ai/guide/chat-session#prompt-without-updating-chat-history
// const initialChatHistory = session .getChatHistory ();
 // session.setChatHistory(initialChatHistory);


  const res = chatHistory.map((item) => structuredClone(item))
  console.log(res)
  for (let i = 0 ; i < res.length ; i++) {
    
    let historyItem = res[i]
    console.log("ITEM", historyItem)
    if (historyItem.type == 'model' && historyItem.response[0].type == 'functionCall') {
      if (historyItem.response[0].result.length > 100) {
        let memory_file = './memory/'+Date.now()+'.txt'
        await fs.writeFile(memory_file, JSON.stringify(historyItem.response[0].result), 'utf8')
        historyItem.response[0].result = '[TOOLONG], stored at ' + memory_file //'[TRUNCATED]'// + historyItem.response[0].result.slice(0, 10)
        res[i] = historyItem
        console.log(res[i])
      }
    }




//  }
}
  // for (let i = res.length - 1; i >= 0 && charactersLeftToRemove > 0; i--) {
  //   const historyItem = res[i]
  //   console.log(historyItem)
  //   if (historyItem.type == 'model' && historyItem.response[0].type == 'functionCall') {
  //     if (historyItem.response[0].result.length > 100) {
  //       historyItem.response[0].result = '[TRUNCATED] ' + historyItem.response[0].result.slice(0, 10)
  //     }
      // if (historyItem.type !== 'model') continue
      // for (let t = historyItem.response.length - 1; t >= 0 && charactersLeftToRemove > 0; t--) {
      //   const item = historyItem.response[t]
      //   if (typeof item === 'string' || item.type !== 'functionCall') continue
      //   if (item.rawCall == null) continue
      //   const originalRawCallTokensLength = LlamaText.fromJSON(item.rawCall).tokenize(
      //     tokenizer,
      //     'trimLeadingSpace'
      //   ).length
      //   const newRawCallText = chatWrapper.generateFunctionCall(item.name, item.params)
      //   const newRawCallTextTokensLength = newRawCallText.tokenize(
      //     tokenizer,
      //     'trimLeadingSpace'
      //   ).length
      //   console.log(newRawCallTextTokensLength, originalRawCallTokensLength)
      // }
   // }
  // }

  console.log(res)

  // console.log(chatHistory, maxTokensCount, tokenizer, chatWrapper, lastShiftMetadata)
  let compressedChatHistory = res //chatWrapper.generateInitialChatHistory() //chatHistory
  let newMetadata = { removedCharactersNumber: lastShiftMetadata.removedCharactersNumber + 100 }
  return {
    chatHistory: compressedChatHistory,
    metadata: newMetadata
  }
}

const context = await model.createContext()

const contextShiftOptions = {
  size: 5000, //Math.max(1, Math.floor(context.getSequence().context.contextSize / 10)),
  strategy: memoryManager, //'nimp', //memoryManager
  lastEvaluationMetadata: { removedCharactersNumber: 0 }
}

const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  systemPrompt: systemPrompt,
  chatWrapper: new Llama3_1ChatWrapper(), //new MemWrapper() // new MyCustomChatWrapper()
  contextShift: contextShiftOptions
})

persister.setSession(session) 


const fruitPrices = {
  apple: '$6',
  banana: '$4'
}
const chat_functions = {
  getFruitPrice: defineChatSessionFunction({
    description: 'Get the price of a fruit',
    params: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      }
    },
    async handler(params) {
      const name = params.name.toLowerCase()
      if (Object.keys(fruitPrices).includes(name))
        return {
          name: name,
          price: fruitPrices[name]
        }

      return `Unrecognized fruit "${params.name}"`
    }
  })
}

chat_functions['httpRequest'] = httpRequest
chat_functions['getPageContent'] = getPageContent
// chat_functions['coreMemoryGet'] = persister.coreMemoryGet
// chat_functions['coreMemoryAppend'] = persister.coreMemoryAppend
// chat_functions['coreMemoryReplace'] = persister.coreMemoryReplace

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
      // console.log(session._lastEvaluation)
      persister.run()

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
          functions: chat_functions,
          onTextChunk(chunk) {
            // stream the response to the console as it's being generated

            process.stdout.write(chunk)
            // console.log(
            //   // 'next',
            //   session.sequence.nextTokenIndex,
            //   // 'size',
            //   '/',
            //   session.context.contextSize
            // )
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
        console.log(chalk.yellow('\nConsolidated AI answer: ') + a1)
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
