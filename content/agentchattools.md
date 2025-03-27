# AgentChat Tools

Using Tools

Large Language Models (LLMs) are typically limited to generating text or code responses. However, many complex tasks benefit from the ability to use external tools that perform specific actions, such as fetching data from APIs or databases.

To address this limitation, modern LLMs can now accept a list of available tool schemas (descriptions of tools and their arguments) and generate a tool call message. This capability is known as Tool Calling or Function Calling and is becoming a popular pattern in building intelligent agent-based applications. Refer to the documentation from OpenAI and Anthropic for more information about tool calling in LLMs.

In AgentChat, the AssistantAgent can use tools to perform specific actions. The web_search tool is one such tool that allows the assistant agent to search the web for information. A custom tool can be a Python function or a subclass of the BaseTool.

By default, when AssistantAgent executes a tool, it will return the tool’s output as a string in ToolCallSummaryMessage in its response. If your tool does not return a well-formed string in natural language, you can add a reflection step to have the model summarize the tool’s output, by setting the reflect_on_tool_use=True parameter in the AssistantAgent constructor.
Built-in Tools

AutoGen Extension provides a set of built-in tools that can be used with the Assistant Agent. Head over to the API documentation for all the available tools under the autogen_ext.tools namespace. For example, you can find the following tools:

    graphrag: Tools for using GraphRAG index.

    http: Tools for making HTTP requests.

    langchain: Adaptor for using LangChain tools.

    mcp: Tools for using Model Chat Protocol (MCP) servers.

Function Tool

The AssistantAgent automatically converts a Python function into a FunctionTool which can be used as a tool by the agent and automatically generates the tool schema from the function signature and docstring.

The web_search_func tool is an example of a function tool. The schema is automatically generated.


```python
from autogen_core.tools import FunctionTool
# Define a tool using a Python function.
async def web_search_func(query: str) -> str:
    """Find information on the web"""
    return "AutoGen is a programming framework for building multi-agent applications."


# This step is automatically performed inside the AssistantAgent if the tool is a Python function.
web_search_function_tool = FunctionTool(web_search_func, description="Find information on the web")
# The schema is provided to the model during AssistantAgent's on_messages call.
web_search_function_tool.schema
```

```{seealso}
{'name': 'web_search_func',
 'description': 'Find information on the web',
 'parameters': {'type': 'object',
  'properties': {'query': {'description': 'query',
    'title': 'Query',
    'type': 'string'}},
  'required': ['query'],
  'additionalProperties': False},
 'strict': False}
 ```

Model Context Protocol Tools
The AssistantAgent can also use tools that are served from a Model Context Protocol (MCP) server using mcp_server_tools().

```python
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.tools.mcp import StdioServerParams, mcp_server_tools

# Get the fetch tool from mcp-server-fetch.
fetch_mcp_server = StdioServerParams(command="uvx", args=["mcp-server-fetch"])
tools = await mcp_server_tools(fetch_mcp_server)

# Create an agent that can use the fetch tool.
model_client = OpenAIChatCompletionClient(model="gpt-4o")
agent = AssistantAgent(name="fetcher", model_client=model_client, tools=tools, reflect_on_tool_use=True)  # type: ignore

# Let the agent fetch the content of a URL and summarize it.
result = await agent.run(task="Summarize the content of https://en.wikipedia.org/wiki/Seattle")
print(result.messages[-1].content)
```

