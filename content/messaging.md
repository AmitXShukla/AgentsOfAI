# Message & Communication

> Messages are purely data, and should not contain any logic.

## Messages

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

Suppose, in above use case, `ManagerAgent` needs to check PTO availability and tasks for `Employee ID 512`.

There are two types of communication in AutoGen core:

- Direct Messaging: sends a direct message to another agent.
- Broadcast: publishes a message to a topic.

For the above use case, sending a `Direct message` to `TaskAgent` and `PTOAgent` to get the details, seems more appropriate.

## Direct Messages

For the said purpose, we can make use of Direct messaging to fetch required information.

There are two primary ways to send a direct message.

- To send a direct message to another agent, while with in a message handler, use `agent.send_message()`.
- To send a direct message From the runtime, use `runtime.send_message()`.

The method returns the receiving agent's handler value, or None if the handler returns None.

## Request/Response

Direct messaging can be used for request/response scenarios, where the sender expects a response from the receiver. The receiver can respond to the message by returning a value from its message handler. You can think of this as a function call between agents.

Let's write the code to send `Direct Message` between agents to fetch this information.

>   `ManagerAgent` needs to check PTO availability and tasks for `Employee ID 512`.

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