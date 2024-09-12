# https://github.com/microsoft/autogen/blob/212722cd45ac528f232d6e41b2112b040aa1844a/notebook/agentchat_function_call.ipynb

from IPython import get_ipython
from typing_extensions import Annotated

import autogen
from autogen.cache import Cache
import requests


config_list = autogen.config_list_from_json(env_or_file="OAI_CONFIG_LIST")


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
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    },  # Please set use_docker=True if docker is available to run the generated code. Using docker is safer than running the generated code directly.
)


# define functions according to the function description


# one way of registering functions is to use the register_for_llm and register_for_execution decorators
@user_proxy.register_for_execution()
@chatbot.register_for_llm(name="python", description="run cell in ipython and return the execution result.")
def exec_python(cell: Annotated[str, "Valid Python cell to execute."]) -> str:
    ipython = get_ipython()
    result = ipython.run_cell(cell)
    log = str(result.result)
    if result.error_before_exec is not None:
        log += f"\n{result.error_before_exec}"
    if result.error_in_exec is not None:
        log += f"\n{result.error_in_exec}"
    return log


# another way of registering functions is to use the register_function
def exec_sh(script: Annotated[str, "Valid Python cell to execute."]) -> str:
    return user_proxy.execute_code_blocks([("sh", script)])


autogen.agentchat.register_function(
    exec_python,
    caller=chatbot,
    executor=user_proxy,
    name="sh",
    description="run a shell script and return the execution result.",
)

# register Solid get


@user_proxy.register_for_execution()
@chatbot.register_for_llm(name="solid_request", description="run get query to solid server and return the execution result.")
def http_request(method: Annotated[str, "Valid url."], url: Annotated[str, "Valid url."], payload: Annotated[str, "Valid data for a curl."]) -> str:
    """
    Generates an HTTP request and returns the response.

    Args:
        method (str): The HTTP method (e.g., 'GET', 'POST').
        url (str): The URL for the request.
        payload_json (Optional[str]): A JSON string representing the request payload.

    Returns:
        dict: The response from the HTTP request.
    """
    try:
        headers = {"Content-Type": "application/json"}

        # For GET requests, ignore the payload
        if method.upper() == "GET":
            print(f"[HTTP] launching GET request to {url}")
            response = requests.get(url, headers=headers)
        else:
            # Validate and convert the payload for other types of requests
            # if payload_json:
            #     payload = json_loads(payload_json)
            # else:
            #     payload = {}
            # print(f"[HTTP] launching {method} request to {url}, payload=\n{json_dumps(payload, indent=2)}")
            print(
                f"[HTTP] launching {method} request to {url}, payload=\n{payload}")
            response = requests.request(
                method, url, json=payload, headers=headers)

        return {"status_code": response.status_code, "headers": dict(response.headers), "body": response.text}
    except Exception as e:
        return {"error": str(e)}


with Cache.disk() as cache:
    # start the conversation
    user_proxy.initiate_chat(
        chatbot,
        message="""A Community Solid Server is running at http://localhost:3000/ .
        Commence par explorer les ressources et containers à http://localhost:3000/.
        Can you tell me what is available at http://localhost:3000/tools/ ?
          Using John Model at http://localhost:3000/users/john ,
         and POST request, create a user at http://localhost:3000/users/Rosy
          exemples of query are available in javascript at http://localhost:3000/functions/code/utils.js
          But if you feel better in python you can translate them.
          Run the code to create Rosy as John sister and update John.
""",
        cache=cache,
    )
