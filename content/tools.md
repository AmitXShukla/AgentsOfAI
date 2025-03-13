# Tool Functions

LLMs are really very powerful, let's run a simple example and ask a question.

How is the weather in Los Angeles, CA today?


```{code-cell} python
import ollama

response = ollama.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': 
            'How is the weather in Los Angeles, CA today?'}]
    )

print(f"Content: {response["message"]["content"]}")
```

```{seealso} result
Content: I'm a large language model, I don't have real-time access to current weather conditions. However, I can suggest some ways for you to find out the current weather in Los Angeles, CA:

1. Check online weather websites: You can check websites like AccuWeather, Weather.com, or the National Weather Service (NWS) for up-to-date weather forecasts and conditions.
2. Use a mobile app: You can download a weather app on your smartphone, such as Dark Sky or Weather Underground, to get current weather conditions and forecasts.
3. Tune into local news: Watch local news channels or listen to radio stations to get the latest weather updates.

Please note that Los Angeles is a large city with varied weather conditions depending on the location and time of day. The city's climate can range from sunny and mild in some areas to cooler and cloudier in others.

If you provide me with a specific date or time, I can try to give you an estimate of the typical weather conditions in Los Angeles for that particular day.
```

---

What you just saw that even though LLMs are really strong, but they can’t answer questions about things happening in real time or to some information they don't have access to.

What if we gave them extra info to help them get live, up-to-date details? With this real-time info, they could answer those questions.

```python
import ollama

response = ollama.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': 
            """How is the weather in Los Angeles, CA today?
            BTW, here is some extra information to help you.
            I am using a tool like function,
            this function can access and API and as per API, 
            current weather in Los Angeles is 74 degrees."""}],
    )

print(f"Content: {response["message"]["content"]}")
```
```{seealso} result
    Content: Thank you for the extra information! 
    Since we're simulating an API call, I'll use that data to provide an answer.

    According to our simulated API call, the current temperature in Los Angeles, CA
     is indeed 74°F (23°C). However, without knowing the specific date 
     or time of year, it's difficult to determine what type of weather 
     LA is experiencing today. Was it a sunny day with clear skies, 
     or was there any precipitation? Without more information,
     I can only provide the temperature data.

    If you'd like to simulate more weather conditions 
    or add additional details, feel free to share!
```

Notice, that how simple extra information using tools provided to LLMs can really overcome this issue of not able to answer real time or domain/subject specific questions.

We call these helpers "Tools." Let’s make a simple tool function and see how it works.

## Write Tool Functions

```python
import requests

def get_current_weather(location):
  # https://api.weather.gov/gridpoints/TOP/32,81/forecast
  # The API endpoint
  url = "https://api.weather.gov/gridpoints/TOP/32,81/forecast"
  response = requests.get(url)
  return f"""The current temperature in {location} is
         {response.json()["properties"]["periods"][0]["temperature"]} 
         degrees Fahrenheit."""

get_current_weather("Los Angeles, CA")
```
```{seealso} result
    The current temperature in Los Angeles, CA is 77 degrees Fahrenheit.
```

I defined a function that makes an API call to fetch the temperature of a given city. However, we need to pass a dynamic parameter to this function, which should come from a user prompt.

To achieve this, we will create a `tools` data structure supported by the LLM framework. This structure will interpret the user prompt as a dynamic parameter, which can then be passed to the weather API function.

```python
tools = [{
      'type': 'function',
      'function': {
        'name': 'get_current_weather',
        'description': 'Get the current weather for a location',
        'parameters': {
          'type': 'object',
          'properties': {
            'location': {
              'type': 'string',
              'description': 'The name of the location',
            },
          },
          'required': ['location'],
        },
      },
    }
  ]
```

Tools are simply a list of Python functions that can access APIs or perform other tasks to provide meaningful information. Let's pass this tool function to `ollama.chat`.

When we say that LLM model frameworks support `tools functions`— which most advanced LLM models do, it means that when we pass `tools=tools`, the model can use these functions to enhance its responses.

```python
import ollama

response = ollama.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': 
            """How is the weather in Los Angeles, CA today?"""}],
		# REFACTOR: provide a weather checking tool to the model
        tools=tools # type: ignore
    )

print(f"Content: {response["message"]["content"]}")
```

```{seealso} result
    content:
```
what happened here, our Tool function didn't work, actually it did work. let's print complete response object and you will there are much more hidden information packed in and you must understand these to help you make use of tools functions most.

```python
print(response)
```

```python
{
    "model": "llama3.2",
    "created_at": "2025-03-07T22: 37: 49.457833367Z",
    "message": {
        "role": "assistant",
        "content": "",
        "tool_calls": [
            {
                "function": {
                    "name": "get_current_weather",
                    "arguments": {
                        "location": "Los Angeles, CA"
                    }
                }
            }
        ]
    },
    "done_reason": "stop",
    "done": true,
    "total_duration": 17988129148,
    "load_duration": 30554277,
    "prompt_eval_count": 178,
    "prompt_eval_duration": 9208611000,
    "eval_count": 21,
    "eval_duration": 8706934000
}

```

Now, let's use the output from the tools or functions to support the LLM model and provide us with a meaningful response.
Let's put it altogether and simply refactor code.

> This code creates a basic AI chatbot that can answer a question about the weather. It asks about the weather in Los Angeles, uses a tool to get the weather info, and then lets the AI respond with the answer. If the tool is used, it adds the weather data to the chat and gets a final reply from the AI.

```python
# Define the messages
messages = [{'role': 'user', 'content': 'How is the weather in Los Angeles, CA today?'}]
print('Prompt:', messages[0]['content'])

# Define available functions
available_functions = {
    'get_current_weather': get_current_weather
}

# Import required modules
import ollama
from ollama import ChatResponse
# !pip install munch
from munch import Munch

# Define the tools specification
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The location, e.g. Los Angeles, CA"
                    }
                },
                "required": ["location"]
            }
        }
    }
]

# Call ollama.chat with the corrected tools parameter
response_dict: ChatResponse = ollama.chat(
    'llama3.2',
    messages=messages,
    tools=tools,
)

# Convert the dictionary to a Munch object
response = Munch.fromDict(response_dict)

# Process tool calls if present
if response.message.tool_calls:
    # There may be multiple tool calls in the response
    for tool in response.message.tool_calls:
        # Ensure the function is available, then call it
        if function_to_call := available_functions.get(tool.function.name):
            print('Calling function:', tool.function.name)
            print('Arguments:', tool.function.arguments)
            output = function_to_call(**tool.function.arguments)
            print('Function output:', output)
        else:
            print('Function', tool.function.name, 'not found')

    # Add the function response to messages for the model to use
    messages.append(response.message)
    messages.append({'role': 'tool', 'content': str(output), 'name': tool.function.name})

    # Get final response from model with function outputs
    final_response = ollama.chat('llama3.2', messages=messages, tools=tools)
    print('Final response:', final_response["message"]["content"])
else:
    print('No tool calls returned from model')
```

```{seealso} result
    content:
    Prompt: How is the weather in Los Angeles, CA today?
    Calling function: get_current_weather
    Arguments: Munch({'location': 'Los Angeles, CA'})
    Function output: 77
    Final response: According to the tool response, 
    the current temperature in Los Angeles, 
    CA is 77 degrees Fahrenheit. However,
    I couldn't find any information on today's
     weather conditions in my database. 
     Can you please provide more context 
     or specify which source you would like me
      to use (e.g., OpenWeatherMap, Dark Sky, etc.)?
```
