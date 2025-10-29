# 🔄 Two-Flow Architecture

## Overview

The system architecture clearly shows **two distinct flows**:

### 1️⃣ **Data Sync Flow (Top - Continuous/Periodic)**
Handles periodic data ingestion and knowledge base enrichment.

### 2️⃣ **Report Generation Flow (Bottom - On-Demand)**
Handles orchestrated report generation triggered by specific requests.

---

## 📊 Flow 1: Data Sync Flow (Top Half)

**Purpose:** Continuously sync data sources into the Central Knowledge Base

**Path:**
```
Data Sources → LLM Ingestion → Central Knowledge Base ← Report Summaries
     ↓              ↓                    ↑                      ↑
  (grouped)    (normalizes)         (stores)            (feedback loop)
```

**Components:**

1. **Data Sources (Left - Yellow Group)**
   - 🎮 Game Key Metrics
   - 💳 Payment / Billing
   - 🎫 CS Tickets
   - 📱 Social Performance
   - 📰 News & Events
   - 📈 Promotion / Growth
   - 📣 Marketing / Campaign
   - All arrows **merge** before entering ingestion

2. **Raw Data Lake (Purple - Separate)**
   - Immutable, auditable storage
   - Feeds into ingestion via batch/stream

3. **LLM Ingestion & Normalization (Blue)**
   - Schema mapping
   - Entity linking (Game, Player, Campaign)
   - Quality checks
   - Label: "extract/ELT" and "batch/stream"

4. **Observability & Lineage (Gray Dashed)**
   - Validates data quality
   - Tracks freshness and drift
   - Monitors ingestion pipeline

5. **Central Knowledge Base (Purple)**
   - Vector + relational store
   - Stores facts, metrics, events
   - Embeddings + citations
   - Label: "structured facts + embeddings"

6. **Report Summaries & Decisions (Pink - Top Right)**
   - Feedback loop back to KB
   - Stores insights from generated reports
   - Change logs, highlights, annotations
   - Label: "store as knowledge"

**Key Characteristic:**
- **Periodic/Continuous**: Runs on schedule (hourly, daily, etc.)
- **Data-driven**: New data automatically flows into KB
- **Learning loop**: Report insights enrich the knowledge base

---

## 📋 Flow 2: Report Generation Flow (Bottom Half)

**Purpose:** Generate reports on-demand when triggered by orchestrator

**Path:**
```
Orchestrator Trigger → AI Agent → Generated Report → Game Operators
                          ↓              ↓
                    (RAG retrieval)  (review)
                          ↑
                   Central KB
                          ↓
                    Guardrails
```

**Components:**

1. **Orchestrator Trigger (Blue - Bottom Left)**
   - Input: Report Template + Game ID + Period
   - Initiates the report generation flow
   - Label: "flow starts"

2. **AI Agent (LLM) (Purple - Bottom Center)**
   - Retrieves context from KB via RAG
   - Fills template, writes narrative
   - Label: "RAG retrieval"

3. **Central Knowledge Base (Shared)**
   - Provides historical context
   - Supplies embeddings for RAG
   - Same KB used in top flow

4. **Guardrails & Governance (Gray Dashed)**
   - PII handling
   - Approvals
   - Prompt safety checks

5. **Generated Report (Green)**
   - Charts, tables, narrative
   - AI-generated insights
   - Label: "populate template"

6. **Game Operators (Cyan - Right)**
   - Producers / PMs
   - Leads / Execs
   - Review and act on reports
   - Label: "review"

**Key Characteristic:**
- **On-Demand**: Triggered by specific requests
- **Orchestrated**: Controlled by trigger with parameters
- **Context-Aware**: Uses accumulated knowledge from Flow 1

---

## 🔗 Connection Between Flows

### Central Knowledge Base (Shared Component)
- **Top Flow** continuously **enriches** the KB with data
- **Bottom Flow** **retrieves** from the KB for report generation
- Creates a **virtuous cycle**: More data → Better reports → Better insights → Richer KB

### Feedback Loop
- Generated reports produce summaries and decisions
- These summaries flow **back to the KB** (top flow)
- Future reports benefit from past report insights
- Label: "auto-summarize" → "store as knowledge"

---

## 🎯 Key Benefits

### Separation of Concerns
- ✅ **Data ingestion** decoupled from **report generation**
- ✅ Can scale independently
- ✅ Different schedules and triggers

### Continuous Learning
- ✅ KB grows with both raw data and insights
- ✅ Reports become smarter over time
- ✅ Historical context improves analysis

### On-Demand Intelligence
- ✅ Reports generated when needed
- ✅ Uses freshest available data
- ✅ Combines real-time + historical context

---

## 📐 Visual Layout

```
TOP FLOW (Data Sync - Horizontal):
[Data Sources] → [LLM Ingestion] → [Central KB] ← [Summaries]
      ↓                                              ↑
[Raw Data Lake]                                      |
                                                     |
BOTTOM FLOW (Report Gen - Horizontal):              |
[Orchestrator] → [AI Agent] → [Report] → [Operators]
                     ↓            ↓
                [Guardrails]      └─────────────────┘
                                  (feedback)
```

### Position Grouping
- **Left**: Data sources (grouped), Triggers
- **Center-Left**: Processing (Ingestion, Orchestrator)
- **Center**: Knowledge Base, AI Agent
- **Center-Right**: Reports, Governance
- **Right**: Consumers, Feedback

---

## 🚀 Execution Model

### Flow 1 (Continuous)
```
Schedule: Every 1 hour
Trigger: Cron job / Event stream
Input: New game data
Output: Updated Knowledge Base
```

### Flow 2 (On-Demand)
```
Schedule: When requested
Trigger: API call / UI button
Input: Game ID + Template + Period
Output: Generated Report
```

---

## 📊 Data Flow Summary

**Inputs:**
- Raw game metrics, billing, tickets, social, news, promotions, campaigns

**Processing:**
- Normalization, entity linking, quality checks
- RAG retrieval, template filling, narrative generation

**Storage:**
- Central Knowledge Base (vector + relational)
- Raw Data Lake (immutable backup)

**Outputs:**
- Generated reports (charts, tables, insights)
- Report summaries (for KB enrichment)

**Consumers:**
- Game Operators (PMs, Producers, Execs)
- Knowledge Base (for future intelligence)

---

## 🎨 Visual Design Elements

### Grouping
- **"Data Sources"** group with blue blur background
- Dashed border indicating logical grouping
- Merged arrows for clean visual hierarchy

### Color Coding
- **Yellow**: Data sources (input)
- **Blue**: Processing nodes (ingestion, triggers)
- **Purple**: Storage/AI (KB, AI Agent, Raw Lake)
- **Green**: Output (Generated Report)
- **Pink**: Feedback (Summaries)
- **Cyan**: Consumers (Operators)
- **Gray Dashed**: Monitoring/Governance

### Arrow Styles
- **Dashed**: Data flow connections
- **Edge-to-edge**: Precise node connections
- **Merged**: Multiple sources → convergence point → single destination
- **Labels**: Key operations (extract/ELT, RAG retrieval, etc.)

---

This two-flow architecture ensures **continuous data enrichment** while enabling **on-demand intelligent reporting** powered by accumulated knowledge! 🎯
