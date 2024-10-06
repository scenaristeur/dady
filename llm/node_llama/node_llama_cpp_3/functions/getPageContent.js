import { defineChatSessionFunction } from 'node-llama-cpp'
import got from 'got';

export const getPageContent = defineChatSessionFunction({
  description:
    'Get the content of a webpage giving a url and return the content as a json object.',
  params: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description:
          'url to get the content, e.g. http://localhost:3000/ '
      }
    }
  },
  async handler(params = { url: 'http://localhost:3000/'}) {
    try {
        const data = await got(params.url).text();
        console.log(data)

        return data
    } catch (error) {
      console.error(error)
      return {
        status: 'ko',
        error: error
      }
    }
  }
})
