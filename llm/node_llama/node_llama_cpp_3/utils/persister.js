import fs from 'fs/promises'
import {  defineChatSessionFunction } from 'node-llama-cpp'
export class Persister {
  constructor(options= {promptBase: './mem/prompts/memgpt_base.txt', personaFile: './mem/prompts/persona_sam.txt', humanFile: './mem/prompts/human_chad.txt'}) {
    this.options = options
    this.session = null
    this.coreMemory = {persona: '', human:''}
    this.coreMemorySize = 100
    this.externalMemory = []
    this.externalMemorySize = 100
    this.archivalMemory = []
    this.archivalMemorySize = 100
    this.systemPrompt = ''

    this.full_prompt = ''
    // this.callbacks = callbacks
    // console.log("store", store)
    //handleAction("one")
    //   this.id = uuidv4()
    //   this.listening = []
    //   this.awareness = null
    //   this.connect()

  }

  async init() {
    try {
      this.systemPrompt = await fs.readFile(this.options.promptBase, 'utf8')
      //   systemPrompt = await fs.readFile('./prompts/memgpt_chat_compressed.txt', 'utf8')
    } catch (err) {
      console.error(err)
    }
    try {
      this.coreMemory['persona'] = await fs.readFile(this.options.personaFile, 'utf8')
      //   systemPrompt = await fs.readFile('./prompts/memgpt_chat_compressed.txt', 'utf8')
    } catch (err) {
      console.error(err)
    }
    try {
      this.coreMemory['human'] = await fs.readFile(this.options.humanFile, 'utf8')
      //   systemPrompt = await fs.readFile('./prompts/memgpt_chat_compressed.txt', 'utf8')
    } catch (err) {
      console.error(err)
    }

  }
 
  setSession(session) {
    this.session = session
  }

  async prompt() {
    this.full_prompt = [this.systemPrompt, "\nThis is your Persona:\n" + this.coreMemory['persona'], "\nYou interact with this Human:\n" + this.coreMemory['human']].join('\n')
    console.log("FULL PROMPT\n##########\n", this.full_prompt, "\n##########\n")
    return this.full_prompt
  }

  run() {
    console.log(this.session.sequence.nextTokenIndex, this.session.context.contextSize)
    // let chatHistory = this.session.chatWrapper.generateInitialChatHistory()
    // this.session._chatHistory = chatHistory
  }
  debug() {
    console.log(this.session)
    console.log(this.session.context.contextSize, this.session.sequence, this.session._chatHistory)

  }

  coreMemoryAppend = defineChatSessionFunction({
    description:
      `Append to the contents of core memory.
        Args:
            name (str): Section of the memory to be edited (persona or human).
            content (str): Content to write to the memory. All unicode (including emojis) are supported.
        Returns:
            newContent[str]: The new updated coreMemory section content.
       `,
    params: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          description:
            'Section of the memory to be edited only 2 values are accepted : "persona" or "human")'
        },
        content: {
          type: 'string',
          description:
            'Content to write to the memory. All unicode (including emojis) are supported'
        },
      }
  
    },
    async handler(params ) {
      try {
        this.coreMemory[params.section] = params.content
        return this.coreMemory[params.section]      
      } catch (error) {
        console.error(error)
        return error
      }
    }
  })

  coreMemoryGet = defineChatSessionFunction({
    description:
      `Get to the contents of core memory.`,
    params: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          description:
            'Section of the memory to be getted only 2 values are accepted : "persona" or "human")'
        },
      }
  
    },
    async handler(params ) {
      try {
        return this.coreMemory[params.section]      
      } catch (error) {
        console.error(error)
        return error
      }
    }
  })

  coreMemoryReplace = defineChatSessionFunction({
    description:
      `Replace the contents of core memory. To delete memories, use an empty string for new_content.
        Args:
            name (str): Section of the memory to be edited (persona or human).
            old_content (str): String to replace. Must be an exact match.
            new_content (str): Content to write to the memory. All unicode (including emojis) are supported.
        Returns:
            newContent[str]: The new updated coreMemory section content.`,
    params: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          description:
            'Section of the memory to be getted only 2 values are accepted : "persona" or "human")'
        },
        old_content: {
          type: 'string',
          description:
            'String to replace. Must be an exact match.'
        },
        new_content: {
          type: 'string',
          description:
            'Content to write to the memory. All unicode (including emojis) are supported.'
        },
      }
  
    },
    async handler(params ) {
      try {
        this.coreMemory[params.section].replaceAll(params.old_content, params.new_content)
        return this.coreMemory[params.section]      
      } catch (error) {
        console.error(error)
        return error
      }
    }
  })

  
}

