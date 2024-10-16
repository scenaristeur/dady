// https://js.langchain.com/docs/how_to/qa_chat_history_how_to/#chains

// const { ChatOpenAI } = require("@langchain/openai");
import { ChatOpenAI, OpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "Llama 3.2 1B Instruct",
  temperature: 0, 
  openAIApiKey: 'EMPTY',
  configuration:{
    basePath: "http://127.0.0.1:5677/v1/",
  }

},);


// https://js.langchain.com/docs/tutorials/llm_chain
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];

const response = await model.invoke(messages);
console.log("response une", response)


const stream = await model.stream("Ecris une chanson");

for await (const chunk of stream) {
  process.stdout.write(chunk.content)
  // console.log(chunk.content)
}
process.stdout.write('\n')


// avec callback
// https://js.langchain.com/docs/how_to/streaming_llm/

const modelCB = new OpenAI({
  maxTokens: 250,
  streaming: true,
  openAIApiKey: 'EMPTY',
  configuration:{
    basePath: "http://127.0.0.1:5677/v1/",
  }
});

const responseCall = await modelCB.invoke("Raconte-moi une blague sur un caillou amoureux d'une loutre.", {
  callbacks: [
    {
      handleLLMNewToken(token) {
        // console.log({ token });
        process.stdout.write(token)
      },
    },
  ],
});
console.log(responseCall);

// const response = await model.invoke(new HumanMessage("Hello world!"));
// console.log(response)

// const response = await model.stream(new HumanMessage("Hello world!"));

// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { OpenAIEmbeddings } from "@langchain/openai";

// const loader = new CheerioWebBaseLoader(
//   "https://lilianweng.github.io/posts/2023-06-23-agent/"
// );

// const docs = await loader.load();

// const textSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 1000,
//   chunkOverlap: 200,
// });
// const splits = await textSplitter.splitDocuments(docs);
// const vectorStore = await MemoryVectorStore.fromDocuments(
//   splits,
//   new OpenAIEmbeddings()
// );

// // Retrieve and generate using the relevant snippets of the blog.
// const retriever = vectorStore.asRetriever();





// const embeddings = new OpenAIEmbeddings({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const res = await embeddings.embedQuery("Hello world");
// console.log(res)