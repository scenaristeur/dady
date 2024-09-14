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


# define functions according to the function description

# one way of registering functions is to use the register_for_llm and register_for_execution decorators
# @user_proxy.register_for_execution()
# @chatbot.register_for_llm(name="GET", description="run a get query to a server and return the result.")
# def get(url="http://localhost:3000") -> str:
#     try:
#         # url = 'https://api.github.com/some/endpoint'

#         headers = {"Content-Type": "text/plain"}
#         r = requests.get(url, headers=headers)
#         return json.dumps(r.json())
#     except:
#         return json.dumps({"error": "ERROR"})

# r = requests.get('https://api.github.com/user', auth=('user', 'pass'))


# one way of registering functions is to use the register_for_llm and register_for_execution decorators
# @user_proxy.register_for_execution()
# @chatbot.register_for_llm(name="python", description="run cell in ipython and return the execution result.")
# def exec_python(cell: Annotated[str, "Valid Python cell to execute."]) -> str:
#     ipython = get_ipython()
#     result = ipython.run_cell(cell)
#     log = str(result.result)
#     if result.error_before_exec is not None:
#         log += f"\n{result.error_before_exec}"
#     if result.error_in_exec is not None:
#         log += f"\n{result.error_in_exec}"
#     return log


# another way of registering functions is to use the register_function
# def exec_sh(script: Annotated[str, "Valid Python cell to execute."]) -> str:
#     return user_proxy.execute_code_blocks([("sh", script)])


# autogen.agentchat.register_function(
#     exec_python,
#     caller=chatbot,
#     executor=user_proxy,
#     name="sh",
#     description="run a shell script and return the execution result.",
# )

# register Solid get

@user_proxy.register_for_execution()
@chatbot.register_for_llm(description="calculator")
def calculate(expression: Annotated[str, "Expression to evaluate."]) -> str:
    """Evaluate a mathematical expression"""
    try:
        result = eval(expression)
        return json.dumps({"result": result})
    except:
        return json.dumps({"error": "Invalid expression"})


@user_proxy.register_for_execution()
@chatbot.register_for_llm(description="GET")
def get(url: Annotated[str, "Valid url."] = "http://localhost:3000") -> str:
    try:
        # url = 'https://api.github.com/some/endpoint'

        headers = {"Content-Type": "text/plain"}
        r = requests.get(url, headers=headers)
        return json.dumps({"response": r.text})
    except:
        return json.dumps({"error": "ERROR"})


@user_proxy.register_for_execution()
@chatbot.register_for_llm(description="PUT")
def put(url: Annotated[str, "Valid url."] = "http://localhost:3000", body={}) -> str:
    try:
        # url = 'https://api.github.com/some/endpoint'

        headers = {"Content-Type": "apploication/ld+json"}
        r = requests.put(url, data=body, headers=headers)
        return json.dumps({"response": r.text})
    except:
        return json.dumps({"error": "ERROR"})


# @user_proxy.register_for_execution()
# @chatbot.register_for_llm(description="solid_server_request")
# def solid_request(method: Annotated[str, "Valid method."], url: Annotated[str, "Valid url."], payload: Optional[Annotated[str, "Valid JSON payload."]]) -> str:
#     """Perform a GET,POST,PUT,DELETE, PATCH, or HEAD, OPTIONS request"""
#     try:
#         # result = eval(url)
#         # if url.endswith("/") or url.endswith(".json") or url.endswith(".jsonld") or url.endswith(".ttl"):
#         headers = {"Accept": "application/ld+json"}
#         # else:
#         #     headers = {"Accept": "plain/text"}
#         response = requests.request(method, url, json=payload, headers=headers)
#         # r = requests.get(url, headers=headers)
#         # r = requests.get(url)
#         return json.dumps({response: response.json})
#         # if url.endswith(".json") or url.endswith(".jsonld") or url.endswith(".ttl"):
#         #     return json.dumps(r.json())
#         # else:
#         #     return r.text()
#         # if r.headers["content-type"].endswith(json) else r.text()
#         # return r.json()
#     except Exception as e:      # works on python 3.x
#         return json.dumps({"Grosse error": e})


