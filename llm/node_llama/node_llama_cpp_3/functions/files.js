import { defineChatSessionFunction } from 'node-llama-cpp'
import fs from 'fs/promises'
import { Buffer } from 'buffer'
import { strict as assert } from 'assert'
import path from 'path'

import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const default_path = path.join(__dirname, 'code')

export const listDirectory = defineChatSessionFunction({
  description: 'read all files and folders in a directory',
  params: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'path of the directory to read'
      }
    }
  },
  async handler(params = { path: default_path }) {
    try {
      console.log('PATH', params.path)
      let fileList = await fs.readdir(params.path)
      console.log(fileList)
      return fileList
    } catch (error) {
      console.error(error)
      return error
    }
  }
})

export const makeDirectory = defineChatSessionFunction({
  description: 'create recursively a directory',
  params: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'path of the directory to create'
      }
    }
  },
  async handler(params = { path: default_path }) {
    try {
      console.log('PATH', params.path)
      let dir = await fs.mkdir(params.path, { recursive: true })
      return dir
    } catch (error) {
      console.error(error)
      return error
    }
  }
})

export const writeFile = defineChatSessionFunction({
  description: 'write a file',
  params: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        description: 'path of the file to write must always start with ' + default_path
      },
      content: {
        type: 'string',
        description: 'content of the file to write'
      }
    }
  },
  async handler(params = { file: 'message.txt', content: 'Hello Node.js' }) {
    try {
      const data = new Uint8Array(Buffer.from(params.content))
      await fs.writeFile(params.file, data, (err) => {
        if (err) throw err
        console.log('The file has been saved!')
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }
})

export const readFile = defineChatSessionFunction({
  description: 'read a file and return its content',
  params: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        description: 'path of the file to write MUST always start with ' + default_path
      }
    }
  },
  async handler(params = { file: default_path }) {
    try {
      let content = await fs.readFile(params.file)
      return content
    } catch (error) {
      console.error(error)
      return error
    }
  }
})

export const appendFile = defineChatSessionFunction({
  description: 'append data to a file',
  params: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        description: 'path of the file to write'
      },
      content: {
        type: 'string',
        description: 'content of the file to append'
      }
    }
  },
  async handler(params = { file: '', content: '' }) {
    try {
      let content = await fs.appendFile(params.file, params.content, 'utf8')
      return content
    } catch (error) {
      console.error(error)
      return error
    }
  }
})
