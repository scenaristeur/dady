# https://microsoft.github.io/autogen/blog/2024/06/24/AltModels-Classes#function-calls

from typing_extensions import Annotated, Optional
import autogen
import requests
import json
import os
from typing import Literal


config_list = autogen.config_list_from_json(
    env_or_file="OAI_CONFIG_LIST",
    filter_dict={
        "model": {
            "llama3-8b-8192",
        }
    })


llm_config = {
    "config_list": config_list,
    "timeout": 120,
    "cache_seed": 250,  # seed for caching and reproducibility
}


# Our functionbot, who will be assigned two functions and
# given directions to use them.
functionbot = autogen.AssistantAgent(
    name="functionbot",
    system_message="""Pour les 'http_request' vers le 'serveur solid',
    utilise seulement les fonctions qui t'ont été fournies.
    Les urls des containers se terminent toujours par '/'.
    Lorsque tu découvre un container, liste ses ressources avec 'http_request'.
    Lorsque tu découvres une ressource, utilise également http_request 
    prendre connaissance de son contenu
    des relations avec les autres ressources.
    Quand tu as fini, répond exactement avec 'TERMINE'!""",
    is_termination_msg=lambda x: x.get("content", "") and (x.get(
        "content", "").rstrip().endswith("TERMINE") or x.get("content", "") == ""),
    llm_config=llm_config,
)

# Our user proxy agent, who will be used to manage the customer
# request and conversation with the functionbot, terminating
# when we have the information we need.
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    system_message=""""Tu es le compagnon d'exploration idéal qui 
    fournis des informations précises aux explorateurs.
    Recherche dans les ressources que tu as trouvées.
    Si une information te manque,
    repars avec un 'http_request' sur http://localhost:3000/
    pour trouver le container approprié, et scanner les ressources qu'il contient.
    quand tu as fini, répond exactement avec 'TERMINE'!""",
    is_termination_msg=lambda x: x.get("content", "") and (x.get(
        "content", "").rstrip().endswith("TERMINE") or x.get("content", "") == ""),
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
)


def make_http_request(method: str, url: str, payload_json: Optional[str] = None):
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
        headers = {"Content-Type": "application/ld+json",
                   "Accept": "application/ld+json",
                   "User-Agent": "http-request/1.0 scenaristeur/dady/llm/functions-call"}

        # For GET requests, ignore the payload
        if method.upper() == "GET":
            print(f"[HTTP] launching GET request to {url}")
            response = requests.get(url, headers=headers)
        else:
            # Validate and convert the payload for other types of requests
            if payload_json:
                payload = json.loads(payload_json)
            else:
                payload = {}
            print(
                f"[HTTP] launching {method} request to {url}, payload=\n{json.dumps(payload, indent=2)}")
            response = requests.request(
                method, url, json=payload, headers=headers)

        # return {"status_code": response.status_code, "headers": dict(response.headers), "body": response.text}
        return response.text
    except Exception as e:
        return {"error": str(e)}


@user_proxy.register_for_execution()
@functionbot.register_for_llm(description="Generates an HTTP request and returns the response.")
def http_request(
    method: Annotated[str, "The HTTP method (e.g., 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS')."],
    url: Annotated[str, "The URL for the request."],
    payload: Optional[Annotated[str, "A JSON string representing the request payload."]],
) -> dict:
    result = make_http_request(method, url, payload)
    return result


# start the conversation
res = user_proxy.initiate_chat(
    functionbot,
    message="""
    http_request(method="GET", url="http://localhost:3000/")

    """,
)
