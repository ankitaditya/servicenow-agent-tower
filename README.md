# 🏰 ServiceNow Agent Tower

> **AI-Powered Orchestration for ServiceNow**  
Turn ITOM alerts into intelligent actions with agentic automation, runbooks, and incident management – all in one tower.

---

## 🌟 Overview

**ServiceNow Agent Tower** is an advanced **agentic automation framework** designed to supercharge ServiceNow.  
It connects monitoring systems, analyzes ITOM alerts, executes automated runbooks, and resolves incidents with **AI-driven workflows**.  

Think of it as your **tower of control** – watching, analyzing, and resolving issues before they disrupt business operations.  

---

## ✨ Features

- 🔔 **Alert-to-Incident Pipeline** – Seamless flow from ITOM alerts → analysis → incident creation.  
- 🤖 **Agentic AI Automation** – Uses AI agents to decide between auto-resolve, escalation, or human intervention.  
- 📚 **Runbook Automation** – Execute pre-built or dynamically generated runbooks to resolve issues.  
- 🔗 **Integrations** – Extendable to HRMS, SaaS apps, Solar Management Systems, and beyond.  
- 🐳 **Dockerized Microservices** – Easy deployment, scaling, and portability.  
- ⚡ **Modern Tech Stack** – Built with **JavaScript/TypeScript, LangGraph, Node.js, and ServiceNow APIs**.  

---

## 🏗️ Architecture

```mermaid
flowchart TD
    A[ITOM Alert] --> B[Agent Tower]
    B --> C[AI Analysis Engine]
    C --> D{Decision?}
    D -->|Auto Resolve| E[Runbook Executor]
    D -->|Escalate| F[Incident Created in ServiceNow]
    D -->|Notify| G[Human Agent]
    E --> H[Closed Incident]
    F --> H
````

## 🏗️ Agent Tower Workflow

```mermaid
flowchart TD
    A[ITOM Alert] --> B[Watcher Agent]
    B --> C[Investigator Agent]
    C --> D[Governor Agent]

    %% Governor decision point
    D -->|Auto Resolve| E[Executor Agent]
    D -->|Escalate| F[Incident Created in ServiceNow]
    D -->|Notify| G[Human Agent]

    %% End states
    E --> H[Closed Incident]
    F --> H
    G --> H
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/servicenow-agent-tower.git
cd servicenow-agent-tower
```

### 2. Environment Setup

Create a `.env` file:

```env
SERVICENOW_INSTANCE=https://your-instance.service-now.com
SERVICENOW_USER=admin
SERVICENOW_PASSWORD=yourpassword
OPENAI_API_KEY=your_api_key
```

### 3. Build & Run (Docker)

```bash
docker-compose up --build
```

---

## 🔌 Example Use Case

* **Scenario**: Solar Management System detects a power drop.
* **Flow**: Alert → Agent Tower → AI Analysis → Runbook executes restart → Incident auto-closed.
* **Outcome**: Zero human intervention, faster recovery, reduced downtime.

---

## 🛠️ Tech Stack

* **ServiceNow APIs** (ITOM, ITSM)
* **LangGraph** (agent orchestration)
* **Node.js / TypeScript** (backend logic)
* **Docker & Docker Compose** (containerization)
* **PostgreSQL / Redis** (state & caching)

---

## 📚 Roadmap

* [ ] Advanced agent collaboration via LangGraph
* [ ] Incident triage with natural language reasoning
* [ ] Slack/MS Teams integrations for human-in-loop
* [ ] Multi-cloud monitoring connectors

---

## 🤝 Contributing

Contributions are welcome! Please check our [issues](./issues) or create a pull request.

---

## 📜 License

MIT License © 2025 – Ankit Aditya

---
