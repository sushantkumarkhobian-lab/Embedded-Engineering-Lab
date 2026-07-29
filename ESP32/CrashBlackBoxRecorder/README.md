# Crash Black Box Recorder

A production-oriented embedded monitoring system built around the ESP32 that continuously collects device diagnostics, persists crash information in non-volatile memory, and exposes telemetry through a REST API for real-time visualization.

The project is designed as a learning exercise in production-grade embedded firmware architecture rather than a traditional academic project. It emphasizes modular firmware design, persistent storage, reliable communication, and system observability.

---

# Overview

Embedded systems often fail without providing enough information to determine what happened before the failure. This makes debugging field devices difficult, especially when physical access is limited.

Crash Black Box Recorder addresses this problem by continuously monitoring the device, storing important runtime information in non-volatile memory, and making both live diagnostics and the most recent crash report available through a web dashboard.

The project demonstrates how embedded firmware can be integrated with backend services and monitoring dashboards while maintaining a clean and modular architecture.

---

# Features

## Firmware

- Runtime diagnostics collection
- Reset reason detection
- Restart counter
- Free heap monitoring
- CPU frequency monitoring
- Device uptime tracking
- Persistent crash storage using ESP32 NVS
- Wi-Fi connectivity management
- HTTP communication with backend

---

## Backend

- REST API server
- Receives live telemetry
- Receives previous crash reports
- Serves dashboard data
- Lightweight Node.js implementation

---

## Dashboard

- Live device monitoring
- Previous crash visualization
- Automatic refresh
- Responsive interface
- Simple embedded system health overview

---

# System Architecture

```text
                   +----------------------+
                   |      ESP32 Device    |
                   |----------------------|
                   | Diagnostics Module   |
                   | Storage Module       |
                   | Wi-Fi Manager        |
                   | API Client           |
                   +----------+-----------+
                              |
                         HTTP Requests
                              |
                              ▼
                 +------------------------+
                 |    Node.js Backend     |
                 |------------------------|
                 | REST API               |
                 | Data Management        |
                 +-----------+------------+
                             |
                       HTTP Responses
                             |
                             ▼
               +----------------------------+
               |      React Dashboard       |
               |----------------------------|
               | Current Device Status      |
               | Previous Crash Report      |
               +----------------------------+
```

---

# Firmware Architecture

```text
                     main.cpp
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
      ▼                  ▼                  ▼
Diagnostics         Storage         Wi-Fi Manager
      │                  │                  │
      └──────────────┬───┴──────────────────┘
                     ▼
                API Client
                     │
                     ▼
              Backend REST API
```

---

# Project Structure

```text
CrashBlackBoxRecorder/
├── README.md
│
├── firmware/
│   ├── include/
│   ├── src/
│   ├── lib/
│   ├── test/
│   └── platformio.ini
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

# Technology Stack

## Embedded

- ESP32
- C++
- PlatformIO
- Arduino Framework

## Communication

- HTTP
- REST APIs
- Wi-Fi

## Backend

- Node.js
- Express.js

## Frontend

- React
- TypeScript
- Vite

---

# Data Flow

```text
ESP32 Boot
     │
     ▼
Initialize Diagnostics
     │
     ▼
Load Previous Crash Report
     │
     ▼
Connect to Wi-Fi
     │
     ▼
Collect Runtime Information
     │
     ▼
Store Current Snapshot
     │
     ▼
Send Telemetry to Backend
     │
     ▼
Backend Updates REST API
     │
     ▼
Dashboard Fetches Latest Data
```

---

# Current Implementation

- ✔ Diagnostics module
- ✔ Storage module
- ✔ Wi-Fi manager
- ✔ HTTP API client
- ✔ REST backend
- ✔ React dashboard
- ✔ Live telemetry
- ✔ Previous crash report
- ✔ Restart counter
- ✔ Device health monitoring

---

# Future Improvements

## Firmware

- MQTT support
- OTA firmware updates
- Watchdog diagnostics
- Heap fragmentation analysis
- FreeRTOS task monitoring
- Brownout detection
- Ring buffer crash history
- SD card logging

## Backend

- MongoDB integration
- Historical telemetry storage
- Authentication
- Device registration
- Multi-device support

## Dashboard

- Historical graphs
- Live charts
- Device management
- Event timeline
- Dark mode
- Export logs
- Mobile responsive improvements

---

# Getting Started

## Firmware

```bash
cd firmware
pio run
pio run --target upload
```

---

## Backend

```bash
cd backend
npm install
node server.js
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Screenshots

> Dashboard screenshots, firmware output, and architecture diagrams will be added as the project evolves.

---

# License

This project is released under the MIT License.

---

# Author

**Sushant Kumar Khobian**

Embedded Systems • Firmware • IoT • Edge Computing

---

*This project is part of the **Embedded Engineering Lab**, a collection of production-oriented embedded systems modules built to explore real-world firmware architecture, IoT communication, and embedded software engineering practices.*