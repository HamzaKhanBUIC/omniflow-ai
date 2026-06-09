<div align="center">
  <img src="public/favicon.ico" alt="OmniFlow Logo" width="120" />
  <h1>🌊 OmniFlow AI</h1>
  <p><strong>Universal Autonomous Crowd Intelligence & Infrastructure Routing</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Gemini-3.0_Flash-blue?style=for-the-badge&logo=google" alt="Gemini" />
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="NextJS" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

<br/>

## 🏆 Project Overview

**OmniFlow AI** is a cutting-edge autonomous orchestration system designed to manage massive crowd flows during critical disaster scenarios (sports stadiums, music festivals, city gatherings). Built for the **Google Cloud Rapid Agent Hackathon**, OmniFlow utilizes the lightning-fast **Gemini 3.0 Flash** model to ingest real-time multi-channel telemetry (MCPs) and execute life-saving spatial rerouting logic with zero human latency.

---

## ⚡ Core Features & Scenarios

OmniFlow AI simulates 4 high-stakes enterprise disaster scenarios, dynamically rendering real-time graph topologies and telemetry firehoses:

1. 🛑 **Bottleneck / Choke Points:** Ticketing database failures leading to massive gate crushes.
2. 🌊 **Mass Surge / Exodus:** Unpredictable crowd stampedes requiring immediate safe-zone routing.
3. 🍔 **Resource Exhaustion:** Critical infrastructure failures (POS crashing, food/water shortages) causing localized panic.
4. 🚆 **Transit Delay / Dump:** External city transit delays causing sudden platform overcrowding.

---

## 🧠 The Agentic Architecture (MCP Integration)

Rather than relying on a single data source, OmniFlow acts as a centralized **Model Context Protocol (MCP)** router, aggregating 4 distinct mock enterprise streams to give Gemini perfect spatial awareness:

- **[DYNATRACE]** Real-time hardware telemetry, network health, and packet drops.
- **[FIVETRAN]** Live integrations with local transit APIs and supply chain inventory.
- **[MONGODB]** Historical spatial density vectors and past-event crush patterns.
- **[GITLAB]** Automated DevOps incident creation and P0 ticket escalation.

Gemini 3.0 Flash processes this raw firehose and outputs a highly structured **JSON Execution Payload** directly into the venue's Digital Signage systems.

---

## 🛡️ Zero-Downtime Failover Pipeline

In critical physical security scenarios, cloud dependency is a vulnerability. OmniFlow features a **Local Spatial Failover Model**. If the primary Gemini API times out due to extreme network overload, the system instantly catches the exception and executes local, deterministic spatial logic to guarantee continuous crowd safety without dropping a single frame.

---

## 🚀 How To Run

**1. Clone the repository**
```bash
git clone https://github.com/your-username/omniflow-ai.git
cd omniflow-ai
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment**
Create a `.env.local` file in the root directory and add your Google AI Studio keys:
```env
GEMINI_API_KEY=AIzaSy...
```

**4. Start the Orchestrator**
```bash
npm run dev
```
Navigate to `http://localhost:3000` to launch the OmniFlow Command Center.

---

<div align="center">
  <i>Built with ❤️ for the Google Cloud Rapid Agent Hackathon 2026</i>
</div>
