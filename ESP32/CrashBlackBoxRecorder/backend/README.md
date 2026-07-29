# Crash Black Box Recorder Backend

The backend acts as the communication bridge between the embedded firmware and the web dashboard.

It receives telemetry from the ESP32 over HTTP, exposes REST APIs for dashboard consumption, and serves as the central data layer for the monitoring system.

The current implementation stores incoming data in memory. Future versions will integrate MongoDB for persistent storage and historical analysis.

---

## Responsibilities

- Receive live telemetry from the ESP32
- Receive previous crash reports
- Expose REST APIs
- Validate incoming requests
- Serve dashboard data

---

## API Endpoints

### Health Check

```
GET /health
```

Verifies that the backend service is running.

---

### Current Device Status

```
POST /api/device/status
```

Receives live diagnostics from the ESP32.

```
GET /api/device/status
```

Returns the latest device status for the dashboard.

---

### Previous Crash Report

```
POST /api/device/previous-crash
```

Receives the most recently stored crash report.

```
GET /api/device/previous-crash
```

Returns the stored crash report for visualization.

---

## Directory Structure

```text
backend/
├── server.js
├── package.json
└── package-lock.json
```

---

## Technology Stack

- Node.js
- Express.js
- REST API

---

## Installation

```bash
npm install
```

---

## Run

```bash
node server.js
```

The backend runs on:

```
http://localhost:3000
```

and is designed to receive HTTP requests from the ESP32 firmware over the local network.