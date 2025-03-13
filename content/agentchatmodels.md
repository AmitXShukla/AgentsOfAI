# Models

In previous chapters, we learns the based of AutoGen Core.
If you go through AutoGen official documentation, almost every one recommended to start with AutoGen Agent Chat


In this book, you might be wondering why I went through the hassle of learning AutoGen Core concept then now, we were almost there and ready to work on our HR TimeSheet business process automation use case and now I just switched gear and want to learn about Agent Chat before finishing the use case using AutoGen Core.

well.. that's the point, AutoGen Core fundamentals are a must know if you want to work on a professional AI Agent application. that knowledge is necessary to make you a Pro AI agent Engineer.

Now let;s talk about Agent Chat.

AgentChat is a high-level API for building multi-agent applications. It is built on top of the AutoGen-core package. For beginner users, AgentChat is the recommended starting point. For advanced users, AutoGen-core’s event-driven programming model provides more flexibility and control over the underlying components.

However, I have news for you, Agent Chat is mostly community driven and using Agent Chat comes with the advantage that it offers so many preset Agent and team configuration that makes it so easy to start with.

One of the most popular multi design pattern `magentic-core` which we will learn in advance topics, was first built in AutoGen Core,
is a design pattern, which allows users to quickly build and spin a pro use case implementation is now totally re0built using Agent Chat.

So the point is,

Agent Chat because of it's community support has grown into a concept more powerful than "just a high level API".
It's so good that often, when you working with AutoGen Core, instead of hassle of going through and a building a complex Agent design pattern, you would rather pull a preset agent and team configuration with in your AutoGen Core workflow and it will work just fine.



## AutoGen Agent Chat Concepts

We have recently learned the basics of what an AI Agent is and how Multi-agent systems consist of a group of individual AI Agents working together within a single environment or across distributed environments. The primary purpose of implementing a Single Agent or a Multi-Agent system is to solve a business use case by accomplishing a specific set of tasks, thereby automating the business process.

However, our exploration is not complete; there is still much more to learn about AI Agents. Before we proceed to study Agent behavior in detail, let's first delve deeper into the underlying mechanisms of an AI Agent.

now, we got our hands on using AutoGen Core, why to even bother learning about AGent Chat,
Agent Chat provide us many many present Agent Configuration which are ready to use,
for example, a PDF reader, web crawler, data (get this from `magentic-core` and Agent Chat config)

now since we understand the basic so AI Agents, Messages, topics, subscription, their run time and lifecycle.
But in fact, this is lot to learn, what if there is some kind of high level abstract of this whole mechanism which can help us get started.

Here comes AI Agent Chat, AI Agent Chat is nothing but high level abstract design pattern built on top of AI AGent Core.

In the beginning I said, that it's easy to get started with AI Agent Chat, but if you want to build a complex production level AI Agent Code or large and extremely complex process and knowing Ai Agent Core is must have and using high level pattern like AI Agent Chat might not be enough.

I want to take back my words, only half of that statement is true,
It;s great and must know about Agent Core, what Agent Core components are, understanding foundation is always critical and non-negotiable.

However saying AI Agent Chat is not good enough to build a production level complex Agent framework is not enough, this is not right statement.

AI Agent Chat has evolved so much that it is capable of fully supporting to create an extremely complex business problem or automation.
Look at the paper `magentic-core`, this design pattern initially was developed in AI Agent Core, but now is fully ported to AI Agent Chat and it does an amazing job.

but knowledge gained in AI Agent Core is not lost and will always be useful.

Let;s dig into basics of AI Agent Chat.


TODO: Show Agent Chat framework image or mermaid graph

![AgentChat](https://github.com/microsoft/autogen/raw/main/autogen-landing.jpg)

## AutoGen AgentChat

First of all, AutoGen is an opinionated high level API built on top of AutoGen Core.
Often time, when you want to test out a functionality with out writing too much code and very quickly, you can use either use Agent Studio. Which provides a great visual interface to test out AI Agents quickly.

and when you need a finer control over your proof of concept, AGent Chat exactly provides that, it's not as user friendly as Agent Studio, which is completely visual drag and drop, no code environment,

Agent Chat provides you some control over your Agents.

However, don't underestimate and think Agent Chat is only capable of a higher level quick POC,
recently Agent Chat has become so popular and powerful that it is no less than AutoGen Core itself, and just to mention, it's AutoGen most populate design pattern called `megentic-Core` which was also referred a flagship AutoGen0.2 is now completely written using Agent Chat.

point is, Agent Chat although being a higher level API on AutoGen Core is fully capable of delivering a great complex use case implementation.


## Define AI Agent Chat Assistant Agent

who, how this is not very much different than Agent Core at all,
as I mentioned above Agent Chat provides preset Agent configuration which you can use.

if you recall, in previous chapter, this was our Agent design pattern for the managing timesheets use case.

TODO: mermaid agents for timesheet

and we did implement PTO Agent and Task Agent, however, we didn't get a chance to complete other agents such LLMAgent.

Now let;s implement this agent