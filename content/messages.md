# Messages

## Solution Design

As you can see, our business case involves evolving a solution design. A solution design pattern helps in understanding and managing the AI Agent framework implementation to support your business use case.

Currently, our agentic framework solution design includes the following agents:
- PTOAgent
- TaskAgent
- LLMAgent
- ManagerAgent
- HRAgent
- BroadcasterAgent

`Solution Design : Implementation`

```{mermaid}
sequenceDiagram
%% Adding a background box with light color
    rect rgba(200, 212, 223, 0.8)
        participant User
        participant LLMAgent
        participant PTOAgent
        participant TaskAgent
        participant HRAgent
        participant DecisionAgent
        participant ManagerAgent

        User->>LLMAgent: PTO request (e.g., for Alice, ID:512, next Thu-Fri)
        LLMAgent-->>LLMAgent: Identify dates and employee ID
        LLMAgent->>PTOAgent: Send employee ID and dates
        LLMAgent->>TaskAgent: Send employee ID and dates
        PTOAgent->>HRAgent: Check sick leave rules
        HRAgent-->>PTOAgent: Return policy info
        PTOAgent->>DecisionAgent: Send PTO info
        LLMAgent->>DecisionAgent: Send request details
        DecisionAgent-->>DecisionAgent: Process information
        alt Auto-approve
            DecisionAgent->>User: PTO approved
        else Send to manager
            DecisionAgent->>ManagerAgent: Forward PTO request
            ManagerAgent-->>ManagerAgent: Make decision
            ManagerAgent->>DecisionAgent: Return decision
            DecisionAgent->>User: PTO decision
        end
    end
```

Each agent exhibits specific behaviors in response to tasks. However, this design is not final, and we may need to add, update, or remove agents as the project progresses.

Even now, the workflow feels tedious, and it’s easy to imagine that as we incorporate additional supporting business processes, the number of agents could spiral into unmanageable chaos.

Let’s address a key issue in the design. The behavioral methods within the Routed Agents are essentially methods that react to data and ultimately alter the state or data of an agent based on the message or data received. To improve this, we need a more effective mechanism to manage incoming data—whether it’s from other agents or the agent’s own behavioral response to a task.

As a starting point, let’s refer to this incoming and outgoing data as `messages`. This terminology will help us better conceptualize the flow of information.
The next step is to implement a more efficient way to handle these `messages`, ensuring our agent framework remains scalable and manageable as it evolves.

## Messages Implementation

```python
from autogen_core import RoutedAgent
## Refactor - add dataclass to support message data types
from dataclasses import dataclass

## Refactor: add dataclass to support message data types
@dataclass
class PTOAgentMessages: ## add dataclass to support message data types
    content: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    def do_something(self, message: PTOAgentMessages) -> None:  ## add type def
        # fetches available PTO for a given employee
        print(f"received message: {message.content}") ## add type def

    def do_something_more(self, message: PTOAgentMessages) -> None:  ## add type def
        # udpate PTO for a given employee if approved
        print(f"received message: {message.content}") ## add type def
```

```python
from autogen_core import RoutedAgent
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str

## add another messageType 
## this is a huge step, type based message communication is one of the key features
@dataclass
class PTOAgentImageMessages:
    url: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    def do_something(self, message: PTOAgentMessages) -> None:
        # fetches available PTO for a given employee
        print(f"received message: {message.content}")

    def do_something_more(self, message: PTOAgentMessages) -> None:
        # udpate PTO for a given employee if approved
        print(f"received message: {message.content}")
    
    def do_something_with_document(self, message: PTOAgentImageMessages) -> None:
                                            ## added another messageType
        # udpate PTO for a given employee if approved
        print(f"received message: {message.url}")
```

```python
from autogen_core import RoutedAgent
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str
    source: str

@dataclass
class PTOAgentImageMessages:
    url: str
    source: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    def do_something(self, message: PTOAgentMessages) -> None:
        # fetches available PTO for a given employee
        print(f"received message: {message.content} from : {message.source}")
                                                        ## print message source

    def do_something_more(self, message: PTOAgentMessages) -> None:
        # udpate PTO for a given employee if approved
        print(f"received message: {message.content} from : {message.source}")
                                                        ## print message source
    
    def do_something_with_document(self, message: PTOAgentImageMessages) -> None:
        # udpate PTO for a given employee if approved
        print(f"received message: {message.url} from : {message.source}")
                                                        ## print message source
```

