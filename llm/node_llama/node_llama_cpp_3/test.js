import axios from 'axios'

async function test(params) {
  try {
    const response = await axios.get(params.url, {
      // params: {
      //   ID: 12345
      // }
    })
    console.log(response)
    return { status: 'ok cool', response: response.data }
  } catch (err) {
    // console.error(error)
    return { status: 'ko', code: err.status, error: err.message }
  }
}

let result = await test({ url: 'http://localhost:3000/personnsages/' })
console.log('RESULT', result)
