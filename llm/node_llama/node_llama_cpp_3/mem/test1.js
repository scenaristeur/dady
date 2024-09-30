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
import fs from 'fs/promises'

// import * as systemPrompt from './prompts/memgpt_base.txt?raw'

let systemPrompt = ''
try {
  systemPrompt = await fs.readFile('./prompts/memgpt_base.txt', 'utf8')
  //   systemPrompt = await fs.readFile('./prompts/memgpt_chat_compressed.txt', 'utf8')
  console.log(systemPrompt)
} catch (err) {
  console.error(err)
}

// choose chat mode : my infinite run or chat inspired by node-llama-cpp cli.
// inifinite let you start the conversation
let infinite = true

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const functionsDirectory = path.join(__dirname, '..', 'functions')
// const chat_functions: { [function_name: string]: ChatSessionModelFunction<any> } = {};
const chat_functions = {}

const llama = await getLlama()

console.log(chalk.yellow('Loading model...'))
const model = await llama.loadModel({
  // modelPath: path.join(modelsFolderDirectory, "functionary-small-v3.2.F16.gguf")
  // modelPath: path.join(__dirname, '../../../../../igora/models', 'llama-pro-8b-instruct.Q2_K.gguf')
  // modelPath: path.join(
  //   __dirname,
  //   '../../../../../igora/models',
  //   'Meta-Llama-3.1-8B-Instruct.Q2_K.gguf'
  // )
  //   modelPath: path.join(
  //     __dirname,
  //     '../../../../../igora/models',
  //     'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf'
  //   )
  //   modelPath: path.join(
  //     __dirname,
  //     '../../../../../igora/models',
  //     'Llama-3.2-1B-Instruct.Q4_K_M.gguf'
  //   ) // ne comprend pas les functions ???
  modelPath: path.join(__dirname, '../../../../../igora/models', 'Llama-3.2-1B-Instruct.Q8_0.gguf')
})

console.log(chalk.yellow('Creating context...'))
const context = await model.createContext()

console.log(llama.systemInfo)

console.log(chalk.green('SystemPrompt : ', systemPrompt))

const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  chatWrapper: new Llama3_1ChatWrapper(), //https://github.com/withcatai/node-llama-cpp/issues/299
  systemPrompt: systemPrompt
})

async function infinite_run() {
  let input_message = `Bonjour, que puis-je faire pour toi, aujourd'hui ?`

  const discuss = async () => {
    inquirer.prompt([{ name: 'user_input', message: input_message }]).then(async (response) => {
      // console.log('user_input', response, response.user_input)

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
          }
        })

        process.stdout.write('\n')
        console.log(chalk.yellow('Consolidated AI answer: ') + a1)
        console.log()

        console.log('SIZE', context.contextSize, context.getAllocatedContextSize())
        // if (session.context.sequencesLeft > 0) {
        //   console.log('evaluated tokens', session.contextSequence.tokenMeter.usedInputTokens)
        //   console.log('generated tokens', session.contextSequence.tokenMeter.usedOutputTokens)
        //   console.log()
        // }

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
