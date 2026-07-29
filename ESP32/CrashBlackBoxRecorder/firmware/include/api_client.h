#ifndef API_CLIENT_H
#define API_CLIENT_H

#include <Arduino.h>

#include "diagnostics.h"
#include "storage.h"

namespace ApiClient
{
    void begin(const String &serverURL);

    bool sendCurrentStatus(const DeviceStatus &status,
                           uint32_t restartCount,
                           int wifiRSSI,
                           const String &ssid,
                           const String &ipAddress,
                           const String &macAddress);

    bool sendPreviousCrash(const CrashData &crash);

    bool isServerReachable();
}

#endif