# Agent

```{mermaid}
sequenceDiagram
    %% Adding a background box with light color
    rect rgba(200, 212, 223, 0.8)
        participant LLMAgent
        participant ManagerAgent
        participant AnotherAgent
        participant PTOAgent
        participant TaskAgent
        LLMAgent->>PTOAgent: request "Available PTO" for Employee 123
        PTOAgent-->>LLMAgent: respond with 16
        ManagerAgent->>PTOAgent: request "Available PTO" for Employee 123
        PTOAgent-->>ManagerAgent: respond with 16
        ManagerAgent->>PTOAgent: request "Available PTO" for Employee 124
        PTOAgent-->>ManagerAgent: respond with 8
        ManagerAgent->>PTOAgent: request "Available PTO" for Employee 125
        PTOAgent-->>ManagerAgent: respond with 8
        AnotherAgent->>PTOAgent: request "Available PTO" for Employee 512
        PTOAgent-->>AnotherAgent: respond with 24
        ManagerAgent->>TaskAgent: request "Assigned Tasks" for Employee 512
        TaskAgent-->>ManagerAgent: respond with TaskList
    end
```

In our use case, we have implemented `PTOAgent`, `TaskAgent` using `AutoGen Core`. These two agents has some kind of behavior which resembles more of a function call. that is, given an employee ID, `PTOAgent` and `TaskAgent` queries into database and fetches the available PTO and assigned tasks to this given employee.
When need any such behavior from an Agent, which mostly appears to be passing some values and doing a defined act, writing Python like API or query based function with in Agent definition is acceptable.

However, now, we are building other parts of this use case, its realized that, We need a more intuitive chat bot like user interact which lets employees and manager interact with a system.
We need an Agent like `LLMAgent` which can provide a starting point to a GUI interface, which greets the user and when a user pass values such as employee ID or employee name and queries about available PTO, this `LLMAgent` is smart to break user prompt into appropriate query, fetch parameters and call tool functions or other Agents such as `PTOAgent` and `TaskAgent` to fetch this information.

We can always create one "all in one - know all" kind of Agent, but it may be very complex and may not be a useful solution in long term as complexity grows in our app. Instead breaking tasks, roles into appropriate Agents and managing tasks through Agents seems more logical approach.

So let's implement a `LLMAgent`, which simply greets the user (employee in this use case), ask for an employee ID and pass it on to other agents such `PTOAgent` and `TaskAgent`, get those information from those Agents and pass it back to user.

We could have build this using `AutoGen Core`. but that's the whole point of learning AutoGen `AgentChat`. `AgentChat` provides "preset Agents" which are configured in such a way that you can import not only those Agents, but other preset behavior which you don't want to build from scratch.

AutoGen `AgentChat` provide these preset configuration.

## Accessing LLM Models

Before we start building an AI Agent with AutoGen `AgentChat`, ensure you have access to an LLM model service or a locally hosted model. If needed, refer to the previous chapter {ref}`understanding_LLM` for guidance.

### OpenAI ChatGPT model
Here’s a script to quickly test the Open AI ChatGPT Model LLM model API Service.

```python
! pip install "autogen-ext[openai]"
```

```python
from autogen_ext.models.openai import OpenAIChatCompletionClient

openai_model_client = OpenAIChatCompletionClient(
    model="gpt-4o-2024-08-06",
    # api_key="sk-...", # Optional if you have an OPENAI_API_KEY environment variable set.
)

## test OPEN AI model
from autogen_core.models import UserMessage

result = await openai_model_client.create([
            UserMessage(content="What is the capital of France?",
            source="user")])
print(result)
```

```{seealso} result
    CreateResult(finish_reason='stop', 
    content='The capital of France is Paris.', 
    usage=RequestUsage(prompt_tokens=15, completion_tokens=7), 
    cached=False, logprobs=None)
```
### Locally hosted `Ollama` model
Here’s a script to quickly test the locally hosted `Ollama` LLM model API Service.

