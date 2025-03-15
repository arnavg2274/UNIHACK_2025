# import openai
# from dotenv import load_dotenv

import os
import openai
from astra_assistants import Client

# load_dotenv("unihackkey.env")  
# openai.api_key = os.getenv("OPENAI_API_KEY")

# load_dotenv(dotenv_path="unihackkey.env")  
# ASTRA_API_TOKEN = os.getenv("ASTRA_API_TOKEN")

# client = Client(
#     base_url="https://open-assistant-ai.astra.datastax.com/v1",
#     headers={"astra-api-token": ASTRA_API_TOKEN}
# )


client = OpenAI(

    base_url="https://open-assistant-ai.astra.datastax.com/v1",      

    default_headers={

        "astra-api-token": "AstraCS:jEZmQfbQSCZlIlRDrFrsjPlj:96289192b8ea72bcd777245be280e54c2f72f5bc925db84d5964e703318aa492"

    }

)


def get_item_expiry(item_name):

    # client = openai.OpenAI(api_key=openai.api_key) 
    prompt = (
        f"Find the general expiry date for the grocery item '{item_name}'. "
        "Assuming the item is purchased today, provide the expiry date in the format YYYY-MM-DD."
    )

    # assistant = client.assistants.create(
    #     name="Grocery Expert",
    #     instructions="You are a grocery expert who knows the shelf life of food items.",
    #     model="gpt-3.5-turbo"
    # )

    assistant = client.assistants.create(

    instructions="You are a grocery expert who knows the shelf life of food items.",

    model="gpt-4-1106-preview",

    # tools=[{"type": "code_interpreter"}]

    )


    response = assistant.chat(
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    # response = client.chat.completions.create( # call python library 
    #     model="gpt-3.5-turbo",
    #     messages=[
    #         {"role": "system", "content": "You are a grocery expert with detailed knowledge about the shelf life of grocery items"}, # gvies more context to gpt
    #         {"role": "user", "content": prompt}
    #     ],
    #     temperature=0.3
    # )
    # return response.choices[0].message['content'].strip() #returns the response

    return response['choices'][0]['message']['content'].strip()

if __name__ == "__main__":
    item = input("Enter the name of the item: ")
    expiry_date = get_item_expiry(item)
    print("Expiry Date:", expiry_date)