```python
from autogen_core import RoutedAgent
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str
    source: str

@dataclass
class PTOAgentImageMessages:
    url: str
    source: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    def on_txt_message_1(self, message: PTOAgentMessages) -> None: ## rename method
        # fetches available PTO for a given employee
        print(f"received message: {message.content} from : {message.source}")

    def on_txt_message_2(self, message: PTOAgentMessages) -> None: ## rename method
        # udpate PTO for a given employee if approved
        print(f"received message: {message.content} from : {message.source}")
    
    def on_doc_message(self, message: PTOAgentImageMessages) -> None: ## rename method
        # udpate PTO for a given employee if approved
        print(f"received message: {message.url} from : {message.source}")
```

If you pay close attention to this code, you’ll notice that defining separate methods like `on_txt_message_1` and `on_txt_message_2` is not good practice. However, since we need two distinct methods to perform different tasks, we can refactor the code to call the appropriate method based on the message type.

```python
# refactor above code to use AutoGen Core framework
# refactor above code to create use base

from autogen_core import RoutedAgent
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str
    source: str

@dataclass
class PTOAgentImageMessages:
    url: str
    source: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

## Refactor code to act on message Type def
    def on_txt_messages(self, message: PTOAgentMessages):
        if message.source.startswith("Manager"):
            def on_txt_message_1(self, message: PTOAgentMessages) -> None:
                # fetches available PTO for a given employee
                print(f"received message: {message.content} from : {message.source}")
        else:
            def on_txt_message_2(self, message: PTOAgentMessages) -> None:
                # udpate PTO for a given employee if approved
                print(f"received message: {message.content} from : {message.source}")
    
    def on_doc_message(self, message: PTOAgentImageMessages) -> None:
        # udpate PTO for a given employee if approved
        print(f"received message: {message.url} from : {message.source}")
```

The agent implementation above seems fine to me; however, there’s still one unresolved issue. While we can refactor our other agents (e.g., TaskAgent, LLMAgent, etc.), we haven’t fully addressed the message communication problem.

All these messages are essentially behavioral methods of the Agent class. What we need are asynchronous methods. 

The reason is that, in a real-world scenario, thousands of users will access this same Agent Framework with different datasets. Creating numerous instances or objects of these agents across many threads is still manageable, but these methods need to be asynchronous.

For example, one agent might be performing deep research, while others are handling simple LLM inferences or accessing API results. Managing these as asynchronous data operations would be far more efficient.

To achieve this, I have a choice: I can start implementing `asyncio` and make these methods `async`. Let’s go back to the `AutoGen Core` and explore how we can leverage pre-existing code to refactor this implementation and make these operations asynchronous.

```python
from autogen_core import RoutedAgent, message_handler ## import message handler for async
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str
    source: str

@dataclass
class PTOAgentImageMessages:
    url: str
    source: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    @message_handler ## add async
    async def on_txt_messages(self, message: PTOAgentMessages): ## add async
        if message.source.startswith("Manager"):
            async def on_txt_message_1(self, message: PTOAgentMessages) -> ## add async
                # fetches available PTO for a given employee
                print(f"received message: {message.content} from : {message.source}")
        else:
            async def on_txt_message_2(self, message: PTOAgentMessages) -> ## add async
                # udpate PTO for a given employee if approved
                print(f"received message: {message.content} from : {message.source}")
    
    @message_handler ## add async
    async def on_doc_message(self, message: PTOAgentImageMessages) -> ## add async
        # udpate PTO for a given employee if approved
        print(f"received message: {message.url} from : {message.source}")
```

There’s still one small improvement we can make to this code to enhance its efficiency.

Instead of using an `if:else` statement inside the `txt_messages` method, we can leverage the `message handler` decorator directly.

