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
## import AgentId
from autogen_core import RoutedAgent, message_handler, MessageContext, AgentId 
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str
    source: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    @message_handler(match=lambda msg, ctx: msg.source.startswith("Manager"))
    async def on_txt_message_1(self, message: PTOAgentMessages, ctx: MessageContext) -> None:
        # fetches available PTO for a given employee
        # give more tailored response for Manager
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
    
    @message_handler(match=lambda msg, ctx: msg.source.startswith("Employee"))
    async def on_txt_message_2(self, message: PTOAgentMessages, ctx: MessageContext) -> None:
        # fetches available PTO for a given employee
        # give more tailored response for Employee
        print(f"{self.id.type} received message: {message.content} from : {message.source}")

## handling Tasks
@dataclass
class TaskAgentMessages:
    content: str
    source: str

class TaskAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPTaskAgent")

    @message_handler(match=lambda msg, ctx: msg.source.startswith("Manager"))
    async def on_txt_message_1(self, message: TaskAgentMessages, ctx: MessageContext) -> None:
        # fetches tasks an employee
        # give more tailored response for Manager
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
    
    @message_handler(match=lambda msg, ctx: msg.source.startswith("Employee"))
    async def on_txt_message_2(self, message: TaskAgentMessages, ctx: MessageContext) -> None:
        # fetches tasks an employee
        # give more tailored response for Employee
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
```

Upon receiving a message, the `PTOAgent` or `TaskAgent` process the information based on message source and provide a tailored response.

## Direct Messaging from `runtime`

We can test these agents by sending a Message from One Agent to Another in `runtime`.

```python
from autogen_core import SingleThreadedAgentRuntime
runtime = SingleThreadedAgentRuntime()
await PTOAgent.register(runtime, "AgType_ERP_PTO_Agent", lambda: PTOAgent())
await TaskAgent.register(runtime, "AgType_ERP_Task_Agent", lambda: TaskAgent())

runtime.start()
await runtime.send_message(PTOAgentMessages("Query PTOs taken by Employee ID 512 in past 2 weeks.", "Employee"), AgentId("AgType_RP_PTO_Agent", "default"))
await runtime.send_message(PTOAgentMessages("Query PTOs taken by Employee ID 512 in past 2 weeks", "Manager"), AgentId("AgType_ERP_PTO_Agent", "default"))
await runtime.send_message(TaskAgentMessages("I need a list of all tasks assigned!", "Employee"), AgentId("AgType_ERP_Task_Agent", "default"))
await runtime.send_message(TaskAgentMessages("I need a list of all tasks assigned!", "Manager"), AgentId("AgType_ERP_Task_Agent", "default"))
```

```{seealso} result
    AgType_ERP_PTO_Agent received message: Query PTOs taken by Employee ID 512 in past 2 weeks. from : Employee
    AgType_ERP_PTO_Agent received message: Query PTOs taken by Employee ID 512 in past 2 weeks from : Manager
    AgType_ERP_Task_Agent received message: I need a list of all tasks assigned! from : Employee
    AgType_ERP_Task_Agent received message: I need a list of all tasks assigned! from : Manager
```
> The script above shows how to easily test messaging between agents and how to send messages from `runtime`.

## Direct Messaging from Agent

In the previous section, we saw how a runtime can send a message using `runtime.send_message()`.
Let's assume, `PTOAgent` also checks HR Policy for "sick leaves" before responding back to employee PTO approval request.

Let's add another `HRAgent` and register it to `runtime`.

>   stop the `runtime`.

```python
runtime.stop()
```

>   create new `HRAgent`.

```python
@dataclass
class HRAgentMessages:
    content: str
    source: str

class HRAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPHRAgent")

    @message_handler(match=lambda msg, ctx: msg.source.startswith("Manager"))
    async def on_txt_message_1(self, message: HRAgentMessages, ctx: MessageContext) -> None:
        # fetches HR Policy for time off
        # give more tailored response for Manager
        print(f"{self.id.type} HR Policy is 10 days max PTO in 1 year. received message: {message.content} from : {message.source}")
    
    @message_handler(match=lambda msg, ctx: msg.source.startswith("Employee"))
    async def on_txt_message_2(self, message: HRAgentMessages, ctx: MessageContext) -> None:
        # fetches HR Policy for time off
        # give more tailored response for Employee
        print(f"{self.id.type} HR Policy is 10 days max PTO in 1 year. received message: {message.content} from : {message.source}")
```

>   update `PTOAgent` to send a Direct message to `HRAgent`.

```python
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    @message_handler(match=lambda msg, ctx: msg.source.startswith("Manager"))
    async def on_txt_message_1(self, message: PTOAgentMessages, ctx: MessageContext) -> None:
        # fetches available PTO for a given employee
        # give more tailored response for Manager
        ########################################
        # send Direct message to HR Agent
        await self.send_message(HRAgentMessages("what is HR Policy for sick leave", "Employee"), 
                          AgentId("AgType_ERP_HR_Agent", "default"))
        ########################################
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
    
    @message_handler(match=lambda msg, ctx: msg.source.startswith("Employee"))
    async def on_txt_message_2(self, message: PTOAgentMessages, ctx: MessageContext) -> None:
        # fetches available PTO for a given employee
        # give more tailored response for Manager
        ########################################
        # send Direct message to HR Agent
        await self.send_message(HRAgentMessages("what is HR Policy for sick leave", "Employee"), 
                          AgentId("AgType_ERP_HR_Agent", "default"))
        ########################################
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
```

>   add all Agents to `runtime`.

```python
from autogen_core import SingleThreadedAgentRuntime
runtime = SingleThreadedAgentRuntime()

await PTOAgent.register(runtime, "AgType_ERP_PTO_Agent", lambda: PTOAgent())
await TaskAgent.register(runtime, "AgType_ERP_Task_Agent", lambda: TaskAgent())
await HRAgent.register(runtime, "AgType_ERP_HR_Agent", lambda: HRAgent())
```

>   start the `runtime`

```python
runtime.start()
```

>   Test if `PTOAgent` is receiving message from the `runtime` and `PTOAgent` is internally sending another `Direct Message` to `HRAgent`..

```python
await runtime.send_message(PTOAgentMessages("I need a list of all PTO available!", "Employee"), AgentId("AgType_ERP_PTO_Agent", "default"))
```

```{seealso} result
    AgType_ERP_HR_Agent HR Policy is 10 days max PTO in 1 year. received message: what is HR Policy for sick leave from : Employee
    AgType_ERP_PTO_Agent received message: I need a list of all PTO available! from : Employee
```

## When to use Direct Messaging
Direct messaging works best when the sender and receiver are closely connected, created together, and the sender targets a specific receiver. For instance, an agent sends messages to a ToolAgent to run tools and uses the replies to keep the process going.