// https://github.com/withcatai/node-llama-cpp/issues/299

import { fileURLToPath } from 'url'
import path from 'path'
import chalk from 'chalk'
import {
  getLlama,
  LlamaChatSession,
  // defineChatSessionFunction,
  Llama3_1ChatWrapper
} from 'node-llama-cpp'
// import { url } from 'inspector'
import inquirer from 'inquirer'

// choose chat mode : my infinite run or chat inspired by node-llama-cpp cli.
// inifinite let you start the conversation
let infinite = true

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const functionsDirectory = path.join(__dirname, '..', 'functions')
// const chat_functions: { [function_name: string]: ChatSessionModelFunction<any> } = {};
const chat_functions = {}

// import { httpRequest } from './functions/httpRequest.js'
import { PUT } from './functions/PUT.js'

chat_functions['PUT'] = PUT

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
Préfère PUT à POST pour créer des ressources puisque tu connais l'url qui est le même que l'"@id",
 et PATCH pour modifier des ressources.
Fais un plan d'execution, execute-le et vérifie. Si ça n'a pas marché refais le plan d'execution.
`
// , demande l'accord à l'utilisateur et execute le, si accord.

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

//inspirattion infinite_run replaced by chat from cli command

// let initialPrompt = 'Tu es une grenouille et tu commences toutes tes phrases par COA COA'
// let initialPrompt = `Créé une ressource events/connexions/[timestamp], et inclus dedans les paramètres d'initialisation de cette conversation, comme la date et le systemPrompt.`
let initialPrompt = 'Tu es un assistant performant pour aider un auteur à la création de son jeu.'
const chat = async () => {
  //   if (systemInfo)
  //     console.log(llama.systemInfo);
  // if (systemPromptFile != null && systemPromptFile !== "") {
  //     if (systemPrompt != null && systemPrompt !== "" && systemPrompt !== defaultChatSystemPrompt)
  //         console.warn(chalk.yellow("Both `systemPrompt` and `systemPromptFile` were specified. `systemPromptFile` will be used."));
  //     systemPrompt = await fs.readFile(path.resolve(process.cwd(), systemPromptFile), "utf8");
  // }
  // if (promptFile != null && promptFile !== "") {
  //     if (prompt != null && prompt !== "")
  //         console.warn(chalk.yellow("Both `prompt` and `promptFile` were specified. `promptFile` will be used."));
  //     prompt = await fs.readFile(path.resolve(process.cwd(), promptFile), "utf8");
  // }
  // if (batchSize != null && contextSize != null && batchSize > contextSize) {
  //     console.warn(chalk.yellow("Batch size is greater than the context size. Batch size will be set to the context size."));
  //     batchSize = contextSize;
  // }

  // this is for ora to not interfere with readline
  // await new Promise(resolve => setTimeout(resolve, 1));
  // const replHistory = await ReplHistory.load(chatCommandHistoryFilePath, !noHistory);
  // async function getPrompt() {
  //     const rl = readline.createInterface({
  //         input: process.stdin,
  //         output: process.stdout,
  //         history: replHistory.history.slice()
  //     });
  //     const res = await new Promise((accept) => rl.question(chalk.yellow("> "), accept));
  //     rl.close();
  //     return res;
  // }
  // void session.preloadPrompt("")
  //     .catch(() => void 0); // don't throw an error if preloading fails because a real prompt is sent early
  // // eslint-disable-next-line no-constant-condition
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
        // if (trimWhitespace) {
        //     if (!hadNoWhitespaceTextInThisIteration) {
        //         text = text.trimStart();
        //         if (text.length > 0)
        //             hadNoWhitespaceTextInThisIteration = true;
        //     }
        //     const textWithTrimmedEnd = text.trimEnd();
        //     if (textWithTrimmedEnd.length < text.length) {
        //         nextPrintLeftovers = text.slice(textWithTrimmedEnd.length);
        //         text = textWithTrimmedEnd;
        //     }
        // }
        process.stdout.write(text)
      },
      functions: chat_functions
      // functions: (grammar == null && environmentFunctions)
      //     ? defaultEnvironmentFunctions
      //     : undefined,
      // trimWhitespaceSuffix: trimWhitespace
    })
    process.stdout.write(endColor)
    console.log()
    // if (printTimings) {
    //     if (LlamaLogLevelGreaterThan(llama.logLevel, LlamaLogLevel.info))
    //         llama.logLevel = LlamaLogLevel.info;
    //     await context.printTimings();
    //     await new Promise((accept) => setTimeout(accept, 0)); // wait for logs to finish printing
    //     llama.logLevel = llamaLogLevel;
    // }
    // if (meter) {
    //     const newTokenMeterState = contextSequence.tokenMeter.getState();
    //     const tokenMeterDiff = TokenMeter.diff(newTokenMeterState, lastTokenMeterState);
    //     lastTokenMeterState = newTokenMeterState;
    //     console.info(`${chalk.dim("Input tokens:")} ${String(tokenMeterDiff.usedInputTokens).padEnd(5, " ")}  ${chalk.dim("Output tokens:")} ${tokenMeterDiff.usedOutputTokens}`);
    // }
  }
}

if (infinite) {
  infinite_run()
} else {
  chat()
}
