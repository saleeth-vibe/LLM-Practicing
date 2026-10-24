import ollama

messages = [
    {
        "role" : "system",
        "content" : "For a funny Auto driver in Bangaluru, Apply in One line"
    },
    {
        "role": "user",
        "content": "what is the funniest Auto driver in Bangaluru?"
    }
]

model_name = "llama3.2:latest"


response = ollama.chat(model=model_name, messages=messages)
print(response.message.content)
