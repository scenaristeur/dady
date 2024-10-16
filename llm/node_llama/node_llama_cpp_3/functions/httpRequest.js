import { defineChatSessionFunction } from 'node-llama-cpp'

export const httpRequest = defineChatSessionFunction({
  description:
    'Perform an http request (GET, HEAD,  PUT, POST, DELETE, PATCH, OPTIONS...) and return the response. It is an asynchronous function.',
  params: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description:
          'url to perform the request, e.g. http://localhost:3000/ to POST, PUT in the root container'
      },
      method: {
        type: 'string',
        description:
          '(optional) method to send with the request (e.g. POST, PUT, DELETE, PATCH, OPTIONS)'
      },
      data: {
        type: 'string',
        description:
          '(optional) data to send with the request au format jsonld avec un @id identique au url de la ressource'
      },
      contentType: {
        type: 'string',
        description: `(optional) Content-Type pour les requêtes PATCH 
          exemple : 
          "text/n3" pour une réquête du style "@prefix solid: <http://www.w3.org/ns/solid/terms#>. _:rename a solid:InsertDeletePatch; solid:inserts { <ex:s2> <ex:p2> <ex:o2>. }."
          ou "application/sparql-update" pour une requête SPARQL du type "INSERT DATA { <ex:s2> <ex:p2> <ex:o2> }".`
      }
    }
    // properties: {
    //   url: {
    //     type: 'string',
    //     description: `url to perform the request,
    //     e.g. http://localhost:3000/ to get the list of containers`
    //     // description: `url to perform the request,
    //     //  e.g. http://localhost:3000/ to get the list of containers,
    //     //  or http://localhost:3000/personnages/ to get a container and a list of resources,
    //     //  or http://localhost:3000/personnages/BioThek to get a resources.
    //     //  Containers end with '/'.
    //     //  Get the list of personnages at http://localhost:3000/personnages/,
    //     //  get the list of lieux at http://localhost:3000/lieux/ ,
    //     //  get the list of objets at http://localhost:3000/objets/,
    //     //  !!! get the list of containers at http://localhost:3000/ when you are lost !!!`
    //   },
    //   payload: {
    //     type: 'object',
    //     description: `(optional) payload in jsonld format to send with the request to create or patch a resource,
    //     with a '@id' key identical to the url of the resource.`
    //   },
    //   method: {
    //     type: 'string',
    //     description:
    //       '(optional) method to send with the request (e.g. GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS), default is GET'
    //   }
    // }
  },
  async handler(
    params = { url: 'http://localhost:3000/', method: 'GET', data: '{}', contentType: '' }
  ) {
    try {
      if (params.method == 'GET' || params.method == 'HEAD' || params.method == 'OPTIONS') {
        const response = await fetch(params.url)
        if (response.ok) {
          return response.text()
        } else {
          return `Error fetching ${params.url}: ${response.statusText}, check the root directory http://localhost:3000/ to find the good container`
        }
      } else {
        let options = {
          method: params.method,
          // headers: {
          //   // Accept: 'application/ld+json',
          //   'Content-Type': 'application/ld+json'
          // },
          body: params.data
        }

        if (params.contentType) {
          options.headers = {
            'Content-Type': params.contentType
          }
        }

        const response = await fetch(params.url, options)
        if (response.ok) {
          let resp = await response.text()
          console.log(resp)
          return resp
        } else {
          return `Error fetching ${params.url}: ${response.statusText}, check the root directory http://localhost:3000/ to find the good container`
        }
      }
    } catch (error) {
      console.error(error)
      return {
        status: 'ko',
        code: error.status,
        error: error.message,
        err: error,
        url: params.url,
        payload: params.payload,
        method: params.method
      }
    }
  }
})
