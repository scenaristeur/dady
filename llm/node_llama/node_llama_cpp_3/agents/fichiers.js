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

import { listDirectory, writeFile, readFile, appendFile } from '../functions/files.js'

let chat_functions = {}

chat_functions['listDirectory'] = listDirectory
chat_functions['writeFile'] = writeFile
chat_functions['readFile'] = readFile
chat_functions['appendFile'] = appendFile

// choose chat mode : my infinite run or chat inspired by node-llama-cpp cli.
// inifinite let you start the conversation
let infinite = true

const __dirname = path.dirname(fileURLToPath(import.meta.url))
let directory = path.join(__dirname, 'code')
let systemPrompt = `On travaille TOUJOURS dans le dossier et ses sous dossier ${directory}, jamais plus haut`

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

const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  chatWrapper: new Llama3_1ChatWrapper(), //new MemWrapper() // new MyCustomChatWrapper()
  systemPrompt: systemPrompt
})

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
        process.stdout.write('\n')
        console.log(chalk.yellow('\nConsolidated AI answer: ') + a1)
        console.log(session.sequence.nextTokenIndex, '/', session.context.contextSize)
        console.log()
        input_message = 'User: '
        console.log("tape 'exit' pour sortir")
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
