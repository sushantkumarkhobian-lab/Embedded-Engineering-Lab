#ifndef TELEMETRY_H
#define TELEMETRY_H

#include <Arduino.h>

struct SatelliteTelemetry
{
    float altitude;

    float temperature;
    float radiation;

    float battery;
    float solarPower;

    float orbitX;
    float orbitY;
    float orbitZ;

    float roll;
    float pitch;
    float yaw;

    uint32_t timestamp;

    uint32_t faultFlags;
};

extern SatelliteTelemetry telemetry;

extern SemaphoreHandle_t telemetryMutex;

void initTelemetry();

void telemetryTask(void *parameter);

String getTelemetryJSON();

#endif