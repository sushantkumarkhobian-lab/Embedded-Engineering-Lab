#include "fault_manager.h"

#include "../telemetry/telemetry.h"

#include "../mission/mission_manager.h"

#include "../../include/config.h"


void faultTask(
    void *parameter
)
{
    while (true)
    {
        float temperature;
        float radiation;
        float battery;


        xSemaphoreTake(
            telemetryMutex,
            portMAX_DELAY
        );

        temperature =
            telemetry.temperature;

        radiation =
            telemetry.radiation;

        battery =
            telemetry.battery;

        xSemaphoreGive(
            telemetryMutex
        );


        // ====================================
        // Thermal fault
        // ====================================

        if (
            temperature >=
            CRITICAL_TEMPERATURE
        )
        {
            Serial.println(
                "[FAULT] CRITICAL THERMAL"
            );

            xSemaphoreTake(
                telemetryMutex,
                portMAX_DELAY
            );

            telemetry.faultFlags |=
                FAULT_THERMAL;

            xSemaphoreGive(
                telemetryMutex
            );

            setMissionState(
                MissionState::EMERGENCY
            );
        }


        // ====================================
        // Radiation fault
        // ====================================

        if (
            radiation >=
            HIGH_RADIATION_THRESHOLD
        )
        {
            Serial.println(
                "[FAULT] HIGH RADIATION"
            );

            xSemaphoreTake(
                telemetryMutex,
                portMAX_DELAY
            );

            telemetry.faultFlags |=
                FAULT_RADIATION;

            xSemaphoreGive(
                telemetryMutex
            );


            if (
                missionState !=
                MissionState::EMERGENCY
            )
            {
                setMissionState(
                    MissionState::SAFE_MODE
                );
            }
        }


        // ====================================
        // Battery fault
        // ====================================

        if (
            battery <=
            CRITICAL_BATTERY_THRESHOLD
        )
        {
            Serial.println(
                "[FAULT] CRITICAL BATTERY"
            );

            xSemaphoreTake(
                telemetryMutex,
                portMAX_DELAY
            );

            telemetry.faultFlags |=
                FAULT_LOW_BATTERY;

            xSemaphoreGive(
                telemetryMutex
            );

            setMissionState(
                MissionState::LOW_POWER
            );
        }


        vTaskDelay(
            pdMS_TO_TICKS(
                FAULT_INTERVAL_MS
            )
        );
    }
}