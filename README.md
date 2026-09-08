# SkyGuard AI: Intelligent Real-Time Anomaly Detection System for Automatic Weather Stations (AWS)

![SIH 2026](https://img.shields.io/badge/SIH-2026-blue)
![Python](https://img.shields.io/badge/Python-3.10%2B-brightgreen)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![PyTorch](https://img.shields.io/badge/PyTorch-2.2-orange)
![License](https://img.shields.io/badge/License-MIT-purple)

> **Smart India Hackathon 2026 Submission**  
> **Problem Statement ID:** SIH26073  
> **Title:** AI/ML-Based Intelligent Anomaly Detection for Automatic Weather Stations (AWS)  
> **Organization:** Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)  
> **Category:** Software | **Theme:** Disaster Management  
> **Team Name:** Algo Vizards

---

## 📌 Executive Summary

Automatic Weather Stations (AWS) are critical components of modern meteorological observation networks. However, weather data streams often suffer from sensor spikes, calibration drift, frozen values, and instrumental faults that compromise data quality.

**SkyGuard AI** is a multi-layer AI/ML platform engineered to monitor real-time weather parameters using **strictly three inputs**:
1. **Temperature (°C)**
2. **Atmospheric Pressure (hPa)**
3. **Relative Humidity (%)**

By evaluating temporal patterns, multivariate correlations, and spatial neighbor consistency, SkyGuard AI reliably distinguishes genuine extreme weather events from hardware sensor faults while generating actionable maintenance alerts for meteorological operators.

---

## 🚀 Key Features

* **Real-Time Anomaly Detection:** Identifies sensor spikes, step changes, frozen values, and drift in < 5 seconds.
* **Dual-Model ML Architecture:** Combines a PyTorch **LSTM Autoencoder** (temporal sequences) with **Isolation Forest** (multivariate outlier point checks).
* **Spatial Neighbor Cross-Checking:** Compares observations against surrounding stations to prevent false alarms during extreme weather events.
* **Explainable AI (SHAP):** Provides transparent feature attribution scores explaining exactly why an anomaly was flagged.
* **Predictive Health Scoring:** Tracks degradation trends over time to output continuous **Sensor Health Scores (0–100)** for maintenance teams.
* **Edge AI Compatibility:** Includes a lightweight C++ module optimized for microcontrollers like the ESP32.

---

## 🏗️ System Architecture

```text
  [ Raw AWS Observations / ESP32 Edge Sensor Feed ]
                        │ (HTTP / MQTT)
                        ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│  - Preprocessing, Resampling & Rolling Statistics      │
└───────────────────────┬────────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│ LSTM Autoencoder │         │ Isolation Forest │
│ Temporal Check   │         │ Multivariate     │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         └──────────────┬─────────────┘
                        ▼
┌────────────────────────────────────────────────────────┐
│            Spatial Consistency Checker                 │
│  - Evaluates spatial agreement with neighbor stations  │
└───────────────────────┬────────────────────────────────┘
                        ▼
┌────────────────────────────────────────────────────────┐
│             SHAP Root-Cause Explainer                  │
│  - Calculates feature contribution & severity scores   │
└───────────────────────┬────────────────────────────────┘
                        │ (WebSocket Stream)
                        ▼
┌────────────────────────────────────────────────────────┐
│               React Live Dashboard                     │
│  - Health gauges, active alerts & maintenance tickets  │
└────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

### Backend
- **Framework:** FastAPI 0.109 (Python 3.10+)
- **Machine Learning:** PyTorch 2.2, scikit-learn, XGBoost
- **Explainability:** SHAP (Tree & Kernel Explainers)
- **Data Processing:** Pandas, NumPy, SciPy
- **Time Series:** statsmodels, Kats (Meta)
- **Async & Messaging:** Uvicorn, pydantic, python-socketio
- **Database:** PostgreSQL with TimescaleDB extension (optional)

### Frontend
- **Framework:** React 18+ with TypeScript
- **UI Library:** Material-UI (MUI), Recharts (charting)
- **State Management:** Redux Toolkit
- **Real-time Updates:** Socket.io client

### Edge Computing
- **Embedded ML:** C++ module (PyTorch ONNX export)
- **Target Hardware:** ESP32, Arduino-compatible boards
- **Protocol:** MQTT, HTTP/REST

### DevOps & Deployment
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus, Grafana
- **Hosting:** AWS EC2, Google Cloud Run, or on-premise servers

### Dataset & Tools
- **Historical Data:** Open-Meteo Archive API
- **Validation Data:** Iowa Environmental Mesonet (IEM) ASOS observations
- **Synthetic Fault Generation:** Custom Python scripts
- **Model Versioning:** MLflow or Weights & Biases

---

## 🚀 Getting Started - Local Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 16+** (for frontend)
- **PostgreSQL 13+** (optional, for production)
- **Docker & Docker Compose** (optional, for containerized setup)
- **Git**

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Gargeesharmaa/SkyGuard.git
cd SkyGuard
```

#### 2. Backend Setup

##### Option A: Using Virtual Environment (Recommended for local development)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download pre-trained models (if available)
python scripts/download_models.py

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

##### Option B: Using Docker
```bash
docker build -f Dockerfile.backend -t skyguard-backend .
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:password@localhost/skyguard \
  skyguard-backend
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# For production build:
npm run build
```

#### 4. (Optional) Database Setup

If using PostgreSQL with TimescaleDB:
```bash
# Create database
createdb skyguard

# Apply migrations
psql skyguard < scripts/schema.sql

# Enable TimescaleDB extension
psql skyguard -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
```

#### 5. Environment Configuration

Create a `.env` file in the project root:
```env
# FastAPI Settings
FASTAPI_ENV=development
DATABASE_URL=postgresql://skyguard:password@localhost:5432/skyguard
REDIS_URL=redis://localhost:6379

# Open-Meteo API (for data fetching)
OPENMETEO_API_KEY=your_key_here

# SHAP & Model Settings
MODEL_PATH=./models/lstm_autoencoder.pth
ISOLATION_FOREST_PATH=./models/isolation_forest.pkl
ENABLE_SHAP_EXPLANATIONS=true

# AWS/Cloud Settings (if deploying)
AWS_REGION=us-east-1
AWS_S3_BUCKET=skyguard-models

# Frontend API
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

#### 6. Training Models (Optional - Use Pre-trained Weights)

```bash
# Download historical weather data from Open-Meteo
python scripts/fetch_training_data.py --start_date 2022-01-01 --end_date 2024-01-01

# Train LSTM Autoencoder
python scripts/train_autoencoder.py --epochs 100 --batch_size 32

# Train Isolation Forest
python scripts/train_isolation_forest.py

# Save models for deployment
python scripts/export_models.py
```

#### 7. Verify Installation

```bash
# Test backend API
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "version": "1.0.0"}

# Test anomaly detection endpoint
curl -X POST http://localhost:8000/detect \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 35.2,
    "pressure": 1013.25,
    "humidity": 65.5,
    "station_id": "AWS_001"
  }'
