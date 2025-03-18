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

Let's say `ManagerAgent` approves a PTO request for `Employee ID 512`. Then, `PTOAgent` updates PTO data, `TaskAgent` updates task data, `LLMAgent` sends out-of-office alerts to the team, and `AnotherAgent` has no tasks.

There are two types of communication in AutoGen core:

- Direct Messaging: sends a direct message to another agent.
- Broadcast: publishes a message to a topic.

For this case, a `Broadcast message` is better because no reply is needed, and it should reach most (but not necessarily all) Agents.

## Broadcasting

AutoGen Core delivered a BroadCast API which helps broadcast messages to other agents based on the publish/subscribe model with topic and subscription.

Just to get our definitions and terminology correct, let's learn about few key terms

- Messages are purely data, and should not contain any logic. When A message is directed to an Agent is called a Direct Message and if a message is sent directed to every agent with in a said scope, is called Broadcasting a message.
- publish: act of sending message, whether direct or broadcast
- subscribe is applicable to those Agent(s) who wants to receive all broadcast messages

to implement Messages publish/subscribe model, we take help of Topic and Subscription design pattern.

## Topic
Just like we learned the concept of `Agent ID = (Agent Type, Agent Key)` in previous chapter, Topic is defined in similar pattern in a `runtime`.
A Topic defines to scope (intended audience) of a broadcast message available in a run time.

> Topic = (Topic Type, Topic Source)

So in our use case, we can say, `Topic Type = "Employee_TimeOFF"` and `Topic Source = "Employee ID 512"`.
So the whole idea is, assume we want to alert all agents about a topic such as "Employee_TimeOFF" and let's all most (but not necessarily all) Agents, who may find this information relevant and want to act on this information.

Now we will use our Topic/Subscription in Broadcast API to send this message. Th

## Subscription Model

So essentially, A subscription maps topic to agent IDs.'

