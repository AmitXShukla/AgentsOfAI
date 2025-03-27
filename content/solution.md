# Solution Design

So far, we’ve explored our use case, the features we want to create, and how an AI Agent Actor model could help automate the HR timesheet approval process.

I might have overlooked some useful features in our use case, and I could do so again while simplifying the solution design. 

The goal is to start building something. Instead of nailing down every little detail, let’s focus on the big picture and create a workflow that answers most questions and delivers the core idea. At the same time, we’ll build the solution with small, flexible components that can scale to handle bigger, more complex use cases later.

To keep it simple: for the timesheet approval process, let’s tackle one small use case first. We can expand it later as we get more comfortable with the AI Agent Actor model, the tech behind AI Agents, and solution design patterns.

- An employee asks for PTO next week.  
- A request is made for the employee.  
- The system checks the employee’s available PTO, HR rules, and assigned tasks.  
- If the employee has enough PTO and no more than 2 tasks during that time, the PTO is automatically approved.  
- If not, the request goes to the employee’s manager for approval.  
- The manager approves or denies it.  
- The decision is shared with the employee.  
- If approved, a notice goes to the team, letting them know the employee will be out of office on those days.

## Workflow

```{mermaid}
graph LR
    subgraph "PTO Request Process"
        A[Start] --> B[Employee submits PTO request]
        B --> C{Check: Enough PTO and < 2 tasks?}
        C -->|Yes| D[Approved]
        C -->|No| E[Send to manager]
        E --> F{Manager decision: Approve?}
        F -->|Yes| D
        F -->|No| G[Denied]
        D --> H[Notify employee and team]
        G --> I[Notify employee]
        H --> J[End]
        I --> J
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
```

## Design Pattern
- LLMAgent gets a request (e.g., PTO for Alice, EmployeeID: 512, next Thursday and Friday).  
- LLMAgent identifies the dates and employee ID from the request.  
- LLMAgent contacts PTOAgent and TaskAgent with the employee ID and dates.  
- PTOAgent checks sick leave rules with HRAgent.  
- PTOAgent and LLMAgent send info to DecisionAgent.  
- DecisionAgent either forwards it to ManagerAgent or auto-approves the PTO.

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

```{note}
In the diagram above, various agents communicate with one another using messages and queries, as outlined in the previous chapter. All these interactions take place through a shared `messagebus` within the `runtime` environment.
```