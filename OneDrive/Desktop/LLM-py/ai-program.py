import ollama 

model_name = "llama3.2:latest"
prompt_name = "Explain how ai works in one line?"
response = ollama.generate(model= model_name, prompt= prompt_name)

print(response.response)