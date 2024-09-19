# https://microsoft.github.io/autogen/docs/notebooks/agentchat_society_of_mind/


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
    "cache_seed": 358,  # seed for caching and reproducibility
}


assistant = autogen.AssistantAgent(
    "inner-assistant",
    llm_config=llm_config,
    is_termination_msg=lambda x: x.get("content", "").find("TERMINATE") >= 0,
)

code_interpreter = autogen.UserProxyAgent(
    "inner-code-interpreter",
    human_input_mode="NEVER",
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    },
    default_auto_reply="",
    is_termination_msg=lambda x: x.get("content", "").find("TERMINATE") >= 0,
)

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

user_proxy = autogen.UserProxyAgent(
    "user_proxy",
    human_input_mode="TERMINATE",
    code_execution_config=False,
    default_auto_reply="",
    is_termination_msg=lambda x: True,
)


# @user_proxy.register_for_execution()
@compagnon.register_for_llm(description="get")
def get(url: Annotated[str, "Valid url, ends with '/' for containers."] = "http://localhost:3000/") -> str:
    """ Useful for getting http://localhost:3000/,
    containers like http://localhost:3000/personnages/
    or resources like http://localhost:3000/personnages/Biothek 
    différences between http://localhost:3000/personnages/ 
    and http://localhost:3000/personnages/Biothek
    is that containers urls end with '/' and resources urls don't
    """

    try:
        headers = {"Content-Type": "text/plain",
                   "Accept": "application/ld+json"}
        r = requests.get(url, headers=headers)
        return json.dumps({"response": r.text})
    except:
        return json.dumps({"error": "ERROR"})


# @user_proxy.register_for_execution()
@compagnon.register_for_llm(description="put")
def put(url: Annotated[str, "Valid url, ends with '/' for containers."] = "http://localhost:3000/", body={}) -> str:
    try:
        headers = {"Content-Type": "application/ld+json"}
        r = requests.put(url, data=body, headers=headers)
        return json.dumps({"response": r.text})
    except:
        return json.dumps({"error": "ERROR"})


groupchat = autogen.GroupChat(
    agents=[assistant, code_interpreter, compagnon],
    messages=[],
    # round_robin : With two agents, this is equivalent to a 1:1 conversation.
    speaker_selection_method="auto",
    allow_repeat_speaker=False,
    max_round=8,
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    is_termination_msg=lambda x: x.get("content", "").find("TERMINATE") >= 0,
    llm_config=llm_config,
)

from autogen.agentchat.contrib.society_of_mind_agent import SocietyOfMindAgent  # noqa: E402

task = """Quels containers et ressources avons-nous sur http://localhost:3000/ ?
Qui est la petite amie de Biothek ?"""

society_of_mind_agent = SocietyOfMindAgent(
    "society_of_mind",
    chat_manager=manager,
    llm_config=llm_config,
)


user_proxy.initiate_chat(society_of_mind_agent, message=task)
