# Broadcasting

> Messages are purely data, and should not contain any logic.

## Broadcast Messages

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

Suppose `ManagerAgent` approves a PTO request for `Employee ID 512`. After that, `PTOAgent` updates PTO records, `TaskAgent` adjusts task details, and `LLMAgent` notifies the team about the out-of-office status.

In the previous chapter, we learned how `PTOAgent`, `HRAgent`, and `TaskAgent` use `Direct Messages` to communicate. But in this case, since `LLMAgent` is sending out-of-office alerts to the team, it doesn’t need to use a `Direct Message` unless you want to write `send_message()` for every other agent in a `runtime`.

There are two types of communication in AutoGen core:

- Direct Messaging: sends a direct message to another agent.
- Broadcast: publishes a message to a topic.

For this case, a `Broadcast message` is better because no reply is needed, and it should reach most (not necessarily all) Agents.

## Broadcasting

AutoGen Core delivers a BroadCast API which helps broadcast messages to other agents based on the publish/subscribe model with topic and subscription.

Just to get our definitions and terminology correct, let's learn about few key terms

- Messages are purely data, and should not contain any logic. When A message is directed to an Agent is called a Direct Message and if a message is sent directed to every agent with in a said scope, is called Broadcasting a message.
- publish: act of sending message, whether direct or broadcast
- subscribe is applicable to those Agent(s) who wants to receive all broadcast messages

to implement Messages publish/subscribe model, we take help of Topic and Subscription design pattern.

## Topic
Just like we learned the concept of `Agent ID = (Agent Type, Agent Key)` in previous chapter, Topic is defined in similar pattern in a `runtime`.
A Topic defines to scope (intended audience) of a broadcast message available in a run time.

> Topic = (Topic Type, Topic Source)

In our use case, we can define `Topic Type = "Employee_TimeOff"` and `Topic Source = "Employee ID 512"`.

The main idea is to assume we want to notify all agents about a topic like `Employee_TimeOff` and allow some of these agents—though not necessarily all, who might find this information relevant and wish to take action based on it.

We will utilize our Topic/Subscription feature in the Broadcast API to transmit this message.

## Direct Message

So far, this is the complete code we wrote in the previous chapter. We explored examples of how to set up direct messaging between agents.

This code includes three agents: `PTOAgent`, `TaskAgent`, and `HRAgent`. 

> setup Agents Actor models

```python
## PTO Agent
from autogen_core import RoutedAgent, message_handler, MessageContext, AgentId 
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str
    source: str

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

## Task Agent
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

## HR Agent
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

## Subscriptions

Now, these are the changes I will make to the above code to demonstrate message broadcasting capabilities:
- Add subscriptions to `PTOAgent` and `TaskAgent`.
- Publish a Broadcast message as a topic from `PTOAgent`.
- `HRAgent` will take no action because it is not subscribed to the topic.
- `PTOAgent` will also take no action since it is the one publishing the message, preventing an infinite loop.
- `TaskAgent` will perform an action, such as updating project plans, etc.
- make sure Direct message is still working as before.
