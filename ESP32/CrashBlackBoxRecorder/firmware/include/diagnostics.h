#ifndef DIAGNOSTICS_H
#define DIAGNOSTICS_H

#include <Arduino.h>

struct DeviceStatus
{
    String firmwareVersion;
    String chipModel;
    String resetReason;

    uint32_t freeHeap;
    uint32_t uptime;
    int wifiRSSI;
    uint32_t cpuFreqMHz;
};

class Diagnostics
{
public:
    static void begin();
    static DeviceStatus getCurrentStatus();
    static String getResetReason();
};

#endif