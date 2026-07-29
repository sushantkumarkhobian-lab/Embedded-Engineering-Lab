#include "diagnostics.h"

#include <WiFi.h>
#include <esp_system.h>

void Diagnostics::begin()
{
    // Reserved for future initialization
}

String Diagnostics::getResetReason()
{
    esp_reset_reason_t reason = esp_reset_reason();

    switch (reason)
    {
        case ESP_RST_POWERON:
            return "Power On";

        case ESP_RST_EXT:
            return "External Reset";

        case ESP_RST_SW:
            return "Software Reset";

        case ESP_RST_PANIC:
            return "Panic";

        case ESP_RST_INT_WDT:
            return "Interrupt Watchdog";

        case ESP_RST_TASK_WDT:
            return "Task Watchdog";

        case ESP_RST_WDT:
            return "Watchdog";

        case ESP_RST_DEEPSLEEP:
            return "Deep Sleep Wake";

        case ESP_RST_BROWNOUT:
            return "Brownout";

        default:
            return "Unknown";
    }
}

DeviceStatus Diagnostics::getCurrentStatus()
{
    DeviceStatus status;

    status.firmwareVersion = "v1.0.0";

    status.chipModel = ESP.getChipModel();

    status.resetReason = getResetReason();

    status.freeHeap = ESP.getFreeHeap();

    status.uptime = millis() / 1000;

    status.cpuFreqMHz = ESP.getCpuFreqMHz();

    if (WiFi.status() == WL_CONNECTED)
        status.wifiRSSI = WiFi.RSSI();
    else
        status.wifiRSSI = 0;

    return status;
}