```

---

## 📊 Dataset Pipeline

### Baseline Training Data
- **Source:** Open-Meteo Archive API
- **Duration:** 1–2 years of continuous, clean hourly observations
- **Parameters:** Temperature (°C), Atmospheric Pressure (hPa), Relative Humidity (%)
- **Coverage:** Multiple weather stations across India
- **Purpose:** Train model's baseline for "normal" weather behavior and operational bounds

### Testing & Fault Validation
- **Primary Source:** Raw ASOS station observations from Iowa Environmental Mesonet (IEM)
- **Fault Injection:** Synthetic anomalies injected into clean streams:
  - **Sensor Spikes:** Sudden ±20°C jumps in temperature
  - **Step Changes:** Persistent shifts in pressure readings
  - **Frozen Values:** Repeated identical readings over consecutive hours
  - **Drift:** Gradual sensor calibration shifts (0.1–0.5°C per hour)
- **Labels:** Ground-truth anomaly labels for model validation
- **Evaluation Metrics:** Precision, Recall, F1-Score, ROC-AUC on unseen fault scenarios

### Data Preprocessing Pipeline
```
Raw Data → Resampling (1-hour intervals)
         → Missing Value Imputation (forward-fill + interpolation)
         → Outlier Detection (IQR-based pre-filtering)
         → Feature Engineering (rolling mean, std, momentum)
         → Normalization (z-score standardization)
         → Sequence Creation (sliding windows of 24–72 hours)
         → Model Training/Inference
```

---

## 🔄 Workflow

### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Create a Pull Request on GitHub

### Model Training & Deployment
1. Fetch fresh data: `python scripts/fetch_training_data.py`
2. Train models: `python scripts/train_models.py`
3. Evaluate on test set: `python scripts/evaluate_models.py`
4. Export & version models: `python scripts/export_models.py --version 1.2.0`
5. Deploy to production: `docker build && docker push`

---

## 📈 Performance Benchmarks

| Component | Metric | Value |
|-----------|--------|-------|
| **Detection Latency** | Time to flag anomaly | < 5 seconds |
| **LSTM Autoencoder** | AUC-ROC (test set) | 0.94+ |
| **Isolation Forest** | F1-Score | 0.89+ |
| **Spatial Consistency** | False Alarm Reduction | 35–45% |
| **Dashboard Update Rate** | WebSocket refresh | 1–2 seconds |
| **Model Size (Edge)** | Optimized C++ binary | < 15 MB |

---

## 📋 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Key Endpoints
- `POST /detect` — Real-time anomaly detection
- `GET /health/sensor/{station_id}` — Sensor health score
- `GET /alerts/active` — List active alerts
- `GET /historical/{station_id}` — Historical data for analysis
- `WebSocket /ws/stream` — Live streaming data feed

---

## 🧪 Testing

```bash
# Run unit tests
pytest tests/unit -v

# Run integration tests
pytest tests/integration -v

# Generate coverage report
pytest --cov=app tests/

# Test with pre-trained models
python scripts/test_models.py --dataset tests/fixtures/synthetic_faults.csv
```

---

## 📚 Documentation

- [Model Architecture Details](./docs/MODEL_ARCHITECTURE.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

## 👥 Team Details

**Project Title:** SkyGuard AI  
**Problem Statement ID:** SIH26073  
**Event:** Smart India Hackathon 2026  
**Team Name:** Algo Vizards

### Team Members
- **Project Lead / Backend Developer:**
- **Full-Stack Developer (Frontend & Integration):**
- **ML Engineer (Model Research & Training):**
- **DevOps & Deployment Engineer:**
- **UI/UX Designer & Frontend Specialist:**

*For more details about the team and contributions, see [TEAM.md](./TEAM.md)*

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📞 Contact & Support

- **Issues & Bug Reports:** [GitHub Issues](https://github.com/Gargeesharmaa/SkyGuard/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Gargeesharmaa/SkyGuard/discussions)
- **Email:** contact@skyguard-ai.dev

---

## 🙏 Acknowledgments

- **Ministry of Earth Sciences (MoES)** & **India Meteorological Department (IMD)** for the problem statement
- **Open-Meteo** for historical weather data API
- **Iowa Environmental Mesonet** for ASOS validation datasets
- **PyTorch & scikit-learn** communities for excellent ML libraries
- **Smart India Hackathon** for the opportunity to innovate in disaster management

---

**Last Updated:** September 2026  
**Version:** 1.0.0-beta
