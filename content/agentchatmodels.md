# Models

## using OpenAI LLM models

In today’s fast-moving world, new and improved AI models are released often, making it tough to keep your applications up-to-date and using the best technology. In our AI Agent-based solution, we aim to design a framework that isn’t tied to just one language model (LLM). Instead, it’s built to work with multiple LLMs from different providers or even local models—depending on needs like privacy or custom tuning with an organization’s data.

`AutoGen Core` offers tools to create your own libraries to access LLM model, while `AutoGen-Ext` lets you use pre-made model client libraries. If you want a specific LLM, `AutoGen-Ext` likely has a model client for it. If not, you can build your own with `AutoGen Core`. In short, `AutoGen-Ext` provides model clients to connect with popular LLMs easily.

In this chapter, we’ll explore how to use some of these models, including OpenAI, Gemini, Anthropic Claude, and locally hosted `Ollama` models. Let’s dive in.

Agents often need to connect to LLM services like **Open AI**, **Gemini**, **Anthropic Claude**, and local **`Ollama`**-based models. Since each provider has its own API, `AutoGen Core` sets a standard for model clients, and `AutoGen-Ext` offers ready-made clients for popular services.

AgentChat uses these clients to work with different models.

This section gives a quick look at available model clients. For more on using them, check the Core API documentation on Model Clients.

## OpenAI
To access OpenAI models, install the Open AI extension, which allows you to use the OpenAIChatCompletionClient.

```python
pip install "autogen-ext[openai]"
```

```{warning}
Please signup and get your own API Keys.
[Open AI API Key](https://platform.openai.com/docs/api-reference/introduction)
```

```python
from autogen_ext.models.openai import OpenAIChatCompletionClient

openai_model_client = OpenAIChatCompletionClient(
    model="gpt-4o", # change this latest available model
    ## Optional if you have an OPENAI_API_KEY environment variable set.
    # api_key="sk-...",
)
```
>   test the model client.

```python
from autogen_core.models import UserMessage

result = await openai_model_client.create([
                    UserMessage(
                        content="What is the capital of France?",
                        source="user")])
print(result)
```

```{seealso} result
    CreateResult(finish_reason='stop', 
    content='The capital of France is Paris.', 
    usage=RequestUsage(prompt_tokens=15, 
    completion_tokens=7), cached=False, logprobs=None)
```

## using Anthropic LLM models
To use the AnthropicChatCompletionClient, you need to install the anthropic extension model client.

Please signup using these links and get your own API Keys. [ANTHROPIC_API_KEY](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

```python
# !pip install -U "autogen-ext[anthropic]"
```

```python
from autogen_core.models import UserMessage
from autogen_ext.models.anthropic import AnthropicChatCompletionClient

anthropic_client = AnthropicChatCompletionClient(
                        model="claude-3-7-sonnet-20250219")
result = await anthropic_client.create(
                        [UserMessage(
                            content="What is the capital of France?",
                            source="user")])
print(result)
```

```{seealso} result
    finish_reason='stop' content="The capital of France is Paris. 
    It's not only the political and administrative capital 
    but also a major global center for art, fashion, gastronomy, 
    and culture. Paris is known for landmarks such as the Eiffel Tower, 
    the Louvre Museum, Notre-Dame Cathedral, and the Champs-Élysées."
    usage=RequestUsage(prompt_tokens=14, completion_tokens=73) 
    cached=False logprobs=None thought=None
```

## using Gemini LLM models

You can use the OpenAIChatCompletionClient with the Gemini API.

Please signup and get your own API Keys.
[Gemini API Key](https://ai.google.dev/gemini-api)

```python
from autogen_core.models import UserMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(
    model="gemini-1.5-flash-8b",
    # api_key="GEMINI_API_KEY",
)

response = await model_client.create([
                UserMessage(content=
                        "What is the capital of France?",
                        source="user")])
print(response)
```

```{seealso} result
    finish_reason='stop' content='Paris\n'
    usage=RequestUsage(prompt_tokens=7, completion_tokens=2)
    cached=False logprobs=None thought=None
```

<!-- ## using xAI Grok LLM models -->

## using `Ollama` LLM models

`Ollama` is a local model server that can run models locally on your machine.
To use `Ollama`, install the `Ollama` extension and use the `OllamaChatCompletionClient`.

```python
pip install -U "autogen-ext[ollama]"
```

```python
from autogen_core.models import UserMessage
from autogen_ext.models.ollama import OllamaChatCompletionClient

# Assuming your Ollama server is running locally on port 11434.
ollama_model_client = OllamaChatCompletionClient(model="llama3.2")

response = await ollama_model_client.create([
                    UserMessage(content=
                        "What is the capital of France?", 
                        source="user")])
print(response)
```

```{seealso} result
    finish_reason='unknown' content='The capital of France is Paris.'
    usage=RequestUsage(prompt_tokens=32, completion_tokens=8)
    cached=False logprobs=None thought=None
```

<!-- ## Semantic Kernels -->