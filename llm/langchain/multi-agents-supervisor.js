// https://langchain-ai.github.io/langgraphjs/concepts/multi_agent/?h=multi#supervisor
// https://langchain-ai.github.io/langgraphjs/tutorials/multi_agent/agent_supervisor/

import 'dotenv/config'

import { END, Annotation } from '@langchain/langgraph'
// import { BaseMessage } from "@langchain/core/messages";

// This defines the object that is passed between each node
// in the graph. We will create different nodes for each agent and tool
const AgentState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => []
  }),
  // The agent node that last performed work
  next: Annotation({
    reducer: (x, y) => y ?? x ?? END,
    default: () => END
  })
})

import 'esm-hook' // Only for running this in TSLab. See: https://github.com/yunabe/tslab/issues/72
import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import { DynamicStructuredTool } from '@langchain/core/tools'
import * as d3 from 'd3'
// ----------ATTENTION----------
// If attempting to run this notebook locally, you must follow these instructions
// to install the necessary system dependencies for the `canvas` package.
// https://www.npmjs.com/package/canvas#compiling
// -----------------------------
import { createCanvas } from 'canvas'
import { z } from 'zod'
// import * as tslab from 'tslab'
import fs from 'fs/promises'

const chartTool = new DynamicStructuredTool({
  name: 'generate_bar_chart',
  description:
    "Génère un graphique en barres à partir d'un tableau de points de données en utilisant D3.js et l'affiche pour l'utilisateur.",
  schema: z.object({
    data: z
      .object({
        label: z.string(),
        value: z.number()
      })
      .array()
  }),
  func: async ({ data }) => {
    const width = 500
    const height = 500
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) ?? 0])
      .nice()
      .range([height - margin.bottom, margin.top])

    const colorPalette = [
      '#e6194B',
      '#3cb44b',
      '#ffe119',
      '#4363d8',
      '#f58231',
      '#911eb4',
      '#42d4f4',
      '#f032e6',
      '#bfef45',
      '#fabebe'
    ]

    data.forEach((d, idx) => {
      ctx.fillStyle = colorPalette[idx % colorPalette.length]
      ctx.fillRect(x(d.label) ?? 0, y(d.value), x.bandwidth(), height - margin.bottom - y(d.value))
    })

    ctx.beginPath()
    ctx.strokeStyle = 'black'
    ctx.moveTo(margin.left, height - margin.bottom)
    ctx.lineTo(width - margin.right, height - margin.bottom)
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    x.domain().forEach((d) => {
      const xCoord = (x(d) ?? 0) + x.bandwidth() / 2
      ctx.fillText(d, xCoord, height - margin.bottom + 6)
    })

    ctx.beginPath()
    ctx.moveTo(margin.left, height - margin.top)
    ctx.lineTo(margin.left, height - margin.bottom)
    ctx.stroke()

    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    const ticks = y.ticks()
    ticks.forEach((d) => {
      const yCoord = y(d) // height - margin.bottom - y(d);
      ctx.moveTo(margin.left, yCoord)
      ctx.lineTo(margin.left - 6, yCoord)
      ctx.stroke()
      ctx.fillText(d.toString(), margin.left - 8, yCoord)
    })
    // await tslab.display.png(canvas.toBuffer())
    await fs.writeFile('chart.png', canvas.toBuffer())
    return "Le graphique a été généré et affiché à l'utilisateur!"
  }
})

const tavilyTool = new TavilySearchResults()

// import { z } from "zod";
import { JsonOutputToolsParser } from 'langchain/output_parsers'
import { ChatOpenAI } from '@langchain/openai'
// import { ChatAnthropic } from '@langchain/anthropic'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'

const members = ['researcher', 'chart_generator']

const systemPrompt =
  'Vous êtes un superviseur chargé de gérer une conversation entre les' +
  ' travailleurs suivants: {members}. Étant donné la requête utilisateur' +
  ' suivante, répondez avec le travailleur qui devrait agir en suivant.' +
  ' Chaque travailleur effectuera une tâche et répondra avec ses résultats' +
  ' et son statut. Lorsque vous avez terminé, répondez avec FINISH.'
const options = [END, ...members]

