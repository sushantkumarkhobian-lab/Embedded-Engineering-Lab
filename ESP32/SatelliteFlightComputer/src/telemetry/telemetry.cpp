#include "telemetry.h"

#include "../mission/mission_manager.h"

#include "../../include/config.h"

SatelliteTelemetry telemetry;

SemaphoreHandle_t telemetryMutex;

void initTelemetry()
{
    telemetryMutex = xSemaphoreCreateMutex();

    telemetry.altitude = 400.0;

    telemetry.temperature = 25.0;

    telemetry.radiation = 0.20;

    telemetry.battery = 85.0;

    telemetry.solarPower = 60.0;

    telemetry.orbitX = 1.0;
    telemetry.orbitY = 0.0;
    telemetry.orbitZ = 0.0;

    telemetry.roll = 0.0;
    telemetry.pitch = 0.0;
    telemetry.yaw = 0.0;

    telemetry.timestamp = millis();

    telemetry.faultFlags = 0;
}

String getTelemetryJSON()
{
    String json = "{";

    xSemaphoreTake(
        telemetryMutex,
        portMAX_DELAY
    );

    json += "\"id\":\"";
    json += SATELLITE_ID;
    json += "\",";

    json += "\"mission\":\"";
    json += missionStateToString();
    json += "\",";

    json += "\"altitude\":";
    json += String(telemetry.altitude, 2);
    json += ",";

    json += "\"temperature\":";
    json += String(telemetry.temperature, 2);
    json += ",";

    json += "\"radiation\":";
    json += String(telemetry.radiation, 3);
    json += ",";

    json += "\"battery\":";
    json += String(telemetry.battery, 2);
    json += ",";

    json += "\"solar\":";
    json += String(telemetry.solarPower, 2);
    json += ",";

    json += "\"roll\":";
    json += String(telemetry.roll, 2);
    json += ",";

    json += "\"pitch\":";
    json += String(telemetry.pitch, 2);
    json += ",";

    json += "\"yaw\":";
    json += String(telemetry.yaw, 2);
    json += ",";

    json += "\"faults\":";
    json += String(telemetry.faultFlags);

    json += "}";

    xSemaphoreGive(
        telemetryMutex
    );

    return json;
}

void telemetryTask(void *parameter)
{
    while (true)
    {
        String packet = getTelemetryJSON();

        Serial.println(
            "[TELEMETRY] " + packet
        );

        vTaskDelay(
            pdMS_TO_TICKS(
                TELEMETRY_INTERVAL_MS
            )
        );
    }
}