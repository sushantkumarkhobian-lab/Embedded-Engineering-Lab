#include "command_handler.h"

#include "../mission/mission_manager.h"

#include "../telemetry/telemetry.h"

#include "../communication/wifi_manager.h"


void reply(
    const String& message
)
{
    Serial.print(
        "[TCP TX] "
    );

    Serial.println(
        message
    );

    sendToGround(
        message
    );
}


void processCommand(
    String command
)
{
    command.trim();

    Serial.print(
        "[COMMAND] "
    );

    Serial.println(
        command
    );


    // ====================================
    // Telemetry
    // ====================================

    if (
        command ==
        "CMD:GET_TELEMETRY"
    )
    {
        String telemetryPacket =
            getTelemetryJSON();

        reply(
            telemetryPacket
        );

        return;
    }


    // ====================================
    // Mission commands
    // ====================================

    if (
        command ==
        "CMD:ENTER_SAFE"
    )
    {
        setMissionState(
            MissionState::SAFE_MODE
        );

        reply(
            "ACK:ENTER_SAFE"
        );

        return;
    }


    if (
        command ==
        "CMD:EXIT_SAFE"
    )
    {
        setMissionState(
            MissionState::NOMINAL
        );

        reply(
            "ACK:EXIT_SAFE"
        );

        return;
    }


    if (
        command ==
        "CMD:DEPLOY"
    )
    {
        setMissionState(
            MissionState::DEPLOYED
        );

        reply(
            "ACK:DEPLOY"
        );

        return;
    }


    if (
        command ==
        "CMD:NOMINAL"
    )
    {
        setMissionState(
            MissionState::NOMINAL
        );

        reply(
            "ACK:NOMINAL"
        );

        return;
    }


    // ====================================
    // Reset
    // ====================================

    if (
        command ==
        "CMD:RESET"
    )
    {
        setMissionState(
            MissionState::BOOT
        );

        reply(
            "ACK:RESET"
        );

        return;
    }


    // ====================================
    // Reboot
    // ====================================

    if (
        command ==
        "CMD:REBOOT"
    )
    {
        reply(
            "ACK:REBOOT"
        );

        delay(200);

        ESP.restart();

        return;
    }


    // ====================================
    // Thermal fault
    // ====================================

    if (
        command ==
        "CMD:FAULT:THERMAL"
    )
    {
        xSemaphoreTake(
            telemetryMutex,
            portMAX_DELAY
        );

        telemetry.temperature =
            90.0;

        xSemaphoreGive(
            telemetryMutex
        );

        reply(
            "ACK:FAULT:THERMAL"
        );

        return;
    }


    // ====================================
    // Radiation fault
    // ====================================

    if (
        command ==
        "CMD:FAULT:RADIATION"
    )
    {
        xSemaphoreTake(
            telemetryMutex,
            portMAX_DELAY
        );

        telemetry.radiation =
            1.0;

        xSemaphoreGive(
            telemetryMutex
        );

        reply(
            "ACK:FAULT:RADIATION"
        );

        return;
    }


    // ====================================
    // Battery fault
    // ====================================

    if (
        command ==
        "CMD:FAULT:BATTERY"
    )
    {
        xSemaphoreTake(
            telemetryMutex,
            portMAX_DELAY
        );

        telemetry.battery =
            5.0;

        xSemaphoreGive(
            telemetryMutex
        );

        reply(
            "ACK:FAULT:BATTERY"
        );

        return;
    }


    // ====================================
    // Clear faults
    // ====================================

    if (
        command ==
        "CMD:CLEAR_FAULTS"
    )
    {
        xSemaphoreTake(
            telemetryMutex,
            portMAX_DELAY
        );

        telemetry.faultFlags = 0;

        telemetry.temperature =
            25.0;

        telemetry.radiation =
            0.20;

        telemetry.battery =
            85.0;

        xSemaphoreGive(
            telemetryMutex
        );

        reply(
            "ACK:CLEAR_FAULTS"
        );

        return;
    }


    // ====================================
    // Unknown command
    // ====================================

    reply(
        "ERR:INVALID_COMMAND"
    );
}


void commandTask(
    void *parameter
)
{
    // Serial is ONLY a local
    // engineering/debug interface.

    while (true)
    {
        if (Serial.available())
        {
            String command =
                Serial.readStringUntil(
                    '\n'
                );

            processCommand(
                command
            );
        }

        vTaskDelay(
            pdMS_TO_TICKS(10)
        );
    }
}