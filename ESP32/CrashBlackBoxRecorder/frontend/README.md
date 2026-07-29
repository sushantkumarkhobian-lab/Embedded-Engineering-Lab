# Crash Black Box Recorder Dashboard

The dashboard provides a real-time visualization of the ESP32 diagnostics collected by the firmware and served through the backend.

Its primary objective is to present embedded system health information in a clean, intuitive interface without requiring direct access to the device.

The dashboard periodically retrieves data from the backend using REST APIs and updates the displayed information automatically.

---

## Responsibilities

- Display live device diagnostics
- Display previous crash information
- Automatically refresh device status
- Present embedded telemetry in a user-friendly format

---

## Dashboard Information

### Live Device Status

Displays:

- Firmware Version
- Chip Model
- Reset Reason
- Restart Count
- Free Heap
- CPU Frequency
- Device Uptime
- Wi-Fi RSSI
- SSID
- IP Address
- MAC Address

---

### Previous Crash Report

Displays:

- Firmware Version
- Reset Reason
- Restart Count
- Free Heap
- Device Uptime
- Wi-Fi RSSI

---

## Directory Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

---

## Technology Stack

- React
- TypeScript
- Vite

---

## Installation

```bash
npm install
```

---

## Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

The dashboard communicates with the backend over HTTP and visualizes the latest telemetry received from the ESP32 firmware.