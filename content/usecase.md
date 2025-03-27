# Use Case

## PTO Request System
Let’s tackle a real-world business problem by coding a solution. An employee wants to take PTO next Thursday and Friday to enjoy a long weekend. Here’s the basic flow:

-   An LLM calculates the dates for next week.
-   The employee checks their PTO balance and submits a request.
-   The request goes to the manager for approval.
-   The manager, aware it’s a long weekend, ensures not all staff are off at once and approves based on team availability.
-   Once approved, the employee’s department and teammates working on the same tasks are notified.

```{mermaid}
flowchart TD
    A((Start)) --> B[Calculate dates]
    B --> C[Check PTO balance]
    C --> D[Submit PTO request]
    D --> E[Manager reviews PTO request]
    E --> F[Check team availability]
    F --> G[Approve PTO request]
    G --> H[Send notifications]
    H --> I((End))

    style A fill:#e0f7fa,stroke:#000
    style B fill:#f1f8e9,stroke:#000
    style C fill:#e0f7fa,stroke:#000
    style D fill:#f1f8e9,stroke:#000
    style E fill:#e0f7fa,stroke:#000
    style F fill:#f1f8e9,stroke:#000
    style G fill:#e0f7fa,stroke:#000
    style H fill:#f1f8e9,stroke:#000
    style I fill:#e0f7fa,stroke:#000
```

*This use case skips many details and complexities for simplicity’s sake.*

## PTO Business Process

Imagine a system where one AI Agent retrieves and updates data in a SQL database, while another processes company internal documentation. These agents need to exchange data—sometimes directing it to a specific agent, and other times broadcasting it (e.g., a notification like "approved PTO") for multiple agents to act upon asynchronously. 

```{mermaid}
graph TD
    Agent1[AI Agent 1: SQL Ops] -- "direct exchange" --> Agent2[AI Agent 2: Docs Proc]
    Agent2 -- "direct exchange" --> Agent1
    Agent1 -- "broadcast" --> Broadcast[Broadcast Channel]
    Agent2 -- "broadcast" --> Broadcast
    Broadcast -- "notify" --> OtherAgents[Other Agents]

    style Agent1 fill:#e0f7fa,stroke:#000
    style Agent2 fill:#e0f7fa,stroke:#000
    style Broadcast fill:#f1f8e9,stroke:#000
    style OtherAgents fill:#e0f7fa,stroke:#000
```

As you define more agents with specialized behaviors, the system can quickly grow complex. 

## Agent Framework Design
Without a structured approach, you might end up with an unwieldy, coder-only-understood workflow resembling a full-blown SaaS product or ERP system—something you’d rather avoid reinventing, given the abundance of existing solutions.

An AI Agent framework, like AutoGen, addresses these challenges by providing a structured, reusable, and manageable way to build and scale such systems. Here’s why it makes sense:

We’ll start with a standalone implementation to keep things straightforward.