```{seealso}
Seattle, located in Washington state, is the most populous city in the state and a major city in the Pacific Northwest region of the United States. It's known for its vibrant cultural scene, significant economic presence, and rich history. Here are some key points about Seattle from the Wikipedia page:

1. **History and Geography**: Seattle is situated between Puget Sound and Lake Washington, with the Cascade Range to the east and the Olympic Mountains to the west. Its history is deeply rooted in Native American heritage and its development was accelerated with the arrival of settlers in the 19th century. The city was officially incorporated in 1869.

2. **Economy**: Seattle is a major economic hub with a diverse economy anchored by sectors like aerospace, technology, and retail. It's home to influential companies such as Amazon and Starbucks, and has a significant impact on the tech industry due to companies like Microsoft and other technology enterprises in the surrounding area.

3. **Cultural Significance**: Known for its music scene, Seattle was the birthplace of grunge music in the early 1990s. It also boasts significant attractions like the Space Needle, Pike Place Market, and the Seattle Art Museum. 

4. **Education and Innovation**: The city hosts important educational institutions, with the University of Washington being a leading research university. Seattle is recognized for fostering innovation and is a leader in environmental sustainability efforts.

5. **Demographics and Diversity**: Seattle is noted for its diverse population, reflected in its rich cultural tapestry. It has seen a significant increase in population, leading to urban development and changes in its social landscape.

These points highlight Seattle as a dynamic city with a significant cultural, economic, and educational influence within the United States and beyond.
```

Langchain Tools
You can also use tools from the Langchain library by wrapping them in LangChainToolAdapter.


```python
import pandas as pd
from autogen_ext.tools.langchain import LangChainToolAdapter
from langchain_experimental.tools.python.tool import PythonAstREPLTool

df = pd.read_csv("https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv")
tool = LangChainToolAdapter(PythonAstREPLTool(locals={"df": df}))
model_client = OpenAIChatCompletionClient(model="gpt-4o")
agent = AssistantAgent(
    "assistant", tools=[tool], model_client=model_client, system_message="Use the `df` variable to access the dataset."
)
await Console(
    agent.on_messages_stream(
        [TextMessage(content="What's the average age of the passengers?", source="user")], CancellationToken()
    ),
    output_stats=True,
)
```


```{seealso} result
---------- assistant ----------
[FunctionCall(id='call_BEYRkf53nBS1G2uG60wHP0zf', arguments='{"query":"df[\'Age\'].mean()"}', name='python_repl_ast')]
[Prompt tokens: 111, Completion tokens: 22]
---------- assistant ----------
[FunctionExecutionResult(content='29.69911764705882', call_id='call_BEYRkf53nBS1G2uG60wHP0zf')]
---------- assistant ----------
29.69911764705882
---------- Summary ----------
Number of inner messages: 2
Total prompt tokens: 111
Total completion tokens: 22
Duration: 0.62 seconds
```

```{seealso} result
Response(chat_message=ToolCallSummaryMessage(source='assistant', models_usage=None, content='29.69911764705882', type='ToolCallSummaryMessage'), inner_messages=[ToolCallRequestEvent(source='assistant', models_usage=RequestUsage(prompt_tokens=111, completion_tokens=22), content=[FunctionCall(id='call_BEYRkf53nBS1G2uG60wHP0zf', arguments='{"query":"df[\'Age\'].mean()"}', name='python_repl_ast')], type='ToolCallRequestEvent'), ToolCallExecutionEvent(source='assistant', models_usage=None, content=[FunctionExecutionResult(content='29.69911764705882', call_id='call_BEYRkf53nBS1G2uG60wHP0zf')], type='ToolCallExecutionEvent')])
```

Parallel Tool Calls

Some models support parallel tool calls, which can be useful for tasks that require multiple tools to be called simultaneously. By default, if the model client produces multiple tool calls, AssistantAgent will call the tools in parallel.

You may want to disable parallel tool calls when the tools have side effects that may interfere with each other, or, when agent behavior needs to be consistent across different models. This should be done at the model client level.

For OpenAIChatCompletionClient and AzureOpenAIChatCompletionClient, set parallel_tool_calls=False to disable parallel tool calls.

```python
model_client_no_parallel_tool_call = OpenAIChatCompletionClient(
    model="gpt-4o",
    parallel_tool_calls=False,  # type: ignore
)
agent_no_parallel_tool_call = AssistantAgent(
    name="assistant",
    model_client=model_client_no_parallel_tool_call,
    tools=[web_search],
    system_message="Use tools to solve tasks.",
)
```