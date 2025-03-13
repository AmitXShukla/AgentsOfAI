# Direct Messages

There are two types of communication in AutoGen core:

- Direct Messaging: sends a direct message to another agent.
- Broadcast: publishes a message to a topic.

Let’s first look at direct messaging. To send a direct message to another agent, within a message handler use the AutoGen core.BaseAgent.send_message() method, from the runtime use the AutoGen _core.AgentRuntime.send_message() method. Awaiting calls to these methods will return the return value of the receiving agent’s message handler. When the receiving agent’s handler returns None, None will be returned.

Note

If the invoked agent raises an exception while the sender is awaiting, the exception will be propagated back to the sender.

## Request/Response

Direct messaging can be used for request/response scenarios, where the sender expects a response from the receiver. The receiver can respond to the message by returning a value from its message handler. You can think of this as a function call between agents.

For example, consider the following agents:

```python
from dataclasses import dataclass

from autogen_core import MessageContext, RoutedAgent, SingleThreadedAgentRuntime, message_handler


@dataclass
class Message:
    content: str


class InnerAgent(RoutedAgent):
    @message_handler
    async def on_my_message(self, message: Message, ctx: MessageContext) -> Message:
        return Message(content=f"Hello from inner, {message.content}")


class OuterAgent(RoutedAgent):
    def __init__(self, description: str, inner_agent_type: str):
        super().__init__(description)
        self.inner_agent_id = AgentId(inner_agent_type, self.id.key)

    @message_handler
    async def on_my_message(self, message: Message, ctx: MessageContext) -> None:
        print(f"Received message: {message.content}")
        # Send a direct message to the inner agent and receives a response.
        response = await self.send_message(Message(f"Hello from outer, {message.content}"), self.inner_agent_id)
        print(f"Received inner response: {response.content}")
```

Upon receiving a message, the OuterAgent sends a direct message to the InnerAgent and receives a message in response.

We can test these agents by sending a Message to the OuterAgent.

```python
runtime = SingleThreadedAgentRuntime()
await InnerAgent.register(runtime, "inner_agent", lambda: InnerAgent("InnerAgent"))
await OuterAgent.register(runtime, "outer_agent", lambda: OuterAgent("OuterAgent", "inner_agent"))
runtime.start()
outer_agent_id = AgentId("outer_agent", "default")
await runtime.send_message(Message(content="Hello, World!"), outer_agent_id)
await runtime.stop_when_idle()
```

```{seealso} result
    Received message: Hello, World!
    Received inner response: Hello from inner, Hello from outer, Hello, World!
```

Both outputs are produced by the OuterAgent’s message handler, however the second output is based on the response from the InnerAgent.

Generally speaking, direct messaging is appropriate for scenarios when the sender and recipient are tightly coupled – they are created together and the sender is linked to a specific instance of the recipient. For example, an agent executes tool calls by sending direct messages to an instance of ToolAgent, and uses the responses to form an action-observation loop.