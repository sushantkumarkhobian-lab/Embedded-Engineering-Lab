# Crash Black Box Recorder Firmware

The firmware is the core of the Crash Black Box Recorder system. It runs on the ESP32 and is responsible for monitoring the device, collecting runtime diagnostics, persisting crash-related information in non-volatile storage, managing network connectivity, and transmitting telemetry to the backend over HTTP.

The firmware follows a modular architecture where each subsystem is implemented independently to improve maintainability, scalability, and code reusability.

---

## Responsibilities

- Collect runtime diagnostics
- Detect reset reasons
- Maintain restart counter
- Store crash information using ESP32 NVS
- Manage Wi-Fi connectivity
- Transmit telemetry to the backend through REST APIs

---

## Modules

### Diagnostics

Collects runtime information from the ESP32 including:

- Firmware Version
- Chip Model
- Reset Reason
- Free Heap
- CPU Frequency
- Device Uptime

---

### Storage

Responsible for persistent storage using ESP32 Non-Volatile Storage (NVS).

Stores:

- Previous crash report
- Restart counter
- Runtime snapshot before reboot

---

### Wi-Fi Manager

Handles all wireless connectivity.

Responsibilities include:

- Wi-Fi initialization
- Automatic reconnection
- Connection monitoring
- Network information retrieval
- RSSI monitoring

---

### API Client

Responsible for communication with the backend.

Functions include:

- Sending live device status
- Sending previous crash report
- Handling HTTP requests and responses

---

## Directory Structure

```text
firmware/
├── include/
├── lib/
├── src/
├── test/
└── platformio.ini
```

---

## Development Environment

- PlatformIO
- Arduino Framework
- ESP32 Dev Module
- C++

---

## Build

```bash
pio run
```

---

## Upload

```bash
pio run --target upload
```

---

## Serial Monitor

```bash
pio device monitor
```

Although the project primarily communicates through HTTP, the serial monitor can be used during development for debugging and validation.