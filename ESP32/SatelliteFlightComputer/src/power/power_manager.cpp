#include "power_manager.h"

#include "../telemetry/telemetry.h"

#include "../mission/mission_manager.h"

#include "../../include/config.h"


void powerTask(
    void *parameter
)
{
    while (true)
    {
        xSemaphoreTake(
            telemetryMutex,
            portMAX_DELAY
        );

        float battery =
            telemetry.battery;

        float solarPower =
            telemetry.solarPower;

        xSemaphoreGive(
            telemetryMutex
        );


        // Solar charging

        if (
            solarPower > 50.0
        )
        {
            battery += 0.15;
        }
        else
        {
            battery -= 0.08;
        }


        // Normal spacecraft consumption

        battery -= 0.02;


        // Emergency consumes more power

        if (
            missionState ==
            MissionState::EMERGENCY
        )
        {
            battery -= 0.15;
        }


        // Low power mode saves energy

        if (
            missionState ==
            MissionState::LOW_POWER
        )
        {
            battery += 0.03;
        }


        battery = constrain(
            battery,
            0.0,
            100.0
        );


        xSemaphoreTake(
            telemetryMutex,
            portMAX_DELAY
        );

        telemetry.battery =
            battery;

        xSemaphoreGive(
            telemetryMutex
        );


        vTaskDelay(
            pdMS_TO_TICKS(
                POWER_INTERVAL_MS
            )
        );
    }
}