# use it with igora-reloaded local llm

- https://github.com/scenaristeur/igora-reloaded/tree/main

or

```
python3 -m llama_cpp.server --model ./models/llama-pro-8b-instruct.Q2_K.gguf --port 5677 --host 0.0.0.0
```

```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt


python solid_llm_functions.py
```

- groq tools use https://console.groq.com/docs/tool-use
