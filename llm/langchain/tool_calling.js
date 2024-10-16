// https://langchain-ai.github.io/langgraphjs/how-tos/tool-calling/

import { tool } from '@langchain/core/tools'
import { z } from 'zod'

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
const toolNode = new ToolNode(tools)

import { AIMessage } from '@langchain/core/messages'

const messageWithSingleToolCall = new AIMessage({
  content: '',
  tool_calls: [
    {
      name: 'get_weather',
      args: { location: 'sf' },
      id: 'tool_call_id',
      type: 'tool_call'
    }
  ]
})

let sf_weather = await toolNode.invoke({ messages: [messageWithSingleToolCall] })

console.log(sf_weather.messages[sf_weather.messages.length - 1].content)
console.log(sf_weather)

// chat models
console.log('\n##########CHAT\n')

import { ChatOpenAI } from '@langchain/openai'
const modelWithTools = new ChatOpenAI({
  model: 'Llama 3.2 1B Instruct',
  temperature: 0,
  openAIApiKey: 'EMPTY',
  configuration: {
    basePath: 'http://127.0.0.1:5677/v1/'
  }
}).bindTools(tools)

const responseMessage = await modelWithTools.invoke("what's the weather in sf?")

console.log(responseMessage.tool_calls)

const weather = await toolNode.invoke({
  messages: [await modelWithTools.invoke("what's the weather in sf?")]
})
console.log('\n#############\n', weather)

import { StateGraph, MessagesAnnotation, END, START } from '@langchain/langgraph'

const toolNodeForGraph = new ToolNode(tools)

const shouldContinue = (state) => {
  const { messages } = state
  const lastMessage = messages[messages.length - 1]
  if (
    'tool_calls' in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls?.length
  ) {
    return 'tools'
  }
  return END
}

const callModel = async (state) => {
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

//   import * as tslab from "tslab";

//   const drawableGraph = app.getGraph();
//   const image = await drawableGraph.drawMermaidPng();
//   const arrayBuffer = await image.arrayBuffer();

//   await tslab.display.png(new Uint8Array(arrayBuffer));

import { HumanMessage } from '@langchain/core/messages'

console.log('\n#############1\n')
// example with a single tool call
const stream = await app.stream(
  {
    messages: [{ role: 'user', content: "what's the weather in sf?" }]
  },
  {
    streamMode: 'values'
  }
)
for await (const chunk of stream) {
  const lastMessage = chunk.messages[chunk.messages.length - 1]
  const type = lastMessage._getType()
  const content = lastMessage.content
  const toolCalls = lastMessage.tool_calls
  console.dir(
    {
      type,
      content,
      toolCalls
    },
    { depth: null }
  )
}

console.log('\n#############2\n')
// example with a multiple tool calls in succession
const streamWithMultiToolCalls = await app.stream(
  {
    messages: [{ role: 'user', content: "what's the weather in the coolest cities?" }]
  },
  {
    streamMode: 'values'
  }
)
for await (const chunk of streamWithMultiToolCalls) {
  const lastMessage = chunk.messages[chunk.messages.length - 1]
  const type = lastMessage._getType()
  const content = lastMessage.content
  const toolCalls = lastMessage.tool_calls
  console.dir(
    {
      type,
      content,
      toolCalls
    },
    { depth: null }
  )
}
