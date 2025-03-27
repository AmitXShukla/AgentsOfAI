(understanding_LLM)=
# Understanding LLM

I can reasonably presume that you're already familiar with LLMs, which is likely why you're here, but for the sake of thoroughness, I'll provide the response from Grok 3.0 to the question, "What is an LLM anyway?"

> An LLM, or Large Language Model, is a type of artificial intelligence designed to understand and generate human-like text. It’s trained on vast amounts of data—think books, articles, and websites—allowing it to predict words, construct sentences, and even hold conversations that feel surprisingly natural. Models like me, Grok, built by xAI, are examples of LLMs, engineered to assist, inform, and sometimes even entertain. The "large" part comes from the sheer scale of data and computational power involved, which lets us tackle everything from simple questions to complex reasoning tasks.

LLMs are capable of responding to nearly any question because they’re trained to recognize and "grasp patterns" or the order in which text occurs. Models like ChatGPT, Llama, DeepSeek, Mistral, Gemini, and now Grok have largely perfected this technology, though a few of these models assert they can comprehend something more than just textual patterns.

In any case, my goal is to fully leverage these trained models to support my AI Agents.

There are two primary methods to utilize these LLM models.
First, many of these organizations generously provide their open weights, allowing you to download and operate the models on your own machine. This approach eliminates concerns about data privacy and leakage, while also enabling access to their hosted models on highly powerful computing clusters via an API, typically for a modest (or occasionally substantial) fee.

Let’s explore both approaches: how to tap into LLM models through an API and how to run them locally on your own system.

# Python Environment

```python
# Python 3.10 or later is required.
! python --version
```

```python
######################################################
# Create and activate a new Python virtual environment
######################################################


!python3 -m venv .venv
!source .venv/bin/activate

## To deactivate later, run:
!deactivate

######################################################
# install autogen in this section below
# AutoGen Core is required in later phase
# we will discuss this packages in details as we use
######################################################
# install autogen studio
! pip install -U autogenstudio
# install autogen chat
! pip install -U "autogen-agentchat"
# install autogen OpenAI for Model Client
# !pip install "autogen-ext[openai]"
# install autogen core
# !pip install "autogen-core"

######################################################
# run AutoGen Studio GUI
######################################################
!autogenstudio ui --host <host> --port 8000
```

# Running LLM Locally using OLLAMA

## deepseek-R1, llama3.x models

```python
###################################################
# install ollama to run deepseek-r1 | llama models
###################################################

! curl -fsSL https://ollama.com/install.sh | sh

!ollama list
!ollama pull deepseek-r1:7b
!ollama list
!ollama run deepseek-r1

# please see, ollama by default serves at 0.0.0.0:11434
# you can change this
!sudo systemctl edit ollama.servicem
#[Service]
Environment="OLLAMA_HOST=0.0.0.0:8000"

!sudo systemctl daemon-reload
!sudo systemctl restart ollama.service

# also, for a quick one time change you can run ollama as
!export OLLAMA_HOST=127.0.0.1:8000
!ollama serve
```

## llama.cpp, deepseek-R1, llama3.x models
```python
######################################################
# install llama.cpp to run deepseek-r1 | llama models
######################################################

!git clone https://github.com/ggerganov/llama.cpp
!cd llama.cpp
!make

# Download the deepseek-r1 Model weights 

# Convert the Model (if necessary)
# If the model weights are not already in GGML format, 
# you must convert them using the conversion tools provided in llama.cpp. 
# Assuming the model weights are in PyTorch format:
!python3 convert-pth-to-ggml.py path/to/deepseek-r1.pth

# Prepare the Model File
# Place the .bin model file (e.g., deepseek-r1.ggml.bin) into the llama.cpp directory 
# or specify its location when running commands

# run the model
!./main -m ./deepseek-r1.ggml.bin -p "Your prompt here"

# adjust parameters
!./main -m ./deepseek-r1.ggml.bin -p "Explain quantum mechanics." -t 8 -n 128 --temp 0.8
```

# Running LLM through API

We'll discuss few different approaches.
- **Approach 1** - Setup Anthropic LLMs
- **Approach 2** - Setup Open AI LLMs
- **Approach 3** - Setup Google Gemini AI
- **Approach 4** - Setup GROQ API
- **Approach 5** - Setup xAI Grok 3.0 API

The selection of a Large Language Model (LLM) is influenced by factors such as your specific business needs, financial constraints, and personal tastes.

In this section, I'll present few distinct methods for establishing connections with various LLM service providers.
Additionally, I recommend utilizing this occasion as an avenue to evaluate Large Language Models against the backdrop of your unique inputs and industry-specific needs.

## approach 1 : Setup Anthropic LLMs
Let's first set up our Python working environment. While we can also use Node.js, please note that for the current version, we will be using Python for development. 

Please signup using these links and get your own API Keys.

