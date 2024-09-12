# https://github.com/microsoft/autogen/blob/212722cd45ac528f232d6e41b2112b040aa1844a/notebook/agentchat_function_call.ipynb

from IPython import get_ipython
from typing_extensions import Annotated, Optional

import autogen
from autogen.cache import Cache
import requests
import json


config_list = autogen.config_list_from_json(
    env_or_file="OAI_CONFIG_LIST",
    filter_dict={
        "model": {
            "llama3-8b-8192",
            # "llama3-groq-70b-8192-tool-use-preview", # for functions and tools
            # "gpt-4",
            # "gpt4",
            # "gpt-4-32k",
            # "gpt-4-32k-0314",
            # "gpt-4-32k-v0314",
            # "gpt-3.5-turbo",
            # "gpt-3.5-turbo-16k",
            # "gpt-3.5-turbo-0301",
            # "chatgpt-35-turbo-0301",
            # "gpt-35-turbo-v0301",
            # "gpt",
        }
    })


llm_config = {
    "config_list": config_list,
    "timeout": 120,
    "cache_seed": 40,  # seed for caching and reproducibility
}
chatbot = autogen.AssistantAgent(
    name="chatbot",
    system_message="""For coding tasks,
      only use the functions you have been provided with.
      For query to Solid Server tasks, only use the functions you have been provided with.
       Reply TERMINATE when the task is done.""",
    llm_config=llm_config,
)

# create a UserProxyAgent instance named "user_proxy"
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    is_termination_msg=lambda x: x.get("content", "") and x.get(
        "content", "").rstrip().endswith("TERMINATE"),
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    },  # Please set use_docker=True if docker is available to run the generated code. Using docker is safer than running the generated code directly.
)


@user_proxy.register_for_execution()
@chatbot.register_for_llm(description="GET")
def get(url: Annotated[str, "Valid url."] = "http://localhost:3000") -> str:
    try:
        headers = {"Content-Type": "text/plain"}
        r = requests.get(url, headers=headers)
        return json.dumps({"response": r.text})
    except:
        return json.dumps({"error": "ERROR"})


@user_proxy.register_for_execution()
@chatbot.register_for_llm(description="PUT")
def put(url: Annotated[str, "Valid url."] = "http://localhost:3000", body={}) -> str:
    try:
        headers = {"Content-Type": "apploication/ld+json"}
        r = requests.put(url, data=body, headers=headers)
        return json.dumps({"response": r.text})
    except:
        return json.dumps({"error": "ERROR"})


with Cache.disk() as cache:
    # start the conversation
    user_proxy.initiate_chat(
        chatbot,
        message="""Tu es un assistant Solid et un expert en Web semantique.
        les urls pour les requêtes vers les containers doivent se terminer par '/'.
          utilise les fonctions GET(url) pour recupérer les infos, et PUT(url,body) pour créer des resources sur le Solid server
           disponibleà l'dresse http://localhost:3000/ et fournis les resultats.
          Que peux-tu me dire sur  le serveur Solid http://localhost:3000 ?
          """,

        cache=cache,
    )
