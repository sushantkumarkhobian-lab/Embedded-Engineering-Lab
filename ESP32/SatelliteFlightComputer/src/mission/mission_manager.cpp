#include "mission_manager.h"

#include "../telemetry/telemetry.h"

#include "../../include/config.h"

MissionState missionState =
    MissionState::BOOT;


const char* stateToString(
    MissionState state
)
{
    switch (state)
    {
        case MissionState::BOOT:
            return "BOOT";

        case MissionState::DEPLOYED:
            return "DEPLOYED";

        case MissionState::NOMINAL:
            return "NOMINAL";

        case MissionState::LOW_POWER:
            return "LOW_POWER";

        case MissionState::SAFE_MODE:
            return "SAFE_MODE";

        case MissionState::EMERGENCY:
            return "EMERGENCY";
    }

    return "UNKNOWN";
}


const char* missionStateToString()
{
    return stateToString(
        missionState
    );
}


void initMissionManager()
{
    missionState =
        MissionState::BOOT;

    Serial.println(
        "[MISSION] Manager initialized"
    );
}


void setMissionState(
    MissionState newState
)
{
    if (newState == missionState)
        return;

    Serial.print(
        "[MISSION] "
    );

    Serial.print(
        stateToString(missionState)
    );

    Serial.print(
        " -> "
    );

    Serial.println(
        stateToString(newState)
    );

    missionState =
        newState;
}


void evaluateMissionState()
{
    float battery;
    float temperature;
    float radiation;

    xSemaphoreTake(
        telemetryMutex,
        portMAX_DELAY
    );

    battery =
        telemetry.battery;

    temperature =
        telemetry.temperature;

    radiation =
        telemetry.radiation;

    xSemaphoreGive(
        telemetryMutex
    );


    // Critical thermal condition

    if (
        temperature >=
        CRITICAL_TEMPERATURE
    )
    {
        setMissionState(
            MissionState::EMERGENCY
        );

        return;
    }


    // High radiation

    if (
        radiation >=
        HIGH_RADIATION_THRESHOLD
    )
    {
        setMissionState(
            MissionState::SAFE_MODE
        );

        return;
    }


    // Critical battery

    if (
        battery <=
        CRITICAL_BATTERY_THRESHOLD
    )
    {
        setMissionState(
            MissionState::LOW_POWER
        );

        return;
    }


    // Low battery

    if (
        battery <=
        LOW_BATTERY_THRESHOLD
    )
    {
        setMissionState(
            MissionState::LOW_POWER
        );

        return;
    }


    // Normal boot sequence

    if (
        missionState ==
        MissionState::BOOT
    )
    {
        setMissionState(
            MissionState::DEPLOYED
        );

        return;
    }


    if (
        missionState ==
        MissionState::DEPLOYED
    )
    {
        setMissionState(
            MissionState::NOMINAL
        );

        return;
    }
}


void missionTask(void *parameter)
{
    while (true)
    {
        evaluateMissionState();

        vTaskDelay(
            pdMS_TO_TICKS(
                MISSION_INTERVAL_MS
            )
        );
    }
}