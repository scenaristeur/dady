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
