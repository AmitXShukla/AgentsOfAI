# Output

## Running an Agent in a Loop

The AssistantAgent executes one step at a time: one model call, followed by one tool call (or parallel tool calls), and then an optional reflection.

To run it in a loop, for example, running it until it stops producing tool calls, please refer to Single-Agent Team.

## Structured Output

Structured output allows models to return structured JSON text with pre-defined schema provided by the application. Different from JSON-mode, the schema can be provided as a Pydantic BaseModel class, which can also be used to validate the output.

Note

Structured output is only available for models that support it. It also requires the model client to support structured output as well. Currently, the OpenAIChatCompletionClient and AzureOpenAIChatCompletionClient support structured output.

Structured output is also useful for incorporating Chain-of-Thought reasoning in the agent’s responses. See the example below for how to use structured output with the assistant agent.

```python
from typing import Literal

from pydantic import BaseModel


# The response format for the agent as a Pydantic base model.
class AgentResponse(BaseModel):
    thoughts: str
    response: Literal["happy", "sad", "neutral"]


# Create an agent that uses the OpenAI GPT-4o model with the custom response format.

model_client = OpenAIChatCompletionClient(
    model="gpt-4o",
    response_format=AgentResponse,  # type: ignore
)
agent = AssistantAgent(
    "assistant",
    model_client=model_client,
    system_message="Categorize the input as happy, sad, or neutral following the JSON format.",
)

await Console(agent.run_stream(task="I am happy."))
```

```{seealso} result
---------- user ----------
I am happy.
---------- assistant ----------
{"thoughts":"The user explicitly states that they are happy.","response":"happy"}

TaskResult(messages=[TextMessage(source='user', models_usage=None, content='I am happy.', type='TextMessage'), TextMessage(source='assistant', models_usage=RequestUsage(prompt_tokens=89, completion_tokens=18), content='{"thoughts":"The user explicitly states that they are happy.","response":"happy"}', type='TextMessage')], stop_reason=None)
```

## Streaming Tokens

You can stream the tokens generated by the model client by setting model_client_stream=True. This will cause the agent to yield ModelClientStreamingChunkEvent messages in on_messages_stream() and run_stream().

The underlying model API must support streaming tokens for this to work. Please check with your model provider to see if this is supported.

```python
model_client = OpenAIChatCompletionClient(model="gpt-4o")

streaming_assistant = AssistantAgent(
    name="assistant",
    model_client=model_client,
    system_message="You are a helpful assistant.",
    model_client_stream=True,  # Enable streaming tokens.
)

## Use an async function and asyncio.run() in a script.

async for message in streaming_assistant.on_messages_stream(  # type: ignore
    [TextMessage(content="Name two cities in South America", source="user")],
    cancellation_token=CancellationToken(),
):
    print(message)
```

```{seealso} result
source='assistant' models_usage=None content='Two' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' cities' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' in' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' South' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' America' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' are' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' Buenos' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' Aires' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' in' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' Argentina' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' and' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' São' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' Paulo' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' in' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' Brazil' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content='.' type='ModelClientStreamingChunkEvent'
Response(chat_message=TextMessage(source='assistant', models_usage=RequestUsage(prompt_tokens=0, completion_tokens=0), content='Two cities in South America are Buenos Aires in Argentina and São Paulo in Brazil.', type='TextMessage'), inner_messages=[])
```

You can see the streaming chunks in the output above. The chunks are generated by the model client and are yielded by the agent as they are received. The final response, the concatenation of all the chunks, is yielded right after the last chunk.

Similarly, run_stream() will also yield the same streaming chunks, followed by a full text message right after the last chunk.

```python
async for message in streaming_assistant.run_stream(task="Name two cities in North America."):  # type: ignore
    print(message)
```

```{seealso} result
source='user' models_usage=None content='Name two cities in North America.' type='TextMessage'
source='assistant' models_usage=None content='Two' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' cities' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' in' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' North' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' America' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' are' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' New' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' York' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' City' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' in' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' the' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' United' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' States' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' and' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' Toronto' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' in' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content=' Canada' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=None content='.' type='ModelClientStreamingChunkEvent'
source='assistant' models_usage=RequestUsage(prompt_tokens=0, completion_tokens=0) content='Two cities in North America are New York City in the United States and Toronto in Canada.' type='TextMessage'
TaskResult(messages=[TextMessage(source='user', models_usage=None, content='Name two cities in North America.', type='TextMessage'), TextMessage(source='assistant', models_usage=RequestUsage(prompt_tokens=0, completion_tokens=0), content='Two cities in North America are New York City in the United States and Toronto in Canada.', type='TextMessage')], stop_reason=None)
```

## Using Model Context

AssistantAgent has a model_context parameter that can be used to pass in a ChatCompletionContext object. This allows the agent to use different model contexts, such as BufferedChatCompletionContext to limit the context sent to the model.

By default, AssistantAgent uses the UnboundedChatCompletionContext which sends the full conversation history to the model. To limit the context to the last n messages, you can use the BufferedChatCompletionContext.

```python
from autogen_core.model_context import BufferedChatCompletionContext

# Create an agent that uses only the last 5 messages in the context to generate responses.
agent = AssistantAgent(
    name="assistant",
    model_client=model_client,
    tools=[web_search],
    system_message="Use tools to solve tasks.",
    model_context=BufferedChatCompletionContext(buffer_size=5),  # Only use the last 5 messages in the context.
)
```