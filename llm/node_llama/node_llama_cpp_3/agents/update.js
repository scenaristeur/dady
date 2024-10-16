import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs/promises'
import {
  getLlama,
  LlamaChatSession,
  Llama3_1ChatWrapper,
  defineChatSessionFunction
} from 'node-llama-cpp'
import inquirer from 'inquirer'
import chalk from 'chalk'

import { httpRequest } from '../functions/httpRequest.js'
import { getPageContent } from '../functions/getPageContent.js'
import { listDirectory } from '../functions/files.js'

// choose chat mode : my infinite run or chat inspired by node-llama-cpp cli.
// inifinite let you start the conversation
let infinite = true

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

  const res = chatHistory.map((item) => structuredClone(item))
  console.log(res)
  for (let i = 0; i < res.length; i++) {
    let historyItem = res[i]
    console.log('ITEM', historyItem)
    if (historyItem.type == 'model' && historyItem.response[0].type == 'functionCall') {
      if (historyItem.response[0].result.length > 100) {
        let memory_file = './memory/' + Date.now() + '.txt'
        await fs.writeFile(memory_file, JSON.stringify(historyItem.response[0].result), 'utf8')
        historyItem.response[0].result = '[TOOLONG], stored at ' + memory_file //'[TRUNCATED]'// + historyItem.response[0].result.slice(0, 10)
        res[i] = historyItem
        console.log(res[i])
      }
    }

    //  }
  }
}

let promptFiles = {
  // baseFile: '.././mem/prompts/memgpt_base_fr.txt',
  baseFile: '.././mem/prompts/solid.txt',
  personaFile: '.././mem/prompts/persona_sam_fr.txt',
  humanFile: '.././mem/prompts/human_david_fr.txt'
}

let basePrompt = ''
let coreMemory = { persona: '', human: '' }

async function initPrompt() {
  try {
    basePrompt = await fs.readFile(promptFiles.baseFile, 'utf8')
  } catch (err) {
    console.error(err)
  }
  try {
    coreMemory['persona'] = await fs.readFile(promptFiles.personaFile, 'utf8')
  } catch (err) {
    console.error(err)
  }
  try {
    coreMemory['human'] = await fs.readFile(promptFiles.humanFile, 'utf8')
  } catch (err) {
    console.error(err)
  }

  return basePrompt + '\nPERSONA: \n' + coreMemory.persona + '\nHUMAN: \n' + coreMemory.human
}

let systemPrompt = await initPrompt()
console.log(systemPrompt)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const llama = await getLlama()
const model = await llama.loadModel({
  // modelPath: path.join(__dirname, "models", "Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf")
  modelPath: path.join(
    __dirname,
    '../../../../../igora/models',
    // 'Llama-3.2-3B-Instruct-uncensored.i1-Q4_K_M.gguf'
    'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf' // fonctions
    // 'Llama-3.2-1B-Instruct.Q4_K_M.gguf' // pas de functions
    // 'Llama-3.2-1B-Instruct.Q8_0.gguf'
  )
})
const context = await model.createContext()

const contextShiftOptions = {
  size: 5000, //Math.max(1, Math.floor(context.getSequence().context.contextSize / 10)) || 5000,
  strategy: memoryManager, //'nimp', //memoryManager
  lastEvaluationMetadata: { removedCharactersNumber: 0 }
}

const session = new LlamaChatSession({
  contextSequence: context.getSequence(),

  chatWrapper: new Llama3_1ChatWrapper(), //new MemWrapper() // new MyCustomChatWrapper()
  contextShift: contextShiftOptions,
  systemPrompt: systemPrompt
})

let chat_functions = {}

chat_functions['httpRequest'] = httpRequest
chat_functions['getPageContent'] = getPageContent
chat_functions['listDirectory'] = listDirectory
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
          functions: chat_functions,
          onTextChunk(chunk) {
            // stream the response to the console as it's being generated

            // process.stdout.write(chunk)
            console.log(chunk)
            // console.log(
            //   // 'next',
            //   session.sequence.nextTokenIndex,
            //   // 'size',
            //   '/',
            //   session.context.contextSize
            // )
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
