import { defineChatSessionFunction } from 'node-llama-cpp'

export const coreMemoryAppend = defineChatSessionFunction({
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

  export const coreMemoryGet = defineChatSessionFunction({
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

  export const coreMemoryReplace = defineChatSessionFunction({
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