// Define the routing function
const routingTool = {
  name: 'route',
  description: 'Select the next role.',
  schema: z.object({
    next: z.enum([END, ...members])
  })
}

const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt],
  new MessagesPlaceholder('messages'),
  [
    'system',
    'Étant donné la conversation ci-dessus, qui devrait agir en suivant?' +
      " Ou devrions-nous FINISH? Sélectionnez l'un des suivants: {options}"
  ]
])

const formattedPrompt = await prompt.partial({
  options: options.join(', '),
  members: members.join(', ')
})

// const llm = new ChatOpenAI({
//   modelName: 'gpt-4o',
//   temperature: 0
// })
// const llm = new ChatAnthropic({
//   model: 'claude-3-5-sonnet-20240620',
//   temperature: 0
// })

const llm = new ChatOpenAI({
  model: 'Llama 3.2 1B Instruct',
  temperature: 0,
  openAIApiKey: 'EMPTY',
  configuration: {
    basePath: 'http://127.0.0.1:5677/v1/'
  }
})

const supervisorChain = formattedPrompt
  .pipe(
    llm.bindTools([routingTool], {
      tool_choice: 'route'
    })
  )
  .pipe(new JsonOutputToolsParser())
  // select the first one
  .pipe((x) => x[0].args)

import { HumanMessage } from '@langchain/core/messages'

await supervisorChain.invoke({
  messages: [
    new HumanMessage({
      content: 'write a report on birds.'
    })
  ]
})

// import { RunnableConfig } from "@langchain/core/runnables";
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { SystemMessage } from '@langchain/core/messages'

// Recall llm was defined as ChatOpenAI above
// It could be any other language model
const researcherAgent = createReactAgent({
  llm,
  tools: [tavilyTool],
  messageModifier: new SystemMessage(
    'You are a web researcher. You may use the Tavily search engine to search the web for' +
      ' important information, so the Chart Generator in your team can make useful plots.'
  )
})

const researcherNode = async (
  state /*: typeof AgentState.State*/,
  config /*?: RunnableConfig*/
) => {
  const result = await researcherAgent.invoke(state, config)
  const lastMessage = result.messages[result.messages.length - 1]
  return {
    messages: [new HumanMessage({ content: lastMessage.content, name: 'Researcher' })]
  }
}

const chartGenAgent = createReactAgent({
  llm,
  tools: [chartTool],
  messageModifier: new SystemMessage(
    "You excel at generating bar charts. Use the researcher's information to generate the charts."
  )
})

const chartGenNode = async (state /*: typeof AgentState.State*/, config /*?: RunnableConfig*/) => {
  const result = await chartGenAgent.invoke(state, config)
  const lastMessage = result.messages[result.messages.length - 1]
  return {
    messages: [new HumanMessage({ content: lastMessage.content, name: 'ChartGenerator' })]
  }
}

import { START, StateGraph } from '@langchain/langgraph'

// 1. Create the graph
const workflow = new StateGraph(AgentState)
  // 2. Add the nodes; these will do the work
  .addNode('researcher', researcherNode)
  .addNode('chart_generator', chartGenNode)
  .addNode('supervisor', supervisorChain)
// 3. Define the edges. We will define both regular and conditional ones
// After a worker completes, report to supervisor
members.forEach((member) => {
  workflow.addEdge(member, 'supervisor')
})

workflow.addConditionalEdges('supervisor', (x /*: typeof AgentState.State*/) => x.next)

workflow.addEdge(START, 'supervisor')

const graph = workflow.compile()

let streamResults = graph.stream(
  {
    messages: [
      new HumanMessage({
        content: 'Quels étaient les 3 émissions de télévision les plus populaires en 2023 ?'
      })
    ]
  },
  { recursionLimit: 100 }
)

for await (const output of await streamResults) {
  if (!output?.__end__) {
    console.log(output)
    console.log('----')
  }
}

streamResults = graph.stream(
  {
    messages: [
      new HumanMessage({
        content:
          'Génère un graphique en barres de la croissance du PIB des États-Unis de 2021 à 2023.'
      })
    ]
  },
  { recursionLimit: 150 }
)

for await (const output of await streamResults) {
  if (!output?.__end__) {
    console.log(output)
    console.log('----')
  }
}
