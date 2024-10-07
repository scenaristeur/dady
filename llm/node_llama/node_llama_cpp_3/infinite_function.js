import { fileURLToPath } from "url";
import path from "path";
import { getLlama, defineChatSessionFunction, LlamaChatSession } from "node-llama-cpp";
import inquirer from 'inquirer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const llama = await getLlama();
const model = await llama.loadModel({
  // modelPath: path.join(__dirname, "../../../../igora/models", "llama-pro-8b-instruct.Q2_K.gguf")
  // modelPath: path.join(__dirname, "../../../../igora/models", "Meta-Llama-3-8B.Q2_K.gguf")
  // modelPath: path.join(__dirname, "../../../../igora/models", "dolphin-2.2.1-mistral-7b.Q2_K.gguf")
  // modelPath: path.join(__dirname, "../../../../igora/models", "albertlight-7b.Q2_K.gguf")
  modelPath: path.join(
    __dirname,
    '../../../../igora/models',
    'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf'
  )
});
const context = await model.createContext();
const functions = {
  getDate: defineChatSessionFunction({
    description: "Retrieve the current date",
    handler() {
      return new Date().toLocaleDateString();
    }
  }),
  getNthWord: defineChatSessionFunction({
    description: "Get an n-th word",
    params: {
      type: "object",
      properties: {
        n: {
          enum: [1, 2, 3, 4]
        }
      }
    },
    handler(params) {
      return ["very", "secret", "this", "hello"][params.n - 1];
    }
  }),
  httpRequest: defineChatSessionFunction({
    description: "perform an http request (GET, POST, PUT, DELETE,...)",
    params: {
      type: "object",
      properties: {
        url: "url"
      }
    },
    handler(params) {

      try {
        const response = axios.get(params.url, {
          // params: {
          //   ID: 12345
          // }
        })
        // console.log(response)
        return {"status": "ok cool", response:response}
      } catch (error) {
        // console.error(error)
        return {"status": "ko", error: error}
      }

    }
  }),
};
const session = new LlamaChatSession({
  contextSequence: context.getSequence()
});


// const q1 = "What is the second word?";
// console.log("User: " + q1);

// const a1 = await session.prompt(q1, {functions});
// console.log("AI: " + a1);


// const q2 = "What is the date? Also tell me the word I previously asked for";
// console.log("User: " + q2);

// const a2 = await session.prompt(q2, {functions});
// console.log("AI: " + a2);




function infinite_run() {
  let user_input = null
  let ia_message = "Bonjour, que puis-je faire pour toi, aujourd'hui?"

  const discuss = async () => {

    inquirer.prompt([{ name: "user_input", message: ia_message }]).then(async (response) => {
      console.log("user_input", response, response.user_input)


      if (response.user_input == "exit") {
        console.log("tape 'exit' pour sortir")
        return 0

      } else {
        const q1 = response.user_input;
        console.log("User: " + q1);

        const a1 = await session.prompt(q1, { functions });
        console.log("AI: " + a1);
        ia_message = a1
        console.log("tape 'exit' pour sortir")
        discuss()
      }
    })
  }

  discuss()


}

infinite_run()


