# Agent Lifecyle

## Agent ID and LifeCycle
In last chapter we learned about messages, how using messages works well in case of we want to pass along different messages among different agents, with in same or distributed compute environment.

another important concept here is Agent ID.
What exactly is an Agent ID?

now since we defined Agent definitions and their abilities to handle different `type` of handles, now we need to build a mechanism which helps manage Agent life cycle, what that means, just like mentioned in previous code, we register agents to a run time environment, means, we attach agents to a run time environment based on assumption that since there may be thousands of agents, let;s leave invoking of Agents as per needed basis, and let run time alone create, maintain, remove Agent ID from runtime for efficiency.

but how will a run time locate an Agent?

we want to use Agent ID.

## Agent ID
Agent ID uniquely identifies an agent instance within an agent runtime – including distributed runtime. It is the “address” of the agent instance for receiving messages. It has two components: agent type and agent key.

Agent ID = (Agent Type, Agent Key)

## Agent Type

Agent Type is nothing but a type definition to define and Agent Identity.

just like when we were dealing with messages in previous chapter, we took advantage of Type definition.
similar to defining Message Type to take advantage of Message protocols, interfaces, Type definitions used in message handler decorator and message context object

The agent type is not an agent class. It associates an agent with a specific factory function, which produces instances of agents of the same agent type. For example, different factory functions can produce the same agent class but with different constructor parameters. The agent key is an instance identifier for the given agent type. Agent IDs can be converted to and from strings. the format of this string is:


Types and Keys are considered valid if they only contain alphanumeric letters (a-z) and (0-9), or underscores (_). A valid identifier cannot start with a number, or contain any spaces.

In a multi-agent application, agent types are typically defined directly by the application, i.e., they are defined in the application code. On the other hand, agent keys are typically generated given messages delivered to the agents, i.e., they are defined by the application data.

For example, a runtime has registered the agent type "code_reviewer" with a factory function producing agent instances that perform code reviews. Each code review request has a unique ID review_request_id to mark a dedicated session. In this case, each request can be handled by a new instance with an agent ID, ("code_reviewer", review_request_id).

## Agent Lifecycle

just for the reference, here is a diagram (ref: [AutoGen Documentation](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/agent-identity-and-lifecycle.html)) showing Agent Lifecycle.

![Agent Lifecycle](https://microsoft.github.io/autogen/stable/_images/agent-lifecycle.svg)

## Registering Agents


To make agents available to the runtime, developers can use the register() class method of the BaseAgent class. The process of registration associates an agent type, which is uniquely identified by a string, and a factory function that creates an instance of the agent type of the given class. The factory function is used to allow automatic creation of agent instances when they are needed.

Agent type (AgentType) is not the same as the agent class. In this example, the agent type is AgentType("my_agent") or AgentType("my_assistant") and the agent class is the Python class MyAgent or MyAssistantAgent. The factory function is expected to return an instance of the agent class on which the register() class method is invoked. Read Agent Identity and Lifecycles to learn more about agent type and identity.

```{note} note
just if you are wondering why we learned so much detail about Agent ID and Lifecycle is, because of sole reason that, Same Agents can br used across same or different runtime just by making use of different agent Type.

a Typical Agent ID  AgentType, key will help distinguish a specific instance of a given Agent invoke in a runtime, hence the reusability with going through complex OOPs encapdulation, inheritance and abstraction concepts.

Different agent types can be registered with factory functions that return the same agent class. For example, in the factory functions, variations of the constructor parameters can be used to create different instances of the same agent class.
```

To register our agent types with the SingleThreadedAgentRuntime, the following code can be used:

so based on this `register()` signature, it's important to register an Agent appropriately so that runtime would be able to invoke this Agent when needed.

```python
from autogen_core import SingleThreadedAgentRuntime

# create a standalong single thread runtime
runtime = SingleThreadedAgentRuntime()

# attach/register AI Agent to run time
await PTOAgent.register(runtime, "ERP_PTO_Agent", lambda: PTOAgent("T_E_PTOAgent"))
await TaskAgent.register(runtime, "ERP_Task_Agent", lambda: TaskAgent("T_E_TaskAgent"))
```

```{seealso} result
    AgentType(type='my_assistant')
```

Once an agent type is registered, we can send a direct message to an agent instance using an AgentId. The runtime will create the instance the first time it delivers a message to this instance.

## Executing Runtime

```python
runtime.start()  # Start processing messages in the background.
await runtime.send_message(MyMessageType("Hello, World!"), AgentId("my_agent", "default"))
await runtime.send_message(MyMessageType("Hello, World!"), AgentId("my_assistant", "default"))
await runtime.stop()  # Stop processing messages in the background.
```

```{seealso} result
    my_agent received message: Hello, World!
    my_assistant received message: Hello, World!
    my_assistant responded: Hello! How can I assist you today?
```


```python
# This will block until the runtime is idle
await runtime.stop_when_idle()
# This will close the runtime
await runtime.close()
```