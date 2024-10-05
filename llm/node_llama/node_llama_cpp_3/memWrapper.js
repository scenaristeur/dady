import { fileURLToPath } from 'url'
import path from 'path'
import chalk from 'chalk'
import {
  getLlama,
  LlamaChatSession
  // ChatWrapper,
  //Llama3_1ChatWrapper,
  // ChatWrapperSettings, ChatWrapperGenerateContextStateOptions,
  // ChatWrapperGeneratedContextState,
  //LlamaText
} from 'node-llama-cpp'
import inquirer from 'inquirer'
import fs from 'fs/promises'

import { MemWrapper } from './utils/MemWrapper.js'

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
    // 'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf'
    'Llama-3.2-1B-Instruct.Q8_0.gguf'
  )
})
const context = await model.createContext()
const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  chatWrapper: new MemWrapper() // new MyCustomChatWrapper()
})

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
      // console.log(session)

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
