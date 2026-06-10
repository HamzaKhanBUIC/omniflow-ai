# OmniFlow AI 🚀

An advanced, self-healing, agentic crowd control and infrastructure management system built for the **Google Cloud Rapid Agent Hackathon**. OmniFlow leverages real-time telemetry, spatial graph algorithms, and the Gemini API (via MCP) to dynamically route crowds, mitigate disasters, and auto-heal its own infrastructure.

## 🌟 Key Features
- **Live Venue Topology Graph**: Real-time rendering of physical spaces (Stadiums, Concourses, Transit Hubs) with dynamic edge weights based on crowd density.
- **Agentic AI Mitigation**: Uses **Gemini 3.1 Flash Lite** to analyze live ElasticSearch logs and Dynatrace metrics, dynamically proposing routing solutions.
- **Model Context Protocol (MCP)**: Natively integrates with [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), GitLab, and ElasticSearch using official MCP tool bindings.
- **Self-Healing Infrastructure**: Automatically spawns background `child_process` routines to purge orphaned Gemini storage files if API quotas are threatened.
- **Historical Learning Loop (MongoDB)**: Solved incidents are permanently saved to your live **MongoDB Atlas** cluster. The AI queries past successes when facing new anomalies to augment its decision-making context.
- **Automated Failover**: Gracefully falls back to a deterministic local spatial algorithm if the cloud LLM fails.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Git
- Google Cloud / Gemini API Keys

### 2. Installation
```bash
git clone https://github.com/HamzaKhanBUIC/omniflow-ai.git
cd omniflow-ai
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and copy the contents from `.env.example`. You will need to fill in your API keys:
```env
GEMINI_API_KEY="your_gemini_key"
GITLAB_PERSONAL_ACCESS_TOKEN="your_gitlab_token"
MONGODB_CONNECTION_STRING="your_mongodb_uri"
ELASTICSEARCH_URL="your_elastic_url"
ELASTICSEARCH_API_KEY="your_elastic_key"
```

### 4. Run the Application
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the dashboard!

---

## ☁️ Google Cloud Run Deployment

OmniFlow is designed to be deployed as a serverless container on **Google Cloud Run** using native Cloud Buildpacks.

### Step 1: Authenticate
```bash
gcloud auth login
```

### Step 2: Set Project & Permissions
Ensure your Google Cloud project is selected and the Compute Service Account has permission to read the build storage:
```bash
gcloud config set project YOUR_PROJECT_ID

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/storage.admin"
```

### Step 3: Deploy to Cloud Run
Deploy the app directly from your terminal. Google Cloud will automatically detect the Next.js framework, containerize it, and deploy it to the edge:
```bash
gcloud run deploy omniflow-ai --source . --region us-central1 --allow-unauthenticated --memory=1024Mi
```
*(Note: We allocate `1024Mi` to ensure enough headroom for the background MCP Node processes).*

### Step 4: Inject API Keys
Once deployed, inject your secure environment variables into the live Cloud Run instance:
```bash
gcloud run services update omniflow-ai \
  --region us-central1 \
  --set-env-vars="GEMINI_API_KEY=...,GITLAB_PERSONAL_ACCESS_TOKEN=...,MONGODB_CONNECTION_STRING=...,ELASTICSEARCH_URL=...,ELASTICSEARCH_API_KEY=..."
```

---

## 🛠️ Infrastructure Maintenance

### Gemini Auto Storage Cleaner
If your Gemini API File storage becomes bloated, OmniFlow includes a self-healing script to purge orphaned files across all configured keys.

To run it manually locally:
```bash
npm run clean:gemini
```
*(Note: OmniFlow will automatically trigger this in the background if it detects an API quota anomaly during a live simulation).*

---
**Built with ❤️ for the Google Cloud Hackathon**
