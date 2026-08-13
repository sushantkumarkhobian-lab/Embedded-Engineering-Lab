#include "attitude_manager.h"

#include "../telemetry/telemetry.h"

#include "../../include/config.h"


void attitudeTask(
    void *parameter
)
{
    while (true)
    {
        xSemaphoreTake(
            telemetryMutex,
            portMAX_DELAY
        );


        // Simulated spacecraft rotation

        telemetry.roll += 0.15;

        telemetry.pitch += 0.08;

        telemetry.yaw += 0.25;


        // Keep angles bounded

        if (
            telemetry.roll > 180
        )
        {
            telemetry.roll -= 360;
        }


        if (
            telemetry.pitch > 180
        )
        {
            telemetry.pitch -= 360;
        }


        if (
            telemetry.yaw > 360
        )
        {
            telemetry.yaw -= 360;
        }


        xSemaphoreGive(
            telemetryMutex
        );


        vTaskDelay(
            pdMS_TO_TICKS(
                ATTITUDE_INTERVAL_MS
            )
        );
    }
}