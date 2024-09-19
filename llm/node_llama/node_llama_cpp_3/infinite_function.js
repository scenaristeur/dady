import { fileURLToPath } from "url";
import path from "path";
import { getLlama, defineChatSessionFunction, LlamaChatSession } from "node-llama-cpp";
import inquirer from 'inquirer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

var phonetic_alphabet = ["ALPHA", "BRAVO", "CHARLIE", "DELTA", "ECHO", "FOXTROT", "GOLF", "HOTEL", "INDIA", "JULIET", "KILO", "LIMA", "MIKE", "NOVEMBER", "OSCAR", "PAPA", "QUEBEC", "ROMEO", "SIERRA", "TANGO", "UNIFORM", "VICTOR", "WHISKEY", "XRAY", "YANKEE", "ZULU"];

const llama = await getLlama();
const model = await llama.loadModel({
  modelPath: path.join(__dirname, "../../../../igora/models", "llama-pro-8b-instruct.Q2_K.gguf")
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
    description: "perform an http request (GET, POST, PUT, DELETE,...), you must provide options.url",
    params: {
      type: "object",
      properties: {
        url: "text"
      }
    },
    handler(options) {
      return
      try {
        const response = axios.get(options.url, {
          // params: {
          //   ID: 12345
          // }
        })
        console.log(response)
        return response
      } catch (error) {
        console.error(error)
        return error
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


