# Agent Chat Team

Teams

In this section you’ll learn how to create a multi-agent team (or simply team) using AutoGen. A team is a group of agents that work together to achieve a common goal.

We’ll first show you how to create and run a team. We’ll then explain how to observe the team’s behavior, which is crucial for debugging and understanding the team’s performance, and common operations to control the team’s behavior.

Note

When should you use a team? Teams are for complex tasks that require collaboration and diverse expertise. However, they also demand more scaffolding to steer compared to single agents. While AutoGen simplifies the process of working with teams, start with a single agent for simpler tasks, and transition to a multi-agent team when a single agent proves inadequate. Ensure that you have optimized your single agent with the appropriate tools and instructions before moving to a team-based approach.
Creating a Team

RoundRobinGroupChat is a simple yet effective team configuration where all agents share the same context and take turns responding in a round-robin fashion. Each agent, during its turn, broadcasts its response to all other agents, ensuring that the entire team maintains a consistent context.

We will begin by creating a team with two AssistantAgent and a TextMentionTermination condition that stops the team when a specific word is detected in the agent’s response.

The two-agent team implements the reflection pattern, a multi-agent design pattern where a critic agent evaluates the responses of a primary agent. Learn more about the reflection pattern using the Core API.

## creating a team

```python
import asyncio

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.base import TaskResult
from autogen_agentchat.conditions import ExternalTermination, TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_core import CancellationToken
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Create an OpenAI model client.
model_client = OpenAIChatCompletionClient(
    model="gpt-4o-2024-08-06",
    # api_key="sk-...", # Optional if you have an OPENAI_API_KEY env variable set.
)

# Create the primary agent.
primary_agent = AssistantAgent(
    "primary",
    model_client=model_client,
    system_message="You are a helpful AI assistant.",
)

# Create the critic agent.
critic_agent = AssistantAgent(
    "critic",
    model_client=model_client,
    system_message="Provide constructive feedback. Respond with 'APPROVE' to when your feedbacks are addressed.",
)

# Define a termination condition that stops the task if the critic approves.
text_termination = TextMentionTermination("APPROVE")

# Create a team with the primary and critic agents.
team = RoundRobinGroupChat([primary_agent, critic_agent], termination_condition=text_termination)
```

## running a team

## observing a team

## resetting a team

## stopping a team

## resuming a team

## aborting a team

## Single Agent team

## Human-in-the-loop

## Termination

## State