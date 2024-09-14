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
    "cache_seed": 38,  # seed for caching and reproducibility
}
# compagnon = autogen.AssistantAgent(
#     name="compagnon",
#     system_message="""For coding tasks,
#       only use the functions you have been provided with.
#       For query to Solid Server tasks, only use the functions you have been provided with.
#        Reply TERMINATE when the task is done.""",
#     llm_config=llm_config,
# )

compagnon = autogen.AssistantAgent(
    name="compagnon",
    system_message="""Tu es un assistant explorateur,
      Utilise les fonctions GET pour obtenir des informations et PUT pour mettre à jour des informations.
      Tu as accès à un serveur à l'adresse http://localhost:3000/ qui comprend les requetes GET et PUT.
      Les urls/uri des containers (ou folder, ou dossiers) se terminent toujours par '/'.
      Nous sommes dans un jeux d'exploration et tu dois aider l'utilisateur a trouver le bon contenu,
      ou à metrre à jour des informations. 
      N'invente surtout pas d'informations, ne répond qu'avec celles que tu trouves sur le serveur http://localhost:3000/ . 
      For query to Solid Server tasks, only use the functions you have been provided with.
       Reply TERMINATE (en anglais, sans traduire et non terminé en français)when the task is done.""",
    llm_config=llm_config,
)

# create a UserProxyAgent instance named "user_proxy"
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    is_termination_msg=lambda x: x.get("content", "") and x.get(
        "content", "").rstrip().endswith("TERMINATE"),
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
)


@user_proxy.register_for_execution()
@compagnon.register_for_llm(description="GET")
def get(url: Annotated[str, "Valid url, ends with '/' for containers."] = "http://localhost:3000/") -> str:
    try:
        headers = {"Content-Type": "text/plain"}
        r = requests.get(url, headers=headers)
        return json.dumps({"response": r.text})
    except:
        return json.dumps({"error": "ERROR"})


@user_proxy.register_for_execution()
@compagnon.register_for_llm(description="PUT")
def put(url: Annotated[str, "Valid url, ends with '/' for containers."] = "http://localhost:3000/", body={}) -> str:
    try:
        headers = {"Content-Type": "apploication/ld+json"}
        r = requests.put(url, data=body, headers=headers)
        return json.dumps({"response": r.text})
    except:
        return json.dumps({"error": "ERROR"})


with Cache.disk() as cache:
    # start the conversation
    user_proxy.initiate_chat(
        compagnon,
        message="""
        Nous devons explorer un nouveau monde sur http://localhost:3000/
        Quelles sont les containers et ressources disponibles ?
        Tu dois explorer les ressources comme un jeux de piste, chaque ressource peut avoir des liens vers les autres.
        Dans le container personnages, Qui est la petite amie de BioThek ?
          """,
        cache=cache,
    )
