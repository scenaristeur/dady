# first launch igora-reloaded backend

```
# clone scenaristeur/igora-reloaded
cd igora-reloaded/
cd backEndTest/
. .venv/bin/activate
python3 -m llama_cpp.server --model ./models/Llama-3.2-1B-Instruct.i1-Q4_K_M.gguf --port 5677 --host 0.0.0.0
```

# llama 3.2 sans fonctions

python3 -m llama_cpp.server --model ./models/Llama-3.2-1B-Instruct.i1-Q4_K_M.gguf --port 5677 --host 0.0.0.0

-> python3 -m llama_cpp.server --model ./models/Llama-3.2-1B-Instruct.Q4_K_M.gguf --port 5677 --host 0.0.0.0

# llama 3.1 functions

/bartowski/
python3 -m llama_cpp.server --model ./models/Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf --port 5677 --host 0.0.0.0

# How to add chat history

- https://js.langchain.com/docs/how_to/qa_chat_history_how_to/

- rag https://js.langchain.com/docs/tutorials/rag/

# langchain local model

- https://github.com/langchain-ai/langchainjs/issues/3573

# ollama setup

- https://js.langchain.com/docs/integrations/llms/ollama/#setup

# interessant

- https://www.together.ai/pricing

# multi-agents

- https://langchain-ai.github.io/langgraphjs/concepts/multi_agent/?h=multi#supervisor
- https://github.com/langchain-ai/langgraphjs/tree/main/examples/multi_agent

# AgentOps dashboard

- https://agencyagentops.notion.site/AgentOps-and-Agency-AI-CrewAI-Guide-9318e41cbb4d49cab8fb91dba2b1d18a

# multi model

- https://jina.ai/reader/

# instance based learning

- when search for llm and ipfs
- https://www.reddit.com/r/ipfs/comments/15tc0ry/comment/jxoi5mt/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
- https://www.google.com/search?client=firefox-b-lm&q=instance-based+learning

# ipfs datastore chatmemory langchain

- https://js.langchain.com/docs/integrations/memory/ipfs_datastore/
  -nextjs on ipfs https://dev.to/amlana24/how-to-deploy-a-next-js-app-on-ipfs-interplanetary-file-system-and-automate-using-fleek-lf8
  - https://github.com/ipfs-shipyard/ipfs-blob-store
