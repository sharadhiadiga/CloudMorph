# 🌩️ CloudMorph

## Automated Enterprise Cloud Migration & Intelligence Platform


#  Overview

CloudMorph is an AI-powered DevOps orchestration platform designed to transform legacy repositories into cloud-native architectures. It intelligently analyzes existing repositories, detects technology stacks, audits dependencies, identifies migration risks, and simulates cloud migration workflows through real-time streaming. The platform also generates enterprise-grade migration reports with actionable recommendations, making cloud adoption faster, safer, and more efficient.


#  Features

## 🧠 Intelligence Phase

### Automated Stack Detection
- Detects project technology stacks automatically
- Supports Node.js, Python, Java, and Go projects
- Identifies recommended runtimes and container ports

### Deep Dependency Audit
- Scans project manifests (`package.json`, `requirements.txt`)
- Detects dependency versions
- Recommends package upgrades
- Highlights outdated or vulnerable libraries

### Risk Assessment
Categorizes migration risks into:
- 🔴 High Risk
- 🟠 Medium Risk
- 🟢 Low Risk

Identifies issues such as:
- Missing Dockerfiles
- Undefined ingress ports
- Configuration problems
- Missing environment variables



## 🕒 Real-Time Streaming Pipeline

Simulates a production-grade cloud migration workflow.

Features include:
- Live NDJSON streaming
- AI "Thinking" messages
- Animated migration stages
- Auto-scrolling terminal logs
- Real-time progress updates

Pipeline stages:
- Repository Analysis
- Dependency Inspection
- Containerization
- Infrastructure Provisioning
- Deployment Simulation
- Report Generation



## 📊 Audit-Grade Reporting

Generates comprehensive migration reports featuring:

### Transformation Roadmap
- Before → After architecture comparison
- Runtime upgrades
- Process manager improvements
- Infrastructure modernization

### Manual Action Checklist
- Environment configuration
- Secrets management
- DNS setup
- Deployment validation
- Monitoring recommendations

### Enterprise PDF Export
Professional migration report containing:
- Repository summary
- Dependency audit
- Risk analysis
- Migration roadmap
- Recommendations
- Final checklist


# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | Python, Flask |
| **Streaming** | NDJSON |
| **PDF Generation** | jsPDF |
| **Containerization** | Docker (Simulation) |
| **Infrastructure** | Terraform (Simulation) |


# 🚀 Installation

## Prerequisites

- Python 3.8 or later
- Node.js 16 or later
- npm or Yarn
- Git

### Clone the Repository

```bash
git clone https://github.com/sharadhiadiga/CloudMorph.git

cd CloudMorph
```

---

## Backend Setup

### Create a Virtual Environment

```bash
python -m venv venv
```

### Activate the Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**macOS/Linux**

```bash
source venv/bin/activate
```

### Install Python Dependencies

```bash
pip install flask flask-cors
```

### Start the Backend Server

```bash
python server.py
```

---

## Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```


## Access the Application

Once both the backend and frontend are running, open your browser and visit:

```
http://localhost:5173
```

The frontend communicates with the Flask backend running through `server.py` to perform repository analysis, stream migration progress, and generate cloud migration reports.

---

# 🚀 Future Work

- AI-generated Dockerfiles
- Kubernetes deployment support
- Terraform code generation
- GitHub Actions integration
- AWS, Azure, and GCP deployment
- Security vulnerability scanning
- Infrastructure cost estimation
- Multi-cloud migration planning
- AI-powered optimization suggestions
- Live infrastructure monitoring