# tools = [
#     {
#         "type": "function",
#         "function": {
#                 "name": "calculate",
#                 "description": "Evaluate a mathematical expression",
#                 "parameters": {
#                     "type": "object",
#                     "properties": {
#                         "expression": {
#                             "type": "string",
#                             "description": "The mathematical expression to evaluate",
#                         }
#                     },
#                     "required": ["expression"],
#                 },
#         },
#     }
# ]

# autogen.agentchat.register_function(
#     calculate,
#     caller=chatbot,
#     executor=user_proxy,
#     name="calculate",
#     description="run a shell script and return the execution result.",
# )


# @user_proxy.register_for_execution()
# @chatbot.register_for_llm(name="http_request", description="run get/post/put/head/option query to solid server and return the execution result.")
# def http_request(method: Annotated[str, "Valid http method."], url: Annotated[str, "Valid url."], payload: Annotated[str, "Valid jsonld data for a curl."]) -> str:
#     """
#     Generates an HTTP request and returns the response.

#     Args:
#         method (str): The HTTP method (e.g., 'GET', 'POST', 'PUT', 'HEAD', 'OPTION').
#         url (str): The URL for the request.
#         payload_json (Optional[str]): A JSON string representing the request payload.

#     Returns:
#         dict: The response from the HTTP request.
#     """
#     try:
#         headers = {"Content-Type": "application/ld+json",
#                    "Accept": "application/ld+json"}

#         # For GET requests, ignore the payload
#         if method.upper() == "GET":
#             print(f"[HTTP] launching GET request to {url}")
#             response = requests.get(url, headers=headers)
#         else:
#             # Validate and convert the payload for other types of requests
#             # if payload_json:
#             #     payload = json_loads(payload_json)
#             # else:
#             #     payload = {}
#             # print(f"[HTTP] launching {method} request to {url}, payload=\n{json_dumps(payload, indent=2)}")
#             print(
#                 f"[HTTP] launching {method} request to {url}, payload=\n{payload}")
#             response = requests.request(
#                 method, url, json=payload, headers=headers)

#         return {"status_code": response.status_code, "headers": dict(response.headers), "body": response.text}
#     except Exception as e:
#         return {"error": str(e)}


