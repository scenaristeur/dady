import { fileURLToPath } from 'url'
import path from 'path'
import { getLlama, LlamaChatSession } from 'node-llama-cpp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const llama = await getLlama()
const model = await llama.loadModel({
  // modelPath: path.join(__dirname, "models", "Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf")

  modelPath: path.join(__dirname, '../../../../../igora/models', 'Llama-3.2-1B-Instruct.Q8_0.gguf')
})
const context = await model.createContext()
const session = new LlamaChatSession({
  contextSequence: context.getSequence()
})

// ensure the model is fully loaded before continuing this demo
await session.preloadPrompt('')

const completionEngine = session.createPromptCompletionEngine({
  // 15 is used for demonstration only,
  // it's best to omit this option
  maxPreloadTokens: 15,
  // temperature: 0.8, // you can set custom generation options
  onGeneration(prompt, completion) {
    console.log(`Prompt: ${prompt} | Completion:${completion}`)
    // you should add a custom code here that checks whether
    // the existing input text equals to `prompt`, and if it does,
    // use `completion` as the completion of the input text.
    // this callback will be called multiple times
    // as the completion is being generated.
  }
})

completionEngine.complete('Hi the')

await new Promise((resolve) => setTimeout(resolve, 1500))

completionEngine.complete('Hi there')
await new Promise((resolve) => setTimeout(resolve, 1500))

completionEngine.complete('Hi there! How')
await new Promise((resolve) => setTimeout(resolve, 1500))

// get an existing completion from the cache
// and begin/continue generating a completion for it
const cachedCompletion = completionEngine.complete('Hi there! How')
console.log('Cached completion:', cachedCompletion)
