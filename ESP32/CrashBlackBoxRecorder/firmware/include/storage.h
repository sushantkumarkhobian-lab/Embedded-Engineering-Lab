#ifndef STORAGE_H
#define STORAGE_H

#include <Arduino.h>

struct CrashData
{
    String firmwareVersion;
    String resetReason;

    uint32_t freeHeap;
    uint32_t uptime;

    int wifiRSSI;

    uint32_t restartCount;
};

class Storage
{
public:
    static void begin();

    static void saveCrashData(const CrashData &data);

    static CrashData loadCrashData();

    static void clearCrashData();

    static uint32_t incrementRestartCount();
};

#endif