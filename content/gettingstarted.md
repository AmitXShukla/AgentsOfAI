# Environment Setup

We have recently learned the basics of what an AI Agent is and how Multi-agent systems consist of a group of individual AI Agents working together within a single environment or across distributed environments. The primary purpose of implementing a Single Agent or a Multi-Agent system is to solve a business use case by accomplishing a specific set of tasks, thereby automating the business process.

However, our exploration is not complete; there is still much more to learn about AI Agents. Before we proceed to study Agent behavior in detail, let's first delve deeper into the underlying mechanisms of an AI Agent.

# new virtual environment

```python
! python --version
# Python 3.10 or later is required.

######################################################
# Create and activate a new Python virtual environment
# When installing AgentChat or Agent Core locally
# we recommend using a virtual environment
# for the installation. 
# This will ensure that the dependencies for 
# AI Agents are isolated from the rest of your system.
######################################################

! python3 -m venv .venv
! source .venv/bin/activate

## To deactivate later, run:
! deactivate

######################################################
# install autogen in this section below
######################################################
# install autogen studio
! pip install -U autogenstudio
# install autogen chat
! pip install -U "autogen-agentchat"
# install autogen OpenAI for Model Client
! pip install "autogen-ext[openai]"
# install autogen core
! pip install "autogen-core"

######################################################
# run AutoGen Studio GUI
######################################################
! autogenstudio ui --host <host> --port 8000
```

# llama.cpp

```python
#############################################
# install llama.cpp to run deepseek-r1 model
#############################################

! git clone https://github.com/ggerganov/llama.cpp
! cd llama.cpp
! make

# Download the deepseek-r1 Model weights 

# Convert the Model (if necessary)
# If the model weights are not already in GGML format, 
# you must convert them using the conversion tools provided in llama.cpp. 
# Assuming the model weights are in PyTorch format:
! python3 convert-pth-to-ggml.py path/to/deepseek-r1.pth

# Prepare the Model File
# Place the .bin model file (e.g., deepseek-r1.ggml.bin) into the llama.cpp directory 
# or specify its location when running commands

# run the model
!./main -m ./deepseek-r1.ggml.bin -p "Your prompt here"

# adjust parameters
!./main -m ./deepseek-r1.ggml.bin -p "Explain quantum mechanics." -t 8 -n 128 --temp 0.8
```

# ollama

```python
##########################################
# install ollama to run deepseek-r1 model
##########################################

! curl -fsSL https://ollama.com/install.sh | sh

! ollama list
! ollama pull deepseek-r1:7b
! ollama list
! ollama run deepseek-r1

# please see, ollama by default serves at 0.0.0.0:11434
# you can change this
! sudo systemctl edit ollama.service
#[Service]
Environment="OLLAMA_HOST=0.0.0.0:8000"

! sudo systemctl daemon-reload
! sudo systemctl restart ollama.service

# also, for a quick one time change you can run ollama as
! export OLLAMA_HOST=127.0.0.1:8000
! ollama serve
```