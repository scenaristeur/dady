// https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/#prerequisites

// run with `npx ts-node llm/langchain/langraph-agent.ts`
// or npx tsx langraph-agent.ts

import 'dotenv/config'

import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import { ChatOpenAI } from '@langchain/openai'
import { MemorySaver } from '@langchain/langgraph'
import { HumanMessage } from '@langchain/core/messages'
import { createReactAgent } from '@langchain/langgraph/prebuilt'

// Define the tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 3 })]
// const agentModel = new ChatOpenAI({ temperature: 0 })

const agentModel = new ChatOpenAI({
  model: 'Llama 3.2 1B Instruct',
  temperature: 0,
  openAIApiKey: 'EMPTY',
  configuration: {
    basePath: 'http://127.0.0.1:5677/v1/'
  }
})

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver()
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer
})

// Now it's time to use!
const agentFinalState = await agent.invoke(
  {
    messages: [
      new HumanMessage(
        "Don't imagine the response, use tools to answer : what is the current weather in sf"
      )
    ]
  },
  { configurable: { thread_id: '42' } }
)

console.log(agentFinalState.messages[agentFinalState.messages.length - 1].content)

const agentNextState = await agent.invoke(
  { messages: [new HumanMessage('what about ny')] },
  { configurable: { thread_id: '42' } }
)

console.log(agentNextState.messages[agentNextState.messages.length - 1].content)
