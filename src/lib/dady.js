import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

export class Dady {
  constructor({ name = 'inconnu' }) {
    this.name = name
    // this.callbacks = callbacks
    // console.log("store", store)
    //handleAction("one")
    this.id = uuidv4()
    //   this.listening = []
    //   this.awareness = null
    //   this.connect()
  }

  log() {
    console.log(this.id, this.name)
    console.log(this)
    const target_copy = Object.assign({}, this) // https://stackoverflow.com/questions/51096547/how-to-get-the-target-of-a-javascript-proxy
    console.log(target_copy)
    //   console.log(
    //     '#####todos doing done#####',
    //     Array.from(todos.keys()).length,
    //     Array.from(prepared.keys()).length,
    //     Array.from(doing.keys()).length,
    //     Array.from(done.keys()).length
    //   )
  }

  async create_or_update(query) {
    query.resource.content = query.resource.content.trim()
    console.log(axios.isCancel('something'))
    let headers = query.params.headers
    let result = 'Inconnu'

    let config = {
      baseURL: query.params.base_url,
      url: query.params.url,
      method: query.params.method,
      headers: headers,
      responseType: 'json',
      data: query.resource.content
    }
    console.log(config)
    try {
      const response = await axios(config)

      console.log(response)
      result = {
        state: 'ok',
        query: query,
        message: response,
        location: response.headers.location,
        notification: response.headers.link
      }
    } catch (error) {
      result = { state: 'error', query: query, message: error }
      console.error(error)
    }

    console.log('create_or_update', query, Object.assign({}, result))
    return Object.assign({}, result)
  }

  // await axios
  // .get(
  //   context.state.memgpt_api_url + 'admin/users?limit=50',
  //   bodyParameters,
  //   context.state.memgpt_api_headers
  // )
  // .then((response) => {
  //   console.log('response', response)
  //   context.commit('setAgents', response.data)
  // })
  // .catch((error) => {
  //   console.log('error', error)
  // })
  // await axios
  // .post(
  //   context.state.memgpt_api_url + 'agents',
  //   bodyParameters,
  //   context.state.memgpt_api_headers
  // )
  // .then((response) => {
  //   console.log('response', response)
  //   context.commit('setAgents', response.data)
  // })
  // .catch((error) => {
  //   console.log('error', error)
  // })
}
