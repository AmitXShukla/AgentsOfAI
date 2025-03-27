# Agent

Now, we have a decision to make, either we can continue developing our own version of AI Agentic implementation or instead of re-inventing the wheel, start using an given AI Agent framework capabilities.

```{warning}
Please see, I will continously make many mistakes, write poor code, only to learn from it and refactor it as I learn.
```

## Standalone Implementation
```python
# standalone implementation of an AI Agent

class MyFirstAgent():
    def __init__(self) -> None:
        super().__init__()

    def do_something(self, message: str) -> None:
        print(f"received message: {message}")

FirstAgent = MyFirstAgent()
FirstAgent.do_something("Hello World!")
```

```{seealso} result
    received message: Hello World!
```

## Use Case

To learn more about AI Agent implementation, Instead of building a `TODO-List Tutorial`, let's focus on automating our HR Time Sheet process with AI Agents.

```{mermaid}
flowchart LR
    subgraph "PTO Request Process"
        A((Start)) --> B[Calculate dates]
        B --> C[Check PTO balance]
        C --> D[Submit PTO request]
        D --> E[Manager reviews PTO request]
        E --> F[Check team availability]
        F --> G[Approve PTO request]
        G --> H[Send notifications]
        H --> I((End))
    end
    subgraph "AI Agent Communication"
        Agent1[AI Agent 1: SQL Ops] -- "direct exchange" --> Agent2[AI Agent 2: Docs Proc]
        Agent2 -- "direct exchange" --> Agent1
        Agent1 -- "broadcast" --> Broadcast[Broadcast Channel]
        Agent2 -- "broadcast" --> Broadcast
        Broadcast -- "notify" --> OtherAgents[Other Agents]
    end
    style A fill:#e0f7fa,stroke:#000
    style B fill:#f1f8e9,stroke:#000
    style C fill:#e0f7fa,stroke:#000
    style D fill:#f1f8e9,stroke:#000
    style E fill:#e0f7fa,stroke:#000
    style F fill:#f1f8e9,stroke:#000
    style G fill:#e0f7fa,stroke:#000
    style H fill:#f1f8e9,stroke:#000
    style I fill:#e0f7fa,stroke:#000
    style Agent1 fill:#e0f7fa,stroke:#000
    style Agent2 fill:#e0f7fa,stroke:#000
    style Broadcast fill:#f1f8e9,stroke:#000
    style OtherAgents fill:#e0f7fa,stroke:#000
```
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

## Routed Agent
```python
# refactor above code to use AutoGen Core framework
from autogen_core import RoutedAgent        ## import AutoGen Core
class MyFirstAgent(RoutedAgent):            ## pass RoutedAgent as base class
    def __init__(self) -> None:
        super().__init__("MyFirstAgent")    ## Agent Description

    def do_something(self, message: str) -> None:
        print(f"received message: {message}")

## commented below code because RoutedAgent 
## are instantiated via runtime not standalone
## will see how to instantiate Agent class later

# FirstAgent = MyFirstAgent()
# FirstAgent.do_something("Hello World!")

## what is RoutedAgent class?
## take some time to understand super class Agent initialization
## read RoutedAgent base class implemenation signature
## what are the advantages of using this
RoutedAgent.__dict__
```

```{seealso} result
    mappingproxy({'__module__': 'autogen_core._routed_agent',
              '__doc__': 'A base class for agents that route messages to handlers based on the type of the message\n    and optional matching functions.\n\n    To create a routed agent, subclass this class and add message handlers as methods decorated with\n    either :func:`event` or :func:`rpc` decorator.\n\n    Example:\n\n    .. code-block:: python\n\n        from dataclasses import dataclass\n        from autogen_core import MessageContext\n        from autogen_core import RoutedAgent, event, rpc\n\n\n        @dataclass\n        class Message:\n            pass\n\n\n        @dataclass\n        class MessageWithContent:\n            content: str\n\n\n        @dataclass\n        class Response:\n            pass\n\n\n        class MyAgent(RoutedAgent):\n            def __init__(self):\n                super().__init__("MyAgent")\n\n            @event\n            async def handle_event_message(self, message: Message, ctx: MessageContext) -> None:\n                assert ctx.topic_id is not None\n                await self.publish_message(MessageWithContent("event handled"), ctx.topic_id)\n\n            @rpc(match=lambda message, ctx: message.content == "special")  # type: ignore\n            async def handle_special_rpc_message(self, message: MessageWithContent, ctx: MessageContext) -> Response:\n                return Response()\n    ',
              '__init__': <function autogen_core._routed_agent.RoutedAgent.__init__(self, description: str) -> None>,
              'on_message_impl': <function autogen_core._routed_agent.RoutedAgent.on_message_impl(self, message: Any, ctx: autogen_core._message_context.MessageContext) -> typing.Any | None>,
              'on_unhandled_message': <function autogen_core._routed_agent.RoutedAgent.on_unhandled_message(self, message: Any, ctx: autogen_core._message_context.MessageContext) -> None>,
              '_discover_handlers': <classmethod(<function RoutedAgent._discover_handlers at 0x727070171440>)>,
              '_handles_types': <classmethod(<function RoutedAgent._handles_types at 0x7270701714e0>)>,
              '__parameters__': (),
              '_is_protocol': False,
              '__subclasshook__': <classmethod(<function _proto_hook at 0x72707d09a700>)>,
              'internal_extra_handles_types': [],
              'internal_unbound_subscriptions_list': [],
              '__abstractmethods__': frozenset(),
              '_abc_impl': <_abc._abc_data at 0x727070de2500>})
```

```python
from autogen_core import RoutedAgent

class TaskAgent(RoutedAgent): ## change Agent Name
    def __init__(self) -> None:
        super().__init__("ERPTaskAgent")

    ## add methods
    def do_something(self, message: str) -> None: ## Refactor
        # fetches tasks an employee        ## Refactor
        print(f"received message: {message}") ## Refactor

    def do_something_more(self, message: str) -> None:## Refactor
        # poeple working on one task   ## Refactor
        print(f"received message: {message}")        ## Refactor

    def do_something_even_more(self, message: str) -> None: ## Refactor
        # approved PTOs for employee   ## Refactor
        # fetch all other teams working on same tasks
        # and their PTO during same period## Refactor
        print(f"received message: {message}")        ## Refactor
```

```python
from autogen_core import RoutedAgent

class LLMAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPLLMAgent")

    def do_something(self, message: str) -> None:
        # figure out Thursday and Friday date
        print(f"received message: {message}")

    def do_something_more(self, message: str) -> None:
        # draft an approval request to manager
        print(f"received message: {message}")

    def do_something_even_more(self, message: str) -> None:
        # greets and chat with Susan
        print(f"received message: {message}")
    
    def do_something_even_more(self, message: str) -> None:
        # call next agent once
        print(f"received message: {message}")


class ManagerAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPMgrAgent")

    def do_something(self, message: str) -> None:
        # approve or disapprove PTO
        print(f"received message: {message}")

    def do_something_more(self, message: str) -> None:
        # draft an approval request to manager
        print(f"received message: {message}")

class BroadcasterAgent(RoutedAgent):
    def __init__(self) -> None:
        super().__init__("ERPBrdAgent")

    def do_something(self, message: str) -> None:
        # notify all employee that Susan is taking PTO
        print(f"received message: {message}")

    def do_something_more(self, message: str) -> None:
        # draft an approval request to manager
        print(f"received message: {message}")
```