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

Automatic Weather Stations (AWS) are critical components of modern meteorological observation networks. However, weather data streams often suffer from sensor spikes, calibration drift, frozen values, communication failures, and environmental degradation. Traditional threshold-based quality control methods fail to catch subtle or complex multivariate anomalies.

**SkyGuard AI** is a multi-layer AI/ML platform engineered to monitor real-time weather parameters using **strictly three inputs**[cite: 1]:
1. **Temperature (°C)**[cite: 1]
2. **Atmospheric Pressure (hPa)**[cite: 1]
3. **Relative Humidity (%)**[cite: 1]

By evaluating temporal patterns, multivariate correlations, and spatial neighbor consistency, SkyGuard AI reliably distinguishes genuine extreme weather events from hardware sensor faults while generating explainable root-cause diagnostics[cite: 1].

---

## 🚀 Key Features

* **Real-Time Anomaly Detection:** Identifies sensor spikes, step changes, frozen values, and drift in $< 5$ seconds[cite: 1].
* **Dual-Model ML Architecture:** Combines a PyTorch **LSTM Autoencoder** (temporal sequences) with **Isolation Forest** (multivariate outlier point checks)[cite: 1].
* **Spatial Neighbor Cross-Checking:** Compares observations against surrounding stations to prevent false alarms during extreme weather events[cite: 1].
* **Explainable AI (SHAP):** Provides transparent feature attribution scores explaining exactly why an anomaly was flagged[cite: 1].
* **Predictive Health Scoring:** Tracks degradation trends over time to output continuous **Sensor Health Scores (0–100)** for maintenance teams[cite: 1].
* **Edge AI Compatibility:** Includes a lightweight C++ module optimized for microcontrollers like the ESP32[cite: 1].

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
