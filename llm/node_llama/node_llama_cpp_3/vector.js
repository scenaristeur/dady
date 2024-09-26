import { fileURLToPath } from 'url'
import path from 'path'
import { getLlama } from 'node-llama-cpp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const llama = await getLlama()
const model = await llama.loadModel({
  modelPath: path.join(
    __dirname,
    '../../../../igora/models',
    'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf'
  )
})
const context = await model.createEmbeddingContext()

const text = 'Hello world'
console.log('Text:', text)

const embedding = await context.getEmbeddingFor(text)
console.log('Embedding vector:', embedding.vector)
