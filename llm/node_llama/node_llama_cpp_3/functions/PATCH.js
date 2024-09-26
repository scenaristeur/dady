import { defineChatSessionFunction } from 'node-llama-cpp'
import { url } from 'inspector'

/* examples :
- modifie le lieu de travail de Clara en http://localhost:3000/lieux/centre_recherche
*/

export const PATCH = defineChatSessionFunction({
  description: `Perform an http PATCH request for modifying resources for a given url and return the response.
    example: curl -X PATCH -H "Content-Type: text/n3" --data-raw "@prefix solid: <http://www.w3.org/ns/solid/terms#>. _:rename a solid:InsertDeletePatch; solid:inserts { <ex:s2> <ex:p2> <ex:o2>. }." http://localhost:3000/myfile.ttl`,
  params: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'url to perform the request'
      },
      // contentType: {
      //   type: 'string',
      //   description:
      //     '(optional) data to send with the request au format jsonld avec un @id identique au url de la ressource'
      // },
      content: {
        type: 'string',
        description: `content of the "N3 PATCH" (https://solidproject.org/TR/protocol#n3-patch) `
      }
    }
  },
  async handler(
    params = {
      url: '',
      content:
        '@prefix solid: <http://www.w3.org/ns/solid/terms#>. _:rename a solid:InsertDeletePatch; solid:inserts { <ex:s2> <ex:p2> <ex:o2>. }.'
    }
  ) {
    try {
      let options = {
        method: 'PATCH',
        headers: {
          // Accept: 'application/ld+json',
          'Content-Type': 'text/n3'
        },
        body: params.content
      }

      const response = await fetch(params.url, options)
      if (response.ok) {
        return response.text()
      } else {
        return 'Error patching ' + url + ' : ' + response.message
      }
    } catch (error) {
      console.error(error)
      return {
        status: 'ko',
        code: error.status,
        error: error.message,
        err: error,
        url: params.url,
        content: params.content,
        method: 'PATCH'
      }
    }
  }
})
