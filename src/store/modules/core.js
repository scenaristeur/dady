// import { User } from '@/lib/user.js';
// import sdk from '@api/memgpt'
// import axios from 'axios'
import { Dady } from '@/lib/dady.js'

const state = () => ({
  dady: new Dady({ name: 'Daddy' }),
  message: 'Welcome! Use Dady with https://communitysolidserver.github.io/CommunitySolidServer'
  // password: 'ilovellms',
  // memgpt_api_url: 'http://localhost:8283/',
  // memgpt_api_headers: {
  //   Accept: 'application/json',
  //   // Authorization: 'Bearer ilovellms',
  //   'Content-Type': 'application/json'
  // },
  // auth: null,
  // agents: []
  // user: new User({
  //   name: "Youri l'UI"
  //   // , callbacks:{
  //   //   awarenessChanged: mutations.test
  //   // }
  // }),
  // awareness: null,
  // agents: null,
  // messages: [
  //   // { id: 1, role: "user", content: "Bonjour" },
  //   // { id: 2, role: "assistant", content: "Bonjour, comment puis-je vous aider aujourd'hui ?" }
  // ]
})

const mutations = {
  // setPassword(state, password) {
  //   state.password = password
  // },
  // setMemgptApiUrl(state, memgpt_api_url) {
  //   state.memgpt_api_url = memgpt_api_url
  // },
  //   setAgents(state, agents) {
  //     console.log("agents", agents.length)
  // state.agents = agents
  //   },
  // listAgents(state) {
  //   sdk.auth(state.password)
  //   sdk.server(state.memgpt_api_url)
  //   sdk
  //     .list_agents_api_agents_get()
  //     .then(({ data }) => {
  //       console.log(data)
  //       this.commit('core/setAgents', data)
  //     })
  //     .catch((err) => console.error(err))
  //   // // state.agents = [...agents]
  //   // // console.log(state.agents)
  //   // this.commit('core/setAgents', agents)
  // },
  // setAgents(state, a) {
  //   state.agents = a
  //   console.log(state.agents)
  // }
}

const actions = {
  logDady(context) {
    context.state.dady.log()
  },
  async create_or_update(contexte, query) {
    contexte.state.message = await contexte.state.dady.create_or_update(query)
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
