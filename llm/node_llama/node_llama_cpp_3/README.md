https://github.com/withcatai/node-llama-cpp/pull/105

```nvm use 20```


```
# run Solid community server
 npx @solid/community-server

# init data
../ & npm run dev
# click init cdr data

# run llm against solid community server
node solid_fetch.js```

# download model
- https://huggingface.co/mradermacher/Meta-Llama-3.1-8B-Instruct-GGUF/blob/main/Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf

- function calling chat session https://github.com/withcatai/node-llama-cpp/issues/101

```
node maths_function.js
Loading model...
ggml_vulkan: Found 1 Vulkan devices:
Vulkan0: AMD Unknown (RADV RENOIR) (radv) | uma: 1 | fp16: 1 | warp size: 64
Creating context...

User: Can you try to retrieve a list of the containers at http://localhost:3000/ and find who is BioThek fiancée?
AI: The list of containers at http://localhost:3000/ includes index.html, personnages/, lieux/, and objets/. BioThek's fiancée is Anne_Prop.
Consolidated AI answer: The list of containers at http://localhost:3000/ includes index.html, personnages/, lieux/, and objets/. BioThek's fiancée is Anne_Prop.

```

# chat cli model

dans node_modules/node-llama-cpp/llama.cpp/dist/cli/ChatCommand.js
