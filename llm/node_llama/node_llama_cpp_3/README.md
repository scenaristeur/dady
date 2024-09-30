https://github.com/withcatai/node-llama-cpp/pull/105

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

#

✔ Bonjour, que puis-je faire pour toi, aujourd'hui ? créé un rdv dans events, basé sur activity streams: Yoga à 18h
lundi, parc Blandan, participants : BioThek et Anne But (dans personnages)
User: créé un rdv dans events, basé sur activity streams: Yoga à 18h lundi, parc Blandan, participants : BioThek et Anne But (dans personnages)

créé un rdv dans events: "Cerf Volant" à 17h lundi, parc Blandan, participants : BioThek et Anne But (dans personnages)

# llama 3.2-1B-Instruct Q4_K_M.gguf

https://huggingface.co/mradermacher/Llama-3.2-1B-Instruct-GGUF/tree/main
