// https://js.langchain.com/docs/how_to/qa_chat_history_how_to/

import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'
import {
  StateGraph,
  START,
  END,
  MemorySaver,
  messagesStateReducer,
  Annotation
} from '@langchain/langgraph'
import { v4 as uuidv4 } from 'uuid'

// https://js.langchain.com/docs/integrations/text_embedding/llama_cpp/
import { fileURLToPath } from 'url'
import path from 'path'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import { LlamaCppEmbeddings } from '@langchain/community/embeddings/llama_cpp'

// const llm2 = new ChatOpenAI({ model: "gpt-4o" });
const llm2 = new ChatOpenAI({
  model: 'Llama 3.2 1B Instruct',
  temperature: 0,
  openAIApiKey: 'EMPTY',
  configuration: {
    basePath: 'http://127.0.0.1:5677/v1/'
  }
})

// https://js.langchain.com/docs/integrations/text_embedding/llama_cpp/
const embedder = new LlamaCppEmbeddings({
  modelPath: path.join(__dirname, '../../../igora/models', 'Llama-3.2-1B-Instruct.Q4_K_M.gguf')
})
// const embedder_ready =
await embedder.init()
// console.log(embedder_ready)

const loader2 = new CheerioWebBaseLoader(
  'https://lilianweng.github.io/posts/2023-06-23-agent/'
  // 'http://localhost:3000/'
)

const docs2 = await loader2.load()

console.log(docs2.length)

const textSplitter2 = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
})
const splits2 = await textSplitter2.splitDocuments(docs2)
console.log(splits2.length)
const vectorStore2 = await MemoryVectorStore.fromDocuments(splits2, embedder)

// Retrieve and generate using the relevant snippets of the blog.
const retriever2 = vectorStore2.asRetriever()

const contextualizeQSystemPrompt2 =
  'Given a chat history and the latest user question ' +
  'which might reference context in the chat history, ' +
  'formulate a standalone question which can be understood ' +
  'without the chat history. Do NOT answer the question, ' +
  'just reformulate it if needed and otherwise return it as is.'

const contextualizeQPrompt2 = ChatPromptTemplate.fromMessages([
  ['system', contextualizeQSystemPrompt2],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}']
])

const historyAwareRetriever2 = await createHistoryAwareRetriever({
  llm: llm2,
  retriever: retriever2,
  rephrasePrompt: contextualizeQPrompt2
})
console.log('history aware retriever', historyAwareRetriever2)

const systemPrompt2 =
  'You are an assistant for question-answering tasks. ' +
  'Use the following pieces of retrieved context to answer ' +
  "the question. If you don't know the answer, say that you " +
  "don't know. Use three sentences maximum and keep the " +
  'answer concise.' +
  '\n\n' +
  '{context}'

const qaPrompt2 = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt2],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}']
])

const questionAnswerChain2 = await createStuffDocumentsChain({
  llm: llm2,
  prompt: qaPrompt2
})

const ragChain2 = await createRetrievalChain({
  retriever: historyAwareRetriever2,
  combineDocsChain: questionAnswerChain2
})

// Define the State interface
const GraphAnnotation2 = Annotation.Root({
  input: Annotation(),
  chat_history: Annotation({
    reducer: messagesStateReducer,
    default: () => []
  }),
  context: Annotation(),
  answer: Annotation()
})

// Define the call_model function
async function callModel2(state) {
  const response = await ragChain2.invoke(state)
  return {
    chat_history: [new HumanMessage(state.input), new AIMessage(response.answer)],
    context: response.context,
    answer: response.answer
  }
}

// Create the workflow
const workflow2 = new StateGraph(GraphAnnotation2)
  .addNode('model', callModel2)
  .addEdge(START, 'model')
  .addEdge('model', END)

// Compile the graph with a checkpointer object
const memory2 = new MemorySaver()
const app2 = workflow2.compile({ checkpointer: memory2 })

const threadId2 = uuidv4()
const config2 = { configurable: { thread_id: threadId2 } }

const result3 = await app2.invoke({ input: 'What is Task Decomposition?' }, config2)
console.log(result3.answer)

const result4 = await app2.invoke({ input: 'What is one way of doing it?' }, config2)
console.log(result4.answer)
