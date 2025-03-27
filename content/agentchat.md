# why AgentChat

In earlier chapters, we covered the basics of `AutoGen Core`.

The official AutoGen documentation suggests starting with AutoGen `AgentChat`. You might wonder why I focused on `AutoGen Core` first. And now, especially when we were close to finishing the HR TimeSheet automation use case, only to switch to `AgentChat`.

The reason is simple: understanding `AutoGen Core` is essential for building professional AI Agent applications. It’s the foundation you need to become a skilled AI Agent Engineer.

Let’s dive into `AgentChat`.

```{note}
why learn AgentChat?

`AgentChat` provides intuitive defaults, such as Agents with preset behaviors and Teams with predefined multi-agent design patterns.
```

`AgentChat` is a simple, high-level API for creating multi-agent apps, built on top of `AutoGen core`. It’s great for beginners, while advanced users can use AutoGen-core’s event-driven model for more control. Here’s the thing: `AgentChat` is largely community-driven and comes with many ready-made Agent and team setups, making it super easy to start with.

One popular design pattern, `Magentic-One`, which we’ll cover later, was originally built in `AutoGen Core 0.2`. It helps users quickly create professional use cases. Now, it’s been fully rebuilt in `AgentChat`.

`AgentChat`, with its strong community support, has become more than just a basic API. It’s so powerful that even when using `AutoGen Core`, instead of building complex Agent patterns from scratch, you can just grab a preset Agent and team setup from `AgentChat` and plug it into your workflow, it works perfectly.

## AutoGen AgentChat

AutoGen `AgentChat` is a user-friendly, opinionated, high-level API built on `AutoGen Core`. When you want to quickly test a feature without writing much code, you can use `Autogen Studio`, which offers a nice visual interface to try out AI Agents fast. 

For more detailed control over your proof of concept, `AgentChat` steps in. It’s not as beginner-friendly as `Autogen Studio`’s no-code, drag-and-drop setup, but `AgentChat` gives you some control over your Agents.

However, Don’t think `AgentChat` is just for quick, high-level proofs of concept. Lately, it’s grown so popular and strong that it rivals `AutoGen-Core` itself. In fact, AutoGen’s most famous design pattern, `Magentic-One` once a highlight of AutoGen 0.2 is now fully built in `AgentChat`.

![AgentChat](https://github.com/microsoft/autogen/raw/main/autogen-landing.jpg)

## Getting started with AgentChat

This is an example script from the AutoGen Documentation designed to help you quickly begin using the AutoGen `AgentChat` API. In the following chapters, we will explore this API in greater depth.

```python
pip install -U "autogen-agentchat" "autogen-ext[openai,azure]"
```

```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Define a model client. You can use other model client that implements
# the `ChatCompletionClient` interface.
model_client = OpenAIChatCompletionClient(
    model="gpt-4o",
    # api_key="YOUR_API_KEY",
)


# Define a simple function tool that the agent can use.
# For this example, we use a fake weather tool for demonstration purposes.
async def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    return f"The weather in {city} is 73 degrees and Sunny."


# Define an AssistantAgent with the model, tool, system message, and reflection enabled.
# The system message instructs the agent via natural language.
agent = AssistantAgent(
    name="weather_agent",
    model_client=model_client,
    tools=[get_weather],
    system_message="You are a helpful assistant.",
    reflect_on_tool_use=True,
    model_client_stream=True,  # Enable streaming tokens from the model client.
)


# Run the agent and stream the messages to the console.
async def main() -> None:
    await Console(agent.run_stream(task="What is the weather in New York?"))


# NOTE: if running this inside a Python script you'll need to use asyncio.run(main()).
await main()
```

```{seealso} result
    ---------- user ----------
    What is the weather in New York?
    ---------- weather_agent ----------
    [FunctionCall(id='call_bE5CYAwB7OlOdNAyPjwOkej1', arguments='{"city":"New York"}', name='get_weather')]
    ---------- weather_agent ----------
    [FunctionExecutionResult(content='The weather in New York is 73 degrees and Sunny.', call_id='call_bE5CYAwB7OlOdNAyPjwOkej1', is_error=False)]
    ---------- weather_agent ----------
    The current weather in New York is 73 degrees and sunny.
```