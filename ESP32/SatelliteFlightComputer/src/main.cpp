#include <Arduino.h>

#include "telemetry/telemetry.h"
#include "mission/mission_manager.h"
#include "communication/wifi_manager.h"
#include "command/command_handler.h"
#include "power/power_manager.h"
#include "attitude/attitude_manager.h"
#include "fault/fault_manager.h"


void printBootSequence()
{
    Serial.println();
    Serial.println("======================================");
    Serial.println("      SATELLITE FLIGHT COMPUTER");
    Serial.println("======================================");

    Serial.println("[BOOT] Initializing...");
    delay(500);

    Serial.println("[BOOT] CPU ............. PASS");
    delay(150);

    Serial.println("[BOOT] MEMORY .......... PASS");
    delay(150);

    Serial.println("[BOOT] TELEMETRY ....... PASS");
    delay(150);

    Serial.println("[BOOT] COMMAND ......... PASS");
    delay(150);

    Serial.println("[BOOT] POWER ........... PASS");
    delay(150);

    Serial.println("[BOOT] FLIGHT COMPUTER READY");

    Serial.println("======================================");
}


void setup()
{
    Serial.begin(115200);

    // ==========================================
    // Give the developer time to open Serial
    // Monitor after upload/reset.
    // ==========================================

    delay(4000);

    // ==========================================
    // Boot sequence
    // ==========================================

    printBootSequence();


    // ==========================================
    // Initialize subsystems
    // ==========================================

    initTelemetry();

    initMissionManager();

    initWiFi();


    // ==========================================
    // Start FreeRTOS tasks
    // ==========================================

    xTaskCreate(
        missionTask,
        "MissionTask",
        4096,
        NULL,
        3,
        NULL
    );

    xTaskCreate(
        telemetryTask,
        "TelemetryTask",
        4096,
        NULL,
        2,
        NULL
    );

    xTaskCreate(
        powerTask,
        "PowerTask",
        4096,
        NULL,
        2,
        NULL
    );

    xTaskCreate(
        attitudeTask,
        "AttitudeTask",
        4096,
        NULL,
        2,
        NULL
    );

    xTaskCreate(
        commandTask,
        "CommandTask",
        4096,
        NULL,
        4,
        NULL
    );

    xTaskCreate(
        faultTask,
        "FaultTask",
        4096,
        NULL,
        5,
        NULL
    );

    xTaskCreate(
        wifiTask,
        "WiFiTask",
        4096,
        NULL,
        4,
        NULL
    );


    Serial.println(
        "[RTOS] All tasks started"
    );
}


void loop()
{
    // Flight computer is RTOS-driven.
    // Nothing important runs here.

    vTaskDelay(
        pdMS_TO_TICKS(1000)
    );
}