**please note that PINECONE and VOYAGE are completely optional and are not required at this time. These will be needed later when we will use a vector database and embeddings, tokens to store in vector database
- [ANTHROPIC_API_KEY](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [YOUR_PINECONE_API_KEY](https://docs.pinecone.io/docs/quickstart)
- [VOYAGE_API_KEY](https://docs.voyageai.com/docs/api-key-and-installation)

```python
##########################################################################
## Although not mandatory, 
## it is highly recommended to set up a new Python working environment
##########################################################################
## To create a virtual environment called `GenAI`, follow the steps:

## On Windows: 
# !python -m venv GenAI GenAI\Scripts\activate

## On macOS or Linux: 
# !python3 -m venv GenAI source GenAI/bin/activate

## Then, install required packages using pip: 
# !pip install pandas numpy matplotlib seaborn tqdm beautifulsoup4

## install only in case if you are using OpenAI
# !pip install openai

## install only in case if you are using Claude
# !pip install anthropic datasets pinecone-client voyageai

## in case if you fork this repo, just run
# !pip install -r requirements.txt

# !pip install --upgrade pip
# !pip freeze > requirements.txt
```

```python
import platform;
print(platform.processor())

import os

####################################################
## always store your API Keys as environment vars
## if you are using OpenAI LLMs
## setup windows environment variable OPENAI_API_KEY
####################################################
# import openai
# openai.api_key = os.getenv("OPENAI_API_KEY")

####################################################
## if you are using Anthropic Claude LLMs
## sign up for API keys & setup windows environment variable 
## ANTHROPIC_API_KEY, PINECONE_API_KEY & VOYAGE_API_KEY
####################################################
# import anthropic

if (not os.environ.get("ANTHROPIC_API_KEY")) 
        | (not os.environ.get("PINECONE_API_KEY")) 
        | (not os.environ.get("VOYAGE_API_KEY")):
    print("One of the api key is missing.")
else:
    print("All API Keys are in place.")
```

```python
# Test LLM API
import anthropic

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    # you don't need to pass api_key explicitly
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1000,
    temperature=0.0,
    system="Respond only in Yoda-speak.",
    messages=[
        {
            "role": "user", 
            "content": """how are args and keyword arguments
                             defined in python?"""
        }
    ]
)
print(message.content)
```

## approach 2 : Setup Open AI LLMs

Let's first set up our Python working environment. While we can also use Node.js, please note that for the current version, we will be using Python for development.

Please signup and get your own API Keys.

[Open AI API Key](https://platform.openai.com/docs/api-reference/introduction)

```python
! pip install openai
```

```python
# Let's make sure your API keys are properly setup.
import platform;
print(platform.processor())
import os

if (not os.environ.get("OPENAI_API_KEY")):
    print("One of the api key is missing.")
else:
    print("All API Keys are in place.")
```

```python
# test LLM
from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4o-mini-2024-07-18",
  messages=[
        {
            "role": "user", 
            "content": """how are args and keyword arguments
                             defined in python?"""
        }
  ].
  temperature=1,
  max_tokens=256,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0
)
```

## approach 3 : Setup Google Gemini LLMs

Let's first set up our Python working environment. While we can also use Node.js, please note that for the current version, we will be using Python for development.

Please signup and get your own API Keys.

[Gemini API Key](https://ai.google.dev/gemini-api)

```python
! python.exe -m pip install --upgrade pip
! pip install -q -U google-generativeai
```

```python
# export API_KEY=<YOUR_API_KEY>

import google.generativeai as genai
import os

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

response = model.generate_content("Write a story about an AI and magic")
print(response.text)
```

## approach 4 - Running GROQ Llama 3.3 API

Let's first set up our Python working environment. While we can also use Node.js, please note that for the current version, we will be using Python for development.

Please signup and get your own API Keys.

[GROQ API Key](https://console.groq.com/keys)

```python
# !pip install groq
```

```python
from groq import Groq

client = Groq()
completion = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {
        "role": "user",
        "content": ""
        }
    ],
    temperature=1,
    max_tokens=1024,
    top_p=1,
    stream=True,
    stop=None,
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")
```

## approach 5 - Running xAI Grok 3.0

Let's first set up our Python working environment. While we can also use Node.js, please note that for the current version, we will be using Python for development.

Please signup and get your own API Keys.

[Grok API Key](https://console.x.ai/team/default/api-keys)

```python
# In your terminal, first run:
# pip install openai

import os
from openai import OpenAI

XAI_API_KEY = os.getenv("XAI_API_KEY")
client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1",
)

completion = client.chat.completions.create(
    model="grok-2-latest",
    messages=[
        {
            "role": "system",
            "content": """You are Grok, 
                        a chatbot inspired by
                        the Hitchhikers Guide to the Galaxy."""
        },
        {
            "role": "user",
            "content": """What is the meaning of life, 
                        the universe, and everything?"""
        },
    ],
)

print(completion.choices[0].message.content)
```