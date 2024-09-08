import { Dady } from '@/lib/dady.js'

const state = () => ({
  dady: new Dady({ name: 'Daddy' }),
  message: null,
  params: { baseURL: 'http://localhost:3000', headers: {} },
  resource: { content: '' }
})

const mutations = {
  // setMessage(state, message) {
  //   state.message = message
  // },
  setParams(state, params) {
    state.params = params
  },
  setResource(state, resource) {
    state.resource = resource
  }
}

const actions = {
  logDady(context) {
    context.state.dady.log()
  },
  async create_or_update(context) {
    let query = { params: context.state.params, resource: context.state.resource }
    console.log('create_or_update', query)
    let result = await context.state.dady.create_or_update(query)
    console.log(result)
    context.state.message = result
    // switch (result.status) {
    //   case 201:
    //     context.state.message = {status: result.status,

    //     }
    //     break;

    //   default:
    //     console.log("result non traité",result)
    // }
    // return contexte.state.message
  },
  async select(context, id) {
    console.log('select', id)
    context.state.message = await context.state.dady.get(id)
    //console.log('MESSAGE FROM SELECT', context.state.message)
    // return context.state.message
  },
  async remove(context, id) {
    console.log('remove', id)
    context.state.message = await context.state.dady.remove(id)
    console.log('MESSAGE FROM remove', context.state.message)
    // return context.state.message
  }

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