`Ref: AutoGen Documentation`
![Subscription](https://microsoft.github.io/autogen/stable/_images/subscription.svg)

## Type based Subscription

Another important concept to learn here is Type based Subscription.

So in our use case, we can say, `Topic Type = "Employee_TimeOFF"` and `Topic Source = "Employee ID 512"`.
So the whole idea is, assume we want to alert all agents about a topic such as "Employee_TimeOFF" and let's all most (but not necessarily all) Agents, who may find this information relevant and want to act on this information.

in this use case, we can make use of Type based subscription, which means in simple terms that, messages subscribed by agents (certain Agent Type) is entirely depends on Topic Type.

> Type-Based Subscription = Topic Type –> Agent Type

For instance, in this case, only agents of AgentType="myPTOAgent", AgentType="myTaskAgent", AgentType="myLLMAgent" care to subscribe to this type.

The advantage of using this approach is, while we broadcast messages, it doesn't mean all agents needs to receive that.
We can make use Topic Type and Agent Type, to take advantage of Broadcasting API and still restrict our messages based on Topic Type to send to only certain Agent Type.

---

![Topic](https://microsoft.github.io/autogen/stable/_images/type-subscription-single-tenant-single-topic.svg)
![Topic](https://microsoft.github.io/autogen/stable/_images/type-subscription-single-tenant-multiple-topics.svg)
![Topic](https://microsoft.github.io/autogen/stable/_images/type-subscription-multi-tenant.svg)

Let's see this in action.

## Broadcast

Broadcast is effectively the publish/subscribe model with topic and subscription. Read Topic and Subscription to learn the core concepts.

The key difference between direct messaging and broadcast is that broadcast cannot be used for request/response scenarios. When an agent publishes a message it is one way only, it cannot receive a response from any other agent, even if a receiving agent’s handler returns a value.

Note

If a response is given to a published message, it will be thrown away.

Note

If an agent publishes a message type for which it is subscribed it will not receive the message it published. This is to prevent infinite loops.


## Subscribe and Publish to Topics

Type-based subscription maps messages published to topics of a given topic type to agents of a given agent type. To make an agent that subclasses RoutedAgent subscribe to a topic of a given topic type, you can use the type_subscription() class decorator.

The following example shows a ReceiverAgent class that subscribes to topics of "default" topic type using the type_subscription() decorator. and prints the received messages.

```python
from autogen_core import RoutedAgent, message_handler, type_subscription


@type_subscription(topic_type="default")
class ReceivingAgent(RoutedAgent):
    @message_handler
    async def on_my_message(self, message: Message, ctx: MessageContext) -> None:
        print(f"Received a message: {message.content}")
```

To publish a message from an agent’s handler, use the publish_message() method and specify a TopicId. This call must still be awaited to allow the runtime to schedule delivery of the message to all subscribers, but it will always return None. If an agent raises an exception while handling a published message, this will be logged but will not be propagated back to the publishing agent.

The following example shows a BroadcastingAgent that publishes a message to a topic upon receiving a message.

```python
from autogen_core import TopicId


class BroadcastingAgent(RoutedAgent):
    @message_handler
    async def on_my_message(self, message: Message, ctx: MessageContext) -> None:
        await self.publish_message(
            Message("Publishing a message from broadcasting agent!"),
            topic_id=TopicId(type="default", source=self.id.key),
        )
```

BroadcastingAgent publishes message to a topic with type "default" and source assigned to the agent instance’s agent key.

Subscriptions are registered with the agent runtime, either as part of agent type’s registration or through a separate API method. Here is how we register TypeSubscription for the receiving agent with the type_subscription() decorator, and for the broadcasting agent without the decorator.

```python
from autogen_core import TypeSubscription

runtime = SingleThreadedAgentRuntime()

# Option 1: with type_subscription decorator
# The type_subscription class decorator automatically adds a TypeSubscription to
# the runtime when the agent is registered.
await ReceivingAgent.register(runtime, "receiving_agent", lambda: ReceivingAgent("Receiving Agent"))

# Option 2: with TypeSubscription
await BroadcastingAgent.register(runtime, "broadcasting_agent", lambda: BroadcastingAgent("Broadcasting Agent"))
await runtime.add_subscription(TypeSubscription(topic_type="default", agent_type="broadcasting_agent"))

# Start the runtime and publish a message.
runtime.start()
await runtime.publish_message(
    Message("Hello, World! From the runtime!"), topic_id=TopicId(type="default", source="default")
)
await runtime.stop_when_idle()
```

```{seealso} result
Received a message: Hello, World! From the runtime!
Received a message: Publishing a message from broadcasting agent!
```

As shown in the above example, you can also publish directly to a topic through the runtime’s publish_message() method without the need to create an agent instance.

From the output, you can see two messages were received by the receiving agent: one was published through the runtime, and the other was published by the broadcasting agent.

## Default Topic and Subscriptions

In the above example, we used TopicId and TypeSubscription to specify the topic and subscriptions respectively. This is the appropriate way for many scenarios. However, when there is a single scope of publishing, that is, all agents publish and subscribe to all broadcasted messages, we can use the convenience classes DefaultTopicId and default_subscription() to simplify our code.

DefaultTopicId is for creating a topic that uses "default" as the default value for the topic type and the publishing agent’s key as the default value for the topic source. default_subscription() is for creating a type subscription that subscribes to the default topic. We can simplify BroadcastingAgent by using DefaultTopicId and default_subscription().

```python
from autogen_core import DefaultTopicId, default_subscription


@default_subscription
class BroadcastingAgentDefaultTopic(RoutedAgent):
    @message_handler
    async def on_my_message(self, message: Message, ctx: MessageContext) -> None:
        # Publish a message to all agents in the same namespace.
        await self.publish_message(
            Message("Publishing a message from broadcasting agent!"),
            topic_id=DefaultTopicId(),
        )
```

When the runtime calls register() to register the agent type, it creates a TypeSubscription whose topic type uses "default" as the default value and agent type uses the same agent type that is being registered in the same context.

```python
runtime = SingleThreadedAgentRuntime()
await BroadcastingAgentDefaultTopic.register(
    runtime, "broadcasting_agent", lambda: BroadcastingAgentDefaultTopic("Broadcasting Agent")
)
await ReceivingAgent.register(runtime, "receiving_agent", lambda: ReceivingAgent("Receiving Agent"))
runtime.start()
await runtime.publish_message(Message("Hello, World! From the runtime!"), topic_id=DefaultTopicId())
await runtime.stop_when_idle()
```

```{seealso} result
Received a message: Hello, World! From the runtime!
Received a message: Publishing a message from broadcasting agent!
```