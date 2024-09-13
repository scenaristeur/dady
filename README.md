# dady

![dady_demo](doc/dady_demo.png)

## use it with solid community server

- https://communitysolidserver.github.io/CommunitySolidServer/latest/

```
npx @solid/community-server
```

## axios http verbs

- https://github.com/axios/axios#request-config

### axios delete

- https://github.com/axios/axios?tab=readme-ov-file#request-method-aliases

axios.delete(URL, {
headers: {
Authorization: authorizationToken
},
data: {
source: source
}
});

# function calling

- https://microsoft.github.io/autogen/docs/notebooks/agentchat_function_call_code_writing/
- https://stephenwalther.com/calling-custom-functions-with-chatgpt/
- node-llama-cpp https://github.com/withcatai/node-llama-cpp/pull/139
- llama-cpp-python function calling https://llama-cpp-python.readthedocs.io/en/stable/#function-calling -> "chatml-function-calling" chat format
- OpenAI cookbook call functions https://github.com/openai/openai-cookbook/blob/main/examples/How_to_call_functions_with_chat_models.ipynb
- list of functions https://huggingface.co/datasets/Locutusque/function-calling-chatml

# function calling with local LLM

- https://microsoft.github.io/autogen/blog/2023/07/14/Local-LLMs/

# js mimetype

application/javascript https://www.rfc-editor.org/rfc/rfc4329.txt

# TODO POST ne créé pas les folder mais PUT oui

- https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/metadata/#impact-on-creating-containers

# contextMenu /right click

- https://itnext.io/how-to-create-a-custom-right-click-menu-with-javascript-9c368bb58724

# autogen

```
cd llm
python solid_llm_functions.py
```

# MemGPT

- https://memgpt.readme.io/docs/contributing_code#installing-dependencies-with-pip

```
sudo apt install python3.11
git clone https://github.com/cpacker/MemGPT.git
cd MemGPT
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
memgpt run
```

--> bdd error
--> in another terminal

(see MemGPT/bdd/Dockerfile.simple)

```
cd MemGPT
docker build -t memgpt-db -f db/Dockerfile.simple .

// first run

 docker run -d --rm \
   --name memgpt-db \
   -p 5432:5432 \
   -e POSTGRES_PASSWORD=password \
   -v memgpt_db:/var/lib/postgresql/data \
   memgpt-db:latest


```

then `memGPT run` should work

```
 After the first time, you do not need the POSTGRES_PASSWORD.
 docker run -d --rm \
   --name memgpt-db \
   -p 5432:5432 \
   -v memgpt_db:/var/lib/postgresql/data \
   memgpt-db:latest

```

```
memgpt configure
? Select LLM inference provider: local
? Select LLM backend (select 'openai' if you have an OpenAI compatible proxy): groq
? Enter default endpoint: https://api.groq.com/openai
? Enter your Groq API key: ********************************************************
? Select default model: llama3-8b-8192
? Select default model wrapper (recommended: chatml): chatml
? Select your model's context window (for Mistral 7B models, this is probably 8k / 8192): 8192
? Select embedding provider: hugging-face
? Enter default endpoint: https://embeddings.memgpt.ai
? Enter HuggingFace model tag (e.g. BAAI/bge-large-en-v1.5): BAAI/bge-large-en-v1.5
? Enter embedding model dimentions (e.g. 1024): 1024
? Select storage backend for archival data: postgres
? Enter postgres connection string (e.g. postgresql+pg8000://{user}:{password}@{ip}:5432/{database}): postgresql+pg8000://memgpt:memgpt@127.0.0.1:
5432/memgpt
? Select storage backend for recall data: postgres
? Enter postgres connection string (e.g. postgresql+pg8000://{user}:{password}@{ip}:5432/{database}): postgresql+pg8000://memgpt:memgpt@127.0.0.1:
5432/memgpt
```

# redo

- npm create vue@latest

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

```async could_be_helpfull_query_to_local_website() {
    try {
      const response = await axios.get('/user', {
        params: {
          ID: 12345
        }
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
```

`
