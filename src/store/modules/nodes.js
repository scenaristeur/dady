// import { Dady } from '@/lib/dady.js'

const state = () => ({
  modele: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      ve: 'https://scenaristeur.github.io/verse#',
      id: '@id',
      type: '@type'
    },
    've:name': '',
    've:age': 0,
    've:privacy': 'private',
    've:type': 'node',
    've:properties': [],
    test: 'test vocab'
  },
  currentNode: null
})

const mutations = {
  // reset(state) {

  newNode(state) {
    state.currentNode = Object.assign({}, state.modele) // state.modele
  },
  setCurrentNode(state, node) {
    state.currentNode = node
    console.log('currentNode', state.currentNode)
  }
  // setResource(state, resource) {
  //   state.resource = resource
  // }
}

const actions = {
  async saveNode({ dispatch, commit }, node) {
    try {
      let params = { baseURL: 'http://localhost:3000/', method: 'PUT', headers: {} }
      console.log('saving', Object.assign({}, node))
      let filename = Date.now()
      if (node['@id'] != undefined) {
        filename = node['@id'].replace('http://localhost:3000/', '')
      } else {
        filename = params.baseURL + node['ve:name']
        node['@id'] = filename
      }
      params.url = filename
      console.log(filename)

      console.log(node)
      let resource = { content: JSON.stringify(node, null, 2) }
      console.log(params, resource)

      params.headers['Content-Type'] = 'application/ld+json'

      // call action from another module https://stackoverflow.com/questions/54378118/vuex-dispatch-action-in-a-different-module-from-an-action
      commit('core/setParams', params, { root: true })
      commit('core/setResource', resource, { root: true })
      await dispatch('core/create_or_update', null, { root: true })

      return 'ok'
    } catch (e) {
      console.log(e)
      return 'error'
    }
  }
  // async create_or_update(context) {
  //   let query = { params: context.state.params, resource: context.state.resource }
  //   console.log('create_or_update', query)
  //   try {
  //     let result = await context.state.dady.create_or_update(query)
  //     console.log(result)
  //     context.state.message = result
  //     switch (result.status) {
  //       case 200:
  //         if (result.headers['content-type'] && result.headers['content-type'].endsWith('json')) {
  //           context.state.resource.content = JSON.stringify(result.data, null, 2)
  //         } else {
  //           context.state.resource.content = result.data
  //         }

  //         if (
  //           Array.isArray(result.data) &&
  //           result.data[0]['@type'].includes('http://www.w3.org/ns/ldp#Container')
  //         ) {
  //           context.state.container = result.data[0]
  //           console.log('container', Object.assign({}, context.state.container))
  //         }

  //         break

  //       default:
  //     }
  //   } catch (error) {
  //     context.state.message = error
  //   }

  //   // return contexte.state.message
  // },
  //   async create_container(context) {
  // https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/metadata/#example-of-a-workflow-for-editing-a-description-resource
  //     console.log('create_container')
  //     context.state.params.method = 'HEAD'
  //     // let baseURL = context.state.params.baseURL
  //     let container_url = context.state.params.url
  //     context.state.params.url = ''
  //     await context.dispatch('create_or_update')
  //     console.log(container_url, context.state.params, context.state.resource, context.state.message)
  //     console.log('message', Object.assign({}, context.state.message))
  //     let link = context.state.message.headers.link
  //     console.log('link', link)
  //     let links = context.state.dady.parse_link_header(link)
  //     console.log(links)
  //     let meta = links.describedby
  //     console.log(meta)
  //     let url = new URL(meta)
  //     let baseURL = url.origin + '/'
  //     let meta_pathname = url.pathname
  //     console.log(baseURL, meta_pathname)
  //     context.state.params.method = 'PATCH'
  //     context.state.params.url = '/foo/.meta' //meta_pathname
  //     context.state.params.headers['Content-Type'] = 'text/n3'
  //     // context.state.resource.content = `
  //     // @prefix solid: <http://www.w3.org/ns/solid/terms#>.
  //     // <> a solid:InsertDeletePatch;
  //     // solid:inserts {
  //     //  <${baseURL}> <http://www.w3.org/ns/ldp#contains> <${baseURL}${container_url}>. }.`
  //     context.state.resource.content = `@prefix solid: <http://www.w3.org/ns/solid/terms#>.
  // <> a solid:InsertDeletePatch;
  // solid:inserts {
  // <http://localhost:3000/foo/> <http://www.w3.org/ns/ldp#inbox> <http://localhost:3000/inbox/>.
  // <http://localhost:3000/foo/> <http://www.w3.org/ns/ldp#contains> <http://localhost:3000/foo/truc/>.
  // }.`
  //     await context.dispatch('create_or_update')
  //   },
  // async select(context, id) {
  //   let url = new URL(id)
  //   console.log(url)
  //   context.state.resource.content = ''
  //   context.state.params.baseURL = url.origin
  //   context.state.params.method = 'GET'
  //   context.state.params.url = url.pathname
  //   context.state.params.headers = {}

  //   if (url.pathname.endsWith('/')) {
  //     context.state.params.headers.Accept = 'application/ld+json'
  //   }

  //   console.log('select', context.state.params, context.state.resource)

  //   await context.dispatch('create_or_update') // create_or_update()
  //   console.log('MESSAGE FROM SELECT', context.state.message)
  //   context.state.params.method = 'PUT'
  //   // return context.state.message
  // },
  // async remove(context, id) {
  //   console.log('remove', id)
  //   context.state.message = await context.state.dady.remove(id)
  //   console.log('MESSAGE FROM remove', context.state.message)
  //   // return context.state.message
  // }

  // async auth(context) {
  //   // state.memgpt_api_headers.Authorization = 'Bearer ' + state.password
  //   // console.log(state.memgpt_api_headers)
  //   // state.memgpt_api_headers['Content-Type'] = 'application/json'
  //   const bodyParameters = {
  //     password: 'ilovellms'
  //   }
  //   await axios
  //     .post(
  //       context.state.memgpt_api_url + 'api/auth',
  //       bodyParameters,
  //       context.state.memgpt_api_headers
  //     )
  //     .then((response) => {
  //       console.log('response', response)
  //       context.state.auth = response.data
  //       // context.commit('setAgents', response.data)
  //     })
  //     .catch((error) => {
  //       console.log('error', error)
  //       context.state.auth = null
  //     })
  //},
  // async listAgents(context /*data*/) {
  //   // console.log(data)
  //   //   sdk.auth(context.state.password)
  //   //   sdk.server(context.state.memgpt_api_url)
  //   //   sdk
  //   //     .list_agents_api_agents_get()
  //   //     .then(({ data }) => {
  //   //       console.log(data)
  //   //       context.commit('core/setAgents', data)
  //   //     })
  //   //     .catch((err) => console.error(err))
  //   // }
  //   console.log('list')
  //   //     curl --request POST \
  //   //      --url http://localhost:8283/api/auth \
  //   //      --header 'accept: application/json' \
  //   //      --header 'content-type: application/json' \
  //   //      --data '
  //   // {
  //   //   "password": "string"
  //   // }
  //   // '
  //   const bodyParameters = {
  //     password: 'ilovellms'
  //   }
  //   await axios
  //     .get(
  //       context.state.memgpt_api_url + 'admin/users?limit=50',
  //       bodyParameters,
  //       context.state.memgpt_api_headers
  //     )
  //     .then((response) => {
  //       console.log('response', response)
  //       context.commit('setAgents', response.data)
  //     })
  //     .catch((error) => {
  //       console.log('error', error)
  //     })
  //   // await axios
  //   // .post(
  //   //   context.state.memgpt_api_url + 'agents',
  //   //   bodyParameters,
  //   //   context.state.memgpt_api_headers
  //   // )
  //   // .then((response) => {
  //   //   console.log('response', response)
  //   //   context.commit('setAgents', response.data)
  //   // })
  //   // .catch((error) => {
  //   //   console.log('error', error)
  //   // })
  //   // .post(context.state.server_url + '/embedAndSim', {
  //   //   query
  //   // })
  //   // .then((response) => {
  //   //   console.log('response', response)
  //   //   context.commit('setResponse', response.data)
  //   //   // this.messages.push({
  //   //   //   role: 'assistant',
  //   //   //   content: response.data, // Access the 'data' property of the response object
  //   //   // });
  //   //   //console.log(this.context.state.allEmbeds)
  //   // })
  // }
  //   async embedGraph(context, input) {
  //     //let documents = [input]
  //     let uid = context.state.uid
  //     if (uid == undefined) {
  //       uid = uuidv4()
  //       context.commit('setUid', uid)
  //     }
  //     let query = {
  //       rid: uuidv4(),
  //       uid: uid,
  //       documents: input
  //     }
  //     await axios
  //       .post(context.state.server_url+"/embedAndSim", {
  //         query
  //       })
  //       .then((response) => {
  //         console.log('response', response)
  //         context.commit('setResponse', response.data)
  //         // this.messages.push({
  //         //   role: 'assistant',
  //         //   content: response.data, // Access the 'data' property of the response object
  //         // });
  //         //console.log(this.context.state.allEmbeds)
  //       })
  //   }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