Another benefit of this approach is that agents passing messages to each other won’t need to know the specific methods. The message handler will automatically process the messages and call the appropriate method based on the message type itself.

```python
from autogen_core import RoutedAgent, message_handler,
                 MessageContext ## import message context
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str
    source: str

@dataclass
class PTOAgentImageMessages:
    url: str
    source: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    ## add message type handler using match
    @message_handler(match=lambda msg, ctx: msg.source.startswith("Manager"))
    ## add message context
    async def on_txt_message_1(self, message: PTOAgentMessages, ctx: MessageContext) -> None:
        # fetches available PTO for a given employee
        print(f"received message: {message.content} from : {message.source}")
    
    ## add message type handler using match
    @message_handler(match=lambda msg, ctx: msg.source.startswith("Employee"))
    ## add message context
    async def on_txt_message_2(self, message: PTOAgentMessages, ctx: MessageContext) -> None:
        # udpate PTO for a given employee if approved
        print(f"received message: {message.content} from : {message.source}")
    
    @message_handler
    ## add message context
    async def on_doc_message(self, message: PTOAgentImageMessages, ctx: MessageContext) -> None:
        # udpate PTO for a given employee if approved
        print(f"received message: {message.url} from : {message.source}")
```

Let’s add one more feature called Agent ID. For now, think of Agent ID as a simple identifier. It’s a broader concept, and we’ll explore it in more detail in a later section. For the time being, let’s just consider Agent ID as an identifier.

```python
## import AgentId
from autogen_core import RoutedAgent, message_handler, MessageContext, AgentId 
from dataclasses import dataclass

@dataclass
class PTOAgentMessages:
    content: str
    source: str

@dataclass
class PTOAgentImageMessages:
    url: str
    source: str

from autogen_core import RoutedAgent
class PTOAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPPTOAgent")

    @message_handler(match=lambda msg, ctx: msg.source.startswith("Manager"))
    async def on_txt_message_1(self, message: PTOAgentMessages, ctx: MessageContext) -> None:
        # fetches available PTO for a given employee
         ## added agent ID
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
    
    @message_handler(match=lambda msg, ctx: msg.source.startswith("Employee"))
    async def on_txt_message_2(self, message: PTOAgentMessages, ctx: MessageContext) -> None:
        # udpate PTO for a given employee if approved
         ## added agent ID
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
    
    @message_handler
    async def on_doc_message(self, message: PTOAgentImageMessages, ctx: MessageContext) -> None:
        # udpate PTO for a given employee if approved
         ## added agent ID
        print(f"{self.id.type} received message: {message.url} from : {message.source}")
```

now we have a complete Agent implementation, but we need to create more such agents.

- PTOAgent
- TaskAgent
- LLMAgent
- ManagerAgent
- HRAgent
- BroadcasterAgent

for the sake of simplicity, for now, let's just focus on one more agent, say TaskAgent, we will deal with LLM Type agents later.
Let's build Task Agent.

```python
from autogen_core import RoutedAgent, message_handler, MessageContext, AgentId
from dataclasses import dataclass

@dataclass
class TaskAgentMessages:
    content: str
    source: str

@dataclass
class TaskAgentImageMessages:
    url: str
    source: str

from autogen_core import RoutedAgent
class TaskAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPTaskAgent")

    @message_handler(match=lambda msg, ctx: msg.source.startswith("Manager"))
    async def on_txt_message_1(self, message: TaskAgentMessages, ctx: MessageContext) -> None:
        # fetches tasks an employee
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
    
    @message_handler(match=lambda msg, ctx: msg.source.startswith("Employee"))
    async def on_txt_message_2(self, message: TaskAgentMessages, ctx: MessageContext) -> None:
        # poeple working on one task 
        print(f"{self.id.type} received message: {message.content} from : {message.source}")
    
    @message_handler
    async def on_doc_message(self, message: TaskAgentImageMessages, ctx: MessageContext) -> None:
        # fetch all other teams working on same tasks and their PTO during same period
        print(f"{self.id.type} received message: {message.url} from : {message.source}")
```