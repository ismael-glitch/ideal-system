import openai
import oppip 

openai.api_key = "VOTRE_CLE_API"

def ask_gitbank(question):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Tu es l'assistant IA de GitBank, banque en ligne."},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content

# Exemple d'utilisation
if __name__ == "__main__":
    while True:
        user_input = input("Vous : ")
        if user_input.lower() in ["quit", "exit"]:
            break
        print("GitBank IA :", ask_gitbank(user_input))