```{warning}
    AutoGen works with Ollama-hosted models now,
    but tool support isn’t fully ready yet.
    
    We need a temporary fix to use the Tools function with these models.
```

```python
# LiteLLM is an open-source locally run proxy server
# that provides an OpenAI-compatible API.
# liteLLM will us connect ollama to OpenAI-compatible API
# make sure you already ollama installed and running

! pip install 'litellm[proxy]'

# run litellm
# !litellm --model ollama/deepseek-r1 
# doesn't have tools support yet
!litellm --model ollama/llama3.2
# !ollama pull llama3.2
# !ollama list
```

```python
# this is how you call Ollama models in AutoGen Agent
custom_model_client = OpenAIChatCompletionClient(
    model="deepseek-r1",
# most of other params are unnecessary if litellm is accessed
    base_url="http://0.0.0.0:4000",
    api_key="placeholder",
    model_info={
        "vision": False,
        "function_calling": True,
        "json_output": False,
        # "family": ModelFamily.R1,
    },
)
```

## Assistant Agent

AssistantAgent is a built-in agent that uses a language model and has the ability to use tools.

```python
# import autogen
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient
import asyncio
from autogen_core.models import ModelFamily


# update main function to 
# use locally hosted ollama models
##### WARNING ############################
# This is an area of active development 
# and a native Ollama client for AutoGen
# is planned for a future release.
# workaround is to use litellm
##########################################

custom_model_client = OpenAIChatCompletionClient(
    model="deepseek-r1",
# most of other params are unnecessary if litellm is accessed
    base_url="http://0.0.0.0:4000",
    api_key="placeholder",
    model_info={
        "vision": False,
        "function_calling": True,
        "json_output": False,
        # "family": ModelFamily.R1,
    },
)

async def main() -> None:
    # Define an agent
    agent = AssistantAgent(
                    name="LLMAgent",
                    model_client=custom_model_client,
                    # tools=[tools],
    )

# NOTE: if running this inside a Python script
# you'll need to use asyncio.run(main()).
# await main()
asyncio.run(main())

# copy this entire code into a python file
# main.py and run following from a terminal
# python main.py
# this code will work fine and will accept and answer prompts
# however, you will notice that I have commented ~tools
```

## Agent Responses
We can use the on_messages() method to get the agent response to a given message.

```python
async def assistant_run() -> None:
    response = await agent.on_messages(
        [TextMessage(content="Find information on AutoGen",
            source="user")],
            cancellation_token=CancellationToken(),
    )
    print(response.inner_messages)
    print(response.chat_message)


# Use asyncio.run(assistant_run()) when running in a script.
await assistant_run()
```

```{seealso} result
    [ToolCallRequestEvent(source='assistant', 
    models_usage=RequestUsage(prompt_tokens=598, completion_tokens=16), 
    content=[FunctionCall(id='call_9UWYM1CgE3ZbnJcSJavNDB79',
    arguments='{"query":"AutoGen"}', name='web_search')],
    type='ToolCallRequestEvent'), 
    ToolCallExecutionEvent(source='assistant', models_usage=None, 
    content=[FunctionExecutionResult(content=
        'AutoGen is a programming framework for building multi-agent applications.',
        call_id='call_9UWYM1CgE3ZbnJcSJavNDB79', is_error=False)],
        type='ToolCallExecutionEvent')]
    source='assistant' models_usage=None 
    content='AutoGen is a programming framework 
    for building multi-agent applications.' type='ToolCallSummaryMessage'
```

## Other Preset Agents

Other Preset Agents

The following preset agents are available:

    UserProxyAgent: An agent that takes user input returns it as responses.

    CodeExecutorAgent: An agent that can execute code.

    OpenAIAssistantAgent: An agent that is backed by an OpenAI Assistant, with ability to use custom tools.

    MultimodalWebSurfer: A multi-modal agent that can search the web and visit web pages for information.

    FileSurfer: An agent that can search and browse local files for information.

    VideoSurfer: An agent that can watch videos for information.

```{note}
We will discuss additional Preset Agents in subsequent chapters as we explore advanced use cases.
```