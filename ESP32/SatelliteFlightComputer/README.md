# Satellite Flight Computer

![ESP32](https://img.shields.io/badge/ESP32-Microcontroller-blue)
![C++](https://img.shields.io/badge/C%2B%2B-Firmware-blue)
![FreeRTOS](https://img.shields.io/badge/FreeRTOS-RTOS-red)
![PlatformIO](https://img.shields.io/badge/PlatformIO-Embedded-orange)
![WiFi](https://img.shields.io/badge/WiFi-802.11-green)
![TCP](https://img.shields.io/badge/TCP-Communication-blue)
![Python](https://img.shields.io/badge/Python-Ground%20Station-yellow)
![JSON](https://img.shields.io/badge/JSON-Telemetry-lightgrey)

A production-oriented embedded flight computer built around the ESP32 that simulates the core onboard software of a small satellite, including mission management, real-time telemetry, spacecraft attitude, power monitoring, fault detection, and emergency procedures.

The project is designed as a learning exercise in production-grade embedded firmware architecture rather than a traditional academic project. It emphasizes FreeRTOS-based concurrent execution, modular firmware design, real-time telemetry, reliable Wi-Fi communication, command handling, and autonomous fault response.

---

# Overview

A satellite flight computer is responsible for managing spacecraft operations, monitoring system health, processing commands, and responding to abnormal conditions with minimal dependence on external systems.

This project recreates these core responsibilities using an ESP32 as the onboard flight computer. Spacecraft parameters such as altitude, temperature, radiation, battery level, solar generation, and orientation are simulated in firmware, allowing the system to demonstrate flight-software concepts without requiring physical aerospace sensors.

A Python-based ground station communicates with the ESP32 over Wi-Fi using TCP, allowing operators to request telemetry, issue mission commands, and inject simulated spacecraft faults.

The flight computer uses FreeRTOS tasks to independently manage mission control, telemetry, power, attitude, communication, and fault handling.

---

# Screenshots

The following screenshots demonstrate the complete system from boot and telemetry generation to ground communication and autonomous fault handling.

## Flight Computer Boot Sequence

<img width="707" height="538" alt="Screenshot 2026-08-13 151626" src="https://github.com/user-attachments/assets/41dbd25d-6712-4778-89ec-0fb7da59fa48" />

## Real-Time Telemetry

<img width="1265" height="227" alt="Screenshot 2026-08-13 152119" src="https://github.com/user-attachments/assets/2fee412a-6907-4093-997f-e17727a5157c" />

## Ground Station Connection

<img width="1477" height="606" alt="Screenshot 2026-08-13 152216" src="https://github.com/user-attachments/assets/6423db07-e1c4-4463-85a4-45bc4d5329f4" />

## Ground-to-Satellite Telemetry Request

<img width="1897" height="902" alt="Screenshot 2026-08-13 152329" src="https://github.com/user-attachments/assets/81cb4d4f-8994-4532-ab2a-2f77b30dac02" />

## Simulated Fault Injection

<img width="520" height="485" alt="Screenshot 2026-08-13 152426" src="https://github.com/user-attachments/assets/650c9e38-d5c3-468a-808d-f089816a0e2e" />

## Autonomous Emergency Response

<img width="1258" height="558" alt="Screenshot 2026-08-13 152509" src="https://github.com/user-attachments/assets/6f572398-0920-418f-bebb-f294026f7cec" />

---

# Features

## Flight Computer

- Mission state management
- FreeRTOS-based task architecture
- Real-time telemetry generation
- Simulated spacecraft altitude
- Simulated temperature monitoring
- Simulated radiation monitoring
- Simulated battery and solar power
- Simulated roll, pitch, and yaw
- Fault detection and handling
- Emergency state transitions
- Modular firmware architecture

---

## Communication

- ESP32 Wi-Fi connectivity
- TCP-based ground communication
- Command/response protocol
- Real-time telemetry transmission
- Ground-to-flight-computer command handling
- Connection management

---

## Ground Station

- Python-based command interface
- Real-time telemetry reception
- Mission control commands
- Fault injection
- Telemetry requests
- Emergency-state testing
- Lightweight terminal-based operation

---

# System Architecture

    +--------------------------+
    |    Python Ground         |
    |       Station            |
    |--------------------------|
    | Command Interface        |
    | Telemetry Receiver       |
    | Fault Injection          |
    +------------+-------------+
                 |
            Wi-Fi / TCP
                 |
                 v
    +-----------------------------------------+
    |                  ESP32                  |
    |         Satellite Flight Computer       |
    |-----------------------------------------|
    |                                         |
    |  +-------------+   +----------------+  |
    |  | Mission     |   | Telemetry      |  |
    |  | Manager     |   | Manager        |  |
    |  +-------------+   +----------------+  |
    |                                         |
    |  +-------------+   +----------------+  |
    |  | Power       |   | Attitude       |  |
    |  | Manager     |   | Manager        |  |
    |  +-------------+   +----------------+  |
    |                                         |
    |  +-------------+   +----------------+  |
    |  | Command     |   | Fault          |  |
    |  | Handler     |   | Manager        |  |
    |  +-------------+   +----------------+  |
    |                                         |
    |              FreeRTOS                   |
    +-----------------------------------------+

---

# Firmware Architecture

    main.cpp
       |
       +-------------------+-------------------+
       |                   |                   |
       v                   v                   v
    Mission Manager    Telemetry Manager   Wi-Fi Manager
       |                   |                   |
       v                   v                   v
    Mission State       Telemetry          TCP Server
     Machine            Generation         Communication
       |                   |                   |
       +-------------+-----+-------------------+
                     |
              +------+------+
              |             |
              v             v
        Power Manager   Attitude Manager
              |             |
              +------+------+
                     |
                     v
               Fault Manager
                     |
                     v
             Emergency Handling

---

# FreeRTOS Architecture

The ESP32 firmware uses FreeRTOS to execute major flight-computer functions as independent concurrent tasks.

    +------------------------------------------------+
    |                  FreeRTOS                      |
    |                                                |
    |  MissionTask       -> Mission state machine   |
    |  TelemetryTask     -> Telemetry generation    |
    |  PowerTask         -> Battery / solar model   |
    |  AttitudeTask      -> Roll / pitch / yaw      |
    |  CommandTask       -> Ground command handling |
    |  FaultTask         -> Fault monitoring        |
    |  WiFiTask          -> TCP communication       |
    |                                                |
    +------------------------------------------------+

This allows different flight-computer functions to operate independently while sharing the spacecraft's system state.

---

# Mission State Machine

The flight computer uses a state machine to represent the spacecraft's operational condition.

                    +----------+
                    |   BOOT   |
                    +----+-----+
                         |
                         v
                   +-----------+
                   | DEPLOYED  |
                   +-----+-----+
                         |
                         v
                   +-----------+
                   |  NOMINAL  |
                   +-----+-----+
                         |
              +----------+----------+
              |                     |
              v                     v
        +-----------+         +-------------+
        |   SAFE    |         |  EMERGENCY  |
        +-----------+         +-------------+

The system begins in BOOT, transitions through DEPLOYED, and enters NOMINAL operation.

Critical faults can force the flight computer into EMERGENCY mode.

Example:

    Thermal Fault
          |
          v
    Fault Detection
          |
          v
    NOMINAL -> EMERGENCY

---

# Telemetry

The flight computer continuously generates simulated spacecraft telemetry.

Example telemetry packet:

    {
      "id": "SFC-001",
      "mission": "NOMINAL",
      "altitude": 400.00,
      "temperature": 25.00,
      "radiation": 0.200,
      "battery": 85.39,
      "solar": 60.00,
      "roll": 1.65,
      "pitch": 0.88,
      "yaw": 2.75,
      "faults": 0
    }

The telemetry system currently represents:

- Mission state
- Altitude
- Temperature
- Radiation
- Battery percentage
- Solar generation
- Roll
- Pitch
- Yaw
- Fault status

---

# Ground Communication

The Python ground station communicates with the ESP32 using TCP over Wi-Fi.

                  Ground Station
                        |
                        | TCP Command
                        v
                  +-----------+
                  |   ESP32   |
                  |   Flight  |
                  |  Computer |
                  +-----+-----+
                        |
                        | Telemetry / ACK
                        v
                  Ground Station

Example command:

    CMD:GET_TELEMETRY

The flight computer processes the command and returns the current spacecraft telemetry.

---

# Ground Control Commands

The Python ground station provides a command interface for interacting with the flight computer.

| Command | Function |
|---|---|
| CMD:GET_TELEMETRY | Request current spacecraft telemetry |
| CMD:ENTER_SAFE | Enter safe mode |
| CMD:EXIT_SAFE | Exit safe mode |
| CMD:DEPLOY | Trigger deployment state |
| CMD:NOMINAL | Enter nominal operation |
| CMD:FAULT:THERMAL | Inject thermal fault |
| CMD:FAULT:RADIATION | Inject radiation fault |
| CMD:FAULT:BATTERY | Inject battery fault |
| CMD:CLEAR_FAULTS | Clear active faults |
| CMD:REBOOT | Reboot the flight computer |

---

# Fault Management

The system includes simulated fault injection to demonstrate autonomous flight-computer response.

For example, the ground station can inject a thermal fault:

    CMD:FAULT:THERMAL

The ESP32 processes the command through the command and fault-management modules.

    Ground Station
          |
          | FAULT:THERMAL
          v
    Command Handler
          |
          v
    Fault Manager
          |
          v
    Critical Thermal Fault
          |
          v
    NOMINAL -> EMERGENCY

The resulting emergency state is reflected in subsequent telemetry.

---

# Project Structure

    SatelliteFlightComputer/
    ├── README.md
    │
    ├── include/
    │
    ├── src/
    │   ├── attitude/
    │   ├── command/
    │   ├── communication/
    │   ├── fault/
    │   ├── mission/
    │   ├── power/
    │   ├── telemetry/
    │   └── main.cpp
    │
    ├── python/
    │   └── ground_station.py
    │
    ├── lib/
    ├── test/
    ├── .gitignore
    └── platformio.ini

---

# Technology Stack

## Embedded

- ESP32
- C++
- PlatformIO
- Arduino Framework
- FreeRTOS

## Communication

- Wi-Fi
- TCP
- JSON
- Custom command/telemetry protocol

## Ground Station

- Python
- TCP Socket Programming
- JSON

---

# Data Flow

    ESP32 Boot
         |
         v
    Initialize Flight Computer
         |
         v
    Initialize Mission Manager
         |
         v
    Connect to Wi-Fi
         |
         v
    Start TCP Server
         |
         v
    Start FreeRTOS Tasks
         |
         v
    Generate Telemetry
         |
         v
    Receive Ground Commands
         |
         v
    Process Commands / Faults
         |
         v
    Update Mission State
         |
         v
    Return Telemetry / ACK

---

# Current Implementation

- ✔ ESP32 flight computer
- ✔ Modular firmware architecture
- ✔ FreeRTOS task-based execution
- ✔ Mission state machine
- ✔ Telemetry generation
- ✔ Wi-Fi communication
- ✔ TCP server
- ✔ Python ground station
- ✔ Ground command handling
- ✔ Simulated spacecraft attitude
- ✔ Simulated power system
- ✔ Simulated environmental parameters
- ✔ Fault injection
- ✔ Emergency state handling
- ✔ Real-time telemetry response

---

# Future Improvements

## Flight Software

- Watchdog-based subsystem recovery
- Persistent flight-event logging
- NVS-based fault history
- OTA firmware updates
- Command authentication
- CRC-based telemetry validation
- Telemetry sequence numbers
- Communication timeout handling
- Automatic Wi-Fi reconnection
- Subsystem health monitoring

## Spacecraft Simulation

- Orbital position simulation
- Eclipse detection
- Solar-panel generation modelling
- More realistic battery dynamics
- Radiation-event simulation
- Thermal dynamics
- Orbital altitude variation
- Attitude disturbance modelling
- Simulated sensor abstraction layer

## Ground Station

- Continuous telemetry logging
- Command acknowledgement tracking
- Telemetry replay
- Automated fault scenarios
- Packet-loss simulation
- Ground-to-space communication timeout simulation

---

# Getting Started

## Firmware

Open the project in PlatformIO and connect the ESP32.

Build the firmware:

    pio run

Upload to the ESP32:

    pio run --target upload

Open the serial monitor:

    pio device monitor

Use a baud rate of:

    115200

The flight computer will initialize, connect to Wi-Fi, start its TCP server, and launch its FreeRTOS tasks.

---

## Ground Station

From the project root:

    python python/ground_station.py

Before running the ground station, update the ESP32 IP address in:

    python/ground_station.py

Example:

    ESP32_IP = "10.136.88.24"
    TCP_PORT = 5000

The ground station will connect to the ESP32 and provide the available flight-computer commands.

---

# Author

**Sushant Kumar Khobian**

Embedded Systems • Firmware • IoT • Edge Computing

---

*This project is part of the **Embedded Engineering Lab**, a collection of production-oriented embedded systems modules built to explore real-world firmware architecture, RTOS, embedded communication, and systems engineering practices.*
