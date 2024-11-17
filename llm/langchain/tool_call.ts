//https://langchain-ai.github.io/langgraphjs/how-tos/tool-calling/

// run with npx tsx tool_call.ts

import 'dotenv/config'

import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import fs from 'node:fs/promises'

const getWeather = tool(
  (input) => {
    if (['sf', 'san francisco'].includes(input.location.toLowerCase())) {
      return "It's 60 degrees and foggy."
    } else {
      return "It's 90 degrees and sunny."
    }
  },
  {
    name: 'get_weather',
    description: 'Call to get the current weather.',
    schema: z.object({
      location: z.string().describe('Location to get the weather for.')
    })
  }
)

const getCoolestCities = tool(
  () => {
    return 'nyc, sf'
  },
  {
    name: 'get_coolest_cities',
    description: 'Get a list of coolest cities',
    schema: z.object({
      noOp: z.string().optional().describe('No-op parameter.')
    })
  }
)

import { ToolNode } from '@langchain/langgraph/prebuilt'

const tools = [getWeather, getCoolestCities]
// const toolNode = new ToolNode(tools)

// import { AIMessage } from '@langchain/core/messages'

// const messageWithSingleToolCall = new AIMessage({
//   content: '',
//   tool_calls: [
//     {
//       name: 'get_weather',
//       args: { location: 'sf' },
//       id: 'tool_call_id',
//       type: 'tool_call'
//     }
//   ]
// })

// let result = await toolNode.invoke({ messages: [messageWithSingleToolCall] })
// console.log(result)

// const messageWithMultipleToolCalls = new AIMessage({
//   content: '',
//   tool_calls: [
//     {
//       name: 'get_coolest_cities',
//       args: {},
//       id: 'tool_call_id',
//       type: 'tool_call'
//     },
//     {
//       name: 'get_weather',
//       args: { location: 'sf' },
//       id: 'tool_call_id_2',
//       type: 'tool_call'
//     }
//   ]
// })

// let result2 = await toolNode.invoke({ messages: [messageWithMultipleToolCalls] })
// console.log(result2)

// import { ChatAnthropic } from '@langchain/anthropic'
import { ChatOpenAI } from '@langchain/openai'
// const modelWithTools = new ChatAnthropic({
//   model: 'claude-3-haiku-20240307',
//   temperature: 0
// }).bindTools(tools)

const modelWithTools = new ChatOpenAI({
  model: 'Llama 3.2 1B Instruct',
  temperature: 0,
  openAIApiKey: 'EMPTY',
  configuration: {
    // basePath: 'http://127.0.0.1:5677/v1/'
    basePath: 'http://192.168.1.48:5677/v1/'
  }
}).bindTools(tools)

// const responseMessage = await modelWithTools.invoke('Quel temps fait-il à Lyon ?')

// console.log(responseMessage.tool_calls)

import { StateGraph, MessagesAnnotation, END, START } from '@langchain/langgraph'

const toolNodeForGraph = new ToolNode(tools)
console.log('ToolNode', toolNodeForGraph)

const shouldContinue = (state /*: typeof MessagesAnnotation.State*/) => {
  const { messages } = state
  const lastMessage = messages[messages.length - 1]
  console.log('\n#####DEBUG\n', lastMessage, '\n#####\n')
  if (
    'tool_calls' in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls?.length
  ) {
    return 'tools'
  }
  return END
}

const callModel = async (state /*: typeof MessagesAnnotation.State*/) => {
  const { messages } = state
  const response = await modelWithTools.invoke(messages)
  return { messages: response }
}

const workflow = new StateGraph(MessagesAnnotation)
  // Define the two nodes we will cycle between
  .addNode('agent', callModel)
  .addNode('tools', toolNodeForGraph)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', shouldContinue, ['tools', END])
  .addEdge('tools', 'agent')

const app = workflow.compile()

import { HumanMessage } from '@langchain/core/messages'

// Use the agent
const finalState = await app.invoke({
  messages: [new HumanMessage('what is the weather in sf')]
})
console.log(finalState.messages[finalState.messages.length - 1].content)

const nextState = await app.invoke({
  // Including the messages from the previous run gives the LLM context.
  // This way it knows we're asking about the weather in NY
  messages: [...finalState.messages, new HumanMessage('what about ny')]
})
console.log(nextState.messages[nextState.messages.length - 1].content)

import * as tslab from 'tslab'

const drawableGraph = app.getGraph()
const image = await drawableGraph.drawMermaidPng()
const arrayBuffer = await image.arrayBuffer()

// await tslab.display.png(new Uint8Array(arrayBuffer));
await fs.writeFile('graph.png', new Uint8Array(arrayBuffer))
