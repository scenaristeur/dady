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

# llama 3.1 functions
python3 -m llama_cpp.server --model ./models/Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf --port 5677 --host 0.0.0.0



# How to add chat history

- https://js.langchain.com/docs/how_to/qa_chat_history_how_to/

- rag https://js.langchain.com/docs/tutorials/rag/

# langchain local model
- https://github.com/langchain-ai/langchainjs/issues/3573



# ollama setup
- https://js.langchain.com/docs/integrations/llms/ollama/#setup