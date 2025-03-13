# Runtime

## what is Runtime environment
In essence, think of a framework is a set of tools that supports a programming environment, often designed to solve business use cases or complete specific tasks. 

Within this environment, we create a `runtime environment` —a setup that allows a program to run and supports one or more AI agent actor models. 

These agents manage their own memory, state, and properties, and they interact with themselves, other agents, and external systems using messaging protocols.

```{mermaid}

flowchart TD
    subgraph AI_Agent1[AI Agent 1]
        direction TB
        State1[State]
    end

    subgraph AI_Agent2[AI Agent 2]
        direction TB
        State2[State]
    end

    RunTime[RunTime] -->|Perception: messages, sensor inputs| AI_Agent1
    RunTime[RunTime] -->|Perception: messages, sensor inputs| AI_Agent2
    AI_Agent1 -->|Actions: update state, send messages, execute code, interact with systems | RunTime
    AI_Agent2 -->|Actions: update state, send messages, execute code, interact with systems | RunTime

    style AI_Agent1 fill:#99FF33,stroke:#007BFF,stroke-width:2px
    style AI_Agent2 fill:#99FF33,stroke:#007BFF,stroke-width:2px
    style State1 fill:#FFFFFF,stroke:#007BFF,stroke-width:1px
    style State2 fill:#FFFFFF,stroke:#007BFF,stroke-width:1px
    style RunTime fill:#E6FFE6,stroke:#00CC00,stroke-width:2px
```

Now, since we have already created Agents, first step is to attach these AI Agents to this run time environment.
We call this process of attaching these AI Agents to a run time environment as registering Agents.

This is similar to invoking an AI Agent class object, however with the difference that, registering an AI Agent to one run environment makes is available for initializing anytime AI Agent is needed.

in other words, what it means is, just like when an create an Object of a class, i.e. instantiate a class object, you can call upon methods to update state of this object.
Here registering an AI Agent (which is an Actor model) to a run time environment has similar effect as initialization except the fact that,
run time environment doesn't actually invoke this Agent unless a message is called upon this Agent actor instance.

## new Runtime environment
```python
from autogen_core import SingleThreadedAgentRuntime

# create a standalong single thread runtime
runtime = SingleThreadedAgentRuntime()

print(PTOAgent.register().__doc__)
RoutedAgent.__dict__
```

```{seealso} result
```

## Running the Single-Threaded Agent Runtime

```python
runtime.start()
# ... Send messages, publish messages, etc.
await runtime.stop()  # This will return immediately but will not cancel
# any in-progress message handling.

runtime.start()
# ... Send messages, publish messages, etc.
await runtime.stop_when_idle()  # This will block until the runtime is idle.

await runtime.close()
```