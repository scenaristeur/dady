# https://microsoft.github.io/autogen/blog/2024/06/24/AltModels-Classes#function-calls
# from IPython import get_ipython
# from langchain_community.document_transformers import Html2TextTransformer
# from langchain_community.document_loaders import UnstructuredURLLoader
from typing_extensions import Annotated, Optional

import autogen
from autogen import AssistantAgent, UserProxyAgent
# from autogen.cache import Cache
import requests
import json
import os
from typing import Literal


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
    "cache_seed": 250,  # seed for caching and reproducibility
}


# Our functionbot, who will be assigned two functions and
# given directions to use them.
functionbot = autogen.AssistantAgent(
    name="functionbot",
    system_message="Pour les 'http_request' vers le 'serveur solid', "
    "utilise seulement les fonction qui t'ont été fournies."
    "Répond avec des informations pertinentes et exactes, pas avec des conseils ou des suppositions."
    "Le serveur Solid est structuré sous forme de Linked Data. les ressources ont des liens vers les autres ressources."
    "Explore chaque ressource que tu trouve."
    "Si une information te manque repars avec un http_request sur http://localhost:3000/ pour trouver le container approprié, et scanner les ressources qu'il contient."
    "Quand tu as fini, répond simplement avec 'TERMINATE' en anglais, sans traduire !",
    is_termination_msg=lambda x: x.get("content", "") and (x.get(
        "content", "").rstrip().endswith("TERMINATE") or x.get("content", "") == ""),
    llm_config=llm_config,
)

# Our user proxy agent, who will be used to manage the customer
# request and conversation with the functionbot, terminating
# when we have the information we need.
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    system_message="Tu es le compagnon d'exploration idéal qui "
    "fournis des informations précises aux explorateurs."
    "Récupère les informations dont tu as besoin en explorant"
    "les containers et les ressources appropriées du serveur. "
    "pour aider l'explorateur à résoudre ses enigmes. "
    "Si c'est un container, regarde ce qu'il contient avec http_request."
    "Ne présuppose pas les urls. Si tu as un doute, fais un GET sur le container le plus pertinent,"
    "ou à la racine du serveur. Si tu as l'information dont tu as besoin "
    " quand tu as fini, répond simplement avec 'TERMINATE' en anglais, sans traduire !",
    is_termination_msg=lambda x: x.get("content", "") and (x.get(
        "content", "").rstrip().endswith("TERMINATE") or x.get("content", "") == ""),
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
)

# CurrencySymbol = Literal["USD", "EUR"]


# def exchange_rate(base_currency: CurrencySymbol, quote_currency: CurrencySymbol) -> float:
#     if base_currency == quote_currency:
#         return 1.0
#     elif base_currency == "USD" and quote_currency == "EUR":
#         return 1 / 1.1
#     elif base_currency == "EUR" and quote_currency == "USD":
#         return 1.1
#     else:
#         raise ValueError(
#             f"Unknown currencies {base_currency}, {quote_currency}")


# def get_current_weather(location, unit="fahrenheit"):
#     """Get the weather for some location"""
#     if "chicago" in location.lower():
#         return json.dumps({"location": "Chicago", "temperature": "13", "unit": unit})
#     elif "san francisco" in location.lower():
#         return json.dumps({"location": "San Francisco", "temperature": "55", "unit": unit})
#     elif "new york" in location.lower():
#         return json.dumps({"location": "New York", "temperature": "11", "unit": unit})
#     else:
#         return json.dumps({"location": location, "temperature": "unknown"})

# my functions
# def read_from_text_file(self, filename: str, line_start: int, num_lines: Optional[int] = 1):
#     """
#     Read lines from a text file.

#     Args:
#         filename (str): The name of the file to read.
#         line_start (int): Line to start reading from.
#         num_lines (Optional[int]): How many lines to read (defaults to 1).

#     Returns:
#         str: Text read from the file
#     """
#     max_chars = 500
#     trunc_message = True
#     if not os.path.exists(filename):
#         raise FileNotFoundError(f"The file '{filename}' does not exist.")

#     if line_start < 1 or num_lines < 1:
#         raise ValueError("Both line_start and num_lines must be positive integers.")

#     lines = []
#     chars_read = 0
#     with open(filename, "r", encoding="utf-8") as file:
#         for current_line_number, line in enumerate(file, start=1):
#             if line_start <= current_line_number < line_start + num_lines:
#                 chars_to_add = len(line)
#                 if max_chars is not None and chars_read + chars_to_add > max_chars:
#                     # If adding this line exceeds MAX_CHARS, truncate the line if needed and stop reading further.
#                     excess_chars = (chars_read + chars_to_add) - max_chars
#                     lines.append(line[:-excess_chars].rstrip("\n"))
#                     if trunc_message:
#                         lines.append(f"[SYSTEM ALERT - max chars ({max_chars}) reached during file read]")
#                     break
#                 else:
#                     lines.append(line.rstrip("\n"))
#                     chars_read += chars_to_add
#             if current_line_number >= line_start + num_lines - 1:
#                 break

#     return "\n".join(lines)


# def append_to_text_file(self, filename: str, content: str):
#     """
#     Append to a text file.

#     Args:
#         filename (str): The name of the file to append to.
#         content (str): Content to append to the file.

#     Returns:
#         Optional[str]: None is always returned as this function does not produce a response.
#     """
#     if not os.path.exists(filename):
#         raise FileNotFoundError(f"The file '{filename}' does not exist.")

#     with open(filename, "a", encoding="utf-8") as file:
#         file.write(content + "\n")


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
                f"[HTTP] launching {method} request to {url}, payload=\n{json.dumps(payload, indent=2, ensure_ascii=JSON_ENSURE_ASCII)}")
            response = requests.request(
                method, url, json=payload, headers=headers)

        return {"status_code": response.status_code, "headers": dict(response.headers), "body": response.text}
    except Exception as e:
        return {"error": str(e)}


