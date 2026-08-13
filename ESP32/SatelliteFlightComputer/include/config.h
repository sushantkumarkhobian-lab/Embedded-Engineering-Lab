#ifndef CONFIG_H
#define CONFIG_H

// ==========================================
// Wi-Fi configuration
// ==========================================

#define WIFI_SSID       "YOUR_WIFI_NAME"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

#define TCP_PORT        5000

// ==========================================
// Satellite
// ==========================================

#define SATELLITE_ID    "SFC-001"

// ==========================================
// Mission thresholds
// ==========================================

#define LOW_BATTERY_THRESHOLD       20.0
#define CRITICAL_BATTERY_THRESHOLD  10.0

#define HIGH_TEMPERATURE_THRESHOLD  70.0
#define CRITICAL_TEMPERATURE        80.0

#define HIGH_RADIATION_THRESHOLD    0.80

// ==========================================
// Task timing
// ==========================================

#define TELEMETRY_INTERVAL_MS       1000
#define POWER_INTERVAL_MS           500
#define ATTITUDE_INTERVAL_MS        100
#define FAULT_INTERVAL_MS           100
#define MISSION_INTERVAL_MS         100
#define COMMAND_INTERVAL_MS         10

#endif