with Cache.disk() as cache:
    # start the conversation
    user_proxy.initiate_chat(
        chatbot,
        message="""Tu es un assistant Solid et un expert en Web semantique.
        Tu as à ta disposition un serveur Solid à l'adresse http://localhost:3000/ sur lequel tu peux effectuer des requetes  GET
        pour obtenir des informations et des requestes PUT pour mettre à jour les informations. 
        les urls pour requeter les containers doivent se terminer par un slash (/) OBLIGATOIREMENT !
        Les ressources que tu créé ou manipulent sont FORCEMENT au format jsonld   
       
          """,


        # """Tu dois détailler chaque opération que tu comptes faire.
        #           Use the GET function to perform GET operations, and PUT to perform updates on Solid server located at http://localhost:3000/ and provide the results.
        #           Utilise la fonction GET pour connaitre les containers à la racine du serveur http://localhost:3000/ .
        #           Donne-moi la liste des containers et imagine ce que chacun d'eux contient.
        #           les requetes vers les containers doivent obligatoirement se terminer par un slash (/)
        #           tu as des exemples de requete à l'l'url https://raw.githubusercontent.com/CommunitySolidServer/CommunitySolidServer/refs/heads/main/documentation/markdown/usage/example-requests.md
        #           les paramètres pour la fonction GET est 'url', pour la fonction PUT est 'url' et 'body' (au format jsonld)
        #           avec qui john est-il marié ?
        #           """


        #    Si tu es perdu effectue une requete GET sur http://localhost:3000/ pour retrouver la marche à suivre
        #   Met à jour la resource john pour indiquer qu'il est marié avec Lola via la propriété 'spouse'.
        #          Combien y'at-il de users dans users/ ?
        #  Quels sont leurs noms ?


        # message="""You are a calculator assistant. Use the calculate function to perform mathematical operations and provide the results.""",
        # message="""You are a Solid assistant and a web semantic expert.
        #   Use the GET function to perform operations on http://localhost:3000 Solid server.
        #   You can use GET, POST, PUT, DELETE, PATCH, HEAD and OPTIONS requests to interact with the server and its resources.
        #   Do not simulate the requests, really execute on th server.
        #   all you need to know to interact with a Solid server is https://raw.githubusercontent.com/CommunitySolidServer/CommunitySolidServer/refs/heads/main/documentation/markdown/usage/example-requests.md
        # Start with a get on http://localhost:3000.
        # And Explore each container to understand the data we will play with.""",


        #         message="""A Community Solid Server is running at http://localhost:3000/ .
        #         Commence par explorer les ressources et containers à http://localhost:3000/.
        #         Can you tell me what is available at http://localhost:3000/tools/ ?
        #           Using John Model at http://localhost:3000/users/john ,
        #          and POST request, create a user at http://localhost:3000/users/Rosy
        #           exemples of query are available in javascript at http://localhost:3000/functions/code/utils.js
        #           But if you feel better in python you can translate them.
        #           Run the code to create Rosy as John sister and update John.

        #           you can use :

        #           PUT: Creating resources for a given URL¶

        # Create a plain text file:

        # curl -X PUT -H "Content-Type: text/plain" \
        #   -d "abc" \
        #   http://localhost:3000/myfile.txt

        # Create a turtle file:

        # curl -X PUT -H "Content-Type: text/turtle" \
        #   -d "<ex:s> <ex:p> <ex:o>." \
        #   http://localhost:3000/myfile.ttl

        # POST: Creating resources at a generated URL¶

        # Create a plain text file:

        # curl -X POST -H "Content-Type: text/plain" \
        #   -d "abc" \
        #   http://localhost:3000/

        # Create a turtle file:

        # curl -X POST -H "Content-Type: text/turtle" \
        #   -d "<ex:s> <ex:p> <ex:o>." \
        #   http://localhost:3000/

        # The response's Location header will contain the URL of the created resource.
        # GET: Retrieving resources¶

        # Retrieve a plain text file:

        # curl -H "Accept: text/plain" \
        #   http://localhost:3000/myfile.txt

        # Retrieve a turtle file:

        # curl -H "Accept: text/turtle" \
        #   http://localhost:3000/myfile.ttl

        # Retrieve a turtle file in a different serialization:

        # curl -H "Accept: application/ld+json" \
        #   http://localhost:3000/myfile.ttl

        # DELETE: Deleting resources¶

        # curl -X DELETE http://localhost:3000/myfile.txt

        # PATCH: Modifying resources¶

        # Modify a resource using N3 Patch:

        # curl -X PATCH -H "Content-Type: text/n3" \
        #   --data-raw "@prefix solid: <http://www.w3.org/ns/solid/terms#>. _:rename a solid:InsertDeletePatch; solid:inserts { <ex:s2> <ex:p2> <ex:o2>. }." \
        #   http://localhost:3000/myfile.ttl

        # Modify a resource using SPARQL Update:

        # curl -X PATCH -H "Content-Type: application/sparql-update" \
        #   -d "INSERT DATA { <ex:s2> <ex:p2> <ex:o2> }" \
        #   http://localhost:3000/myfile.ttl

        # HEAD: Retrieve resources headers¶

        # curl -I -H "Accept: text/plain" \
        #   http://localhost:3000/myfile.txt

        # OPTIONS: Retrieve resources communication options¶

        # curl -X OPTIONS -i http://localhost:3000/myfile.txt

        # """,
        cache=cache,
    )