# def load_urls(self, urls: list[str]):
#     """
#     Load multiple URLs into a list of Documents. It is often more readable to load URLs into Documents
#       than fetching with http_request.
#     Prefer this function over http_request if you want to load multiple URLs into Documents and get informations.

#     Args:
#         urls (list[str]): A list of URLs to load.

#     Returns:
#         list[Document]: A list of Document objects, each containing the URL's contents.
#     """
#     # loader = SeleniumURLLoader(urls=urls)
#     loader = UnstructuredURLLoader(urls=urls)
#     data = loader.load()

#     return data


# def html2text(self, urls: list[str]):
#     """
#     Converts HTML documents from the given URLs to plain text.

#     This method utilizes the `Html2TextTransformer` to convert HTML content
#     of each URL into plain text. It is useful for processing web pages into
#     a format more suitable for text analysis or extraction tasks.

#     Args:
#         urls (list[str]): A list of URLs pointing to the HTML documents to be converted.

#     Returns:
#         list[str]: A list containing the plain text representation of each HTML document.
#     """

#     html2text = Html2TextTransformer()
#     docs_transformed = html2text.transform_documents(urls)

#     return docs_transformed


# @user_proxy.register_for_execution()
# @functionbot.register_for_llm(description="Currency exchange calculator.")
# def currency_calculator(
#     base_amount: Annotated[float, "Amount of currency in base_currency"],
#     base_currency: Annotated[CurrencySymbol, "Base currency"] = "USD",
#     quote_currency: Annotated[CurrencySymbol, "Quote currency"] = "EUR",
# ) -> str:
#     quote_amount = exchange_rate(base_currency, quote_currency) * base_amount
#     return f"{quote_amount} {quote_currency}"


# @user_proxy.register_for_execution()
# @functionbot.register_for_llm(description="Weather forecast for US cities.")
# def weather_forecast(
#     location: Annotated[str, "City name"],
# ) -> str:
#     weather_details = get_current_weather(location=location)
#     weather = json.loads(weather_details)
#     return f"{weather['location']} will be {weather['temperature']} degrees {weather['unit']}"

# my custom function


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
    message="""http_request sur http://localhost:3000/ pour voir ce que le serveur 
    contient comme container (se terminant par un '/') et comme ressources.
    Pour répondre aux questions effectue des http_request sur les containers (/) et les ressources 
    les plus pertinents.
    Liste les containers à la racine (http://localhost:3000/) , cela te permettra de savoir
    dans quel container sont les informations. "personnages" dans http://localhost:3000/personnages/, 
    "lieux" dans http://localhost:3000/lieux/, etc.
    Qui est la fiancée de BioThek et où travaille-t-elle ?
    """,
    # message="""
    # - Utilise http_request à l'url http://localhost:3000/
    # pour creer une liste des ressources des containers.
    # - Utilise http_request sur le container personnages/
    # pour créer une liste des personnages.
    # - Utilise http_request sur la ressource pour obtenir
    # les informations contenues dans cette resource.
    # - Attention ! les urls de containers se terminent par '/',
    #   celles des ressources sans le '/' ne sont pas accessibles.
    # par exemples 'http://localhost:3000/personnages/' est l'url du container personnages
    # et contient tous les personnages, l'url ''http://localhost:3000/personnages/Biothek' et l'url
    # du personnage 'BioThek' et contient les informations les concernant et les relations,
    # liens qu'il possède avec les autres ressources (personnages, leius, objets...).
    # Dans une ressource, les autres ressources sont indiquées par '@id', comme en jsonld (les ressources et containers sont au format jsonld).
    # - Avec les informations que tu as trouvé, répond à ces question :
    #   'Qui est la fiancée de BioThek? Où travaille-t-elle ? Qui travaille avec elle ?'
    # - Indique ton cheminement et les ressources que tu utilises pour trouver les informations.""",
    #     message="""Nous utilisons le "Community Solid Server" (CSS) server
    #       pour stocker les connaissances dans le format du web sémantique (LinkedData).
    #     Ce serveur est accessible à l'adresse http://localhost:3000/
    #     et utilise le protocola Solid Server.
    #     Nous sommes dans un jeu de piste, et tu dois trouver les informations le plus rapidement possible.
    #     Commence par explorer les ressources à la racine du serveur, et deduis-en où tu peux
    #     trouver l'information.
    #     En cas de doute reviens-toujours à la racine du serveur pour trouver le container où se
    #     cache l'information.
    #     liste les containers à la racine du serveur.

    #     N'invente pas d'informations si je ne te le demande pas explicitement.
    #     Ta source d'informations est le CSS serveur http://localhost:3000/ et seulement ça.
    #     Tu dois parcourir les conatiners et trouver les bonnes resources dans lesquelles sont les informations.
    #     Tu peux te créer une représentation mentale (ou un index) des containers et ressources pour te faciliter la tache.
    # """,
    # Dans quel container se trouvent les personnages ?
    # Qui est la petite amie de Biothek ?
    # message="My customer wants to travel to New York and "
    # "they need to exchange 830 EUR to USD. Can you please "
    # "provide them with a summary of the weather and "
    # "exchanged currently in USD?",
    summary_method="reflection_with_llm",
    summary_args={
        "summary_prompt": """Summarize the conversation by
        providing a short note with the useful information
        with usrls you scrpped and détails of where you found informations. Do not
        provide any additional conversation or apologise,
        just provide the relevant information and the note."""
    },
)

print(
    f"Here's the LLM summary of the conversation:\n\n{res.summary['content']}")
