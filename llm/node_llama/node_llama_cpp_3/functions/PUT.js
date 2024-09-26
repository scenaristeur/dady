import { defineChatSessionFunction } from 'node-llama-cpp'
import { url } from 'inspector'

export const PUT = defineChatSessionFunction({
  description:
    'Perform an http PUT request for creating resources for a given url and return the response.',
  params: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description:
          'url to perform the request, e.g. http://localhost:3000/ to POST, PUT in the root container'
      },
      // contentType: {
      //   type: 'string',
      //   description:
      //     '(optional) data to send with the request au format jsonld avec un @id identique au url de la ressource'
      // },
      content: {
        type: 'string',
        description: `(optional) data to send with the request au format jsonld avec un @id identique à l'url de la ressource.`
      }
    }
  },
  async handler(params = { url: 'http://localhost:3000/', content: 'ola' }) {
    // try {

    let options = {
      method: 'PUT',
      headers: {
        Accept: 'application/ld+json',
        'Content-Type': 'application/ld+json'
      },
      body: params.content
    }

    const response = await fetch(params.url, options)
    if (response.ok) {
      return response.text()
    } else {
      return `Error fetching ${url}: ${response.statusText}, check the root directory http://localhost:3000/ to find the good container`
    }

    // } catch (error) {
    //   console.error(error)
    //   return {
    //     status: 'ko',
    //     code: error.status,
    //     error: error.message,
    //     err: error,
    //     url: params.url,
    //     payload: params.payload,
    //     method: params.method
    //   }
    // }
  }
})
