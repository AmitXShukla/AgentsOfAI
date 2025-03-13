# Broadcasting

## Broadcast

Broadcast is effectively the publish/subscribe model with topic and subscription. Read Topic and Subscription to learn the core concepts.

The key difference between direct messaging and broadcast is that broadcast cannot be used for request/response scenarios. When an agent publishes a message it is one way only, it cannot receive a response from any other agent, even if a receiving agent’s handler returns a value.

Note

If a response is given to a published message, it will be thrown away.

Note

If an agent publishes a message type for which it is subscribed it will not receive the message it published. This is to prevent infinite loops.
Subscribe and Publish to Topics

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
Default Topic and Subscriptions

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