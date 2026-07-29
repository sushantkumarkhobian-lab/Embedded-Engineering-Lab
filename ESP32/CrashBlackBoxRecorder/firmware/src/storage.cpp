#include "storage.h"

#include <Preferences.h>

Preferences preferences;

void Storage::begin()
{
    preferences.begin("crashbox", false);
}

void Storage::saveCrashData(const CrashData &data)
{
    preferences.putString("fw", data.firmwareVersion);
    preferences.putString("reset", data.resetReason);

    preferences.putUInt("heap", data.freeHeap);
    preferences.putUInt("uptime", data.uptime);

    preferences.putInt("rssi", data.wifiRSSI);

    preferences.putUInt("restart", data.restartCount);
}

CrashData Storage::loadCrashData()
{
    CrashData data;

    data.firmwareVersion = preferences.getString("fw", "Unknown");
    data.resetReason = preferences.getString("reset", "Unknown");

    data.freeHeap = preferences.getUInt("heap", 0);
    data.uptime = preferences.getUInt("uptime", 0);

    data.wifiRSSI = preferences.getInt("rssi", 0);

    data.restartCount = preferences.getUInt("restart", 0);

    return data;
}

void Storage::clearCrashData()
{
    preferences.clear();
}

uint32_t Storage::incrementRestartCount()
{
    uint32_t count = preferences.getUInt("restart", 0);

    count++;

    preferences.putUInt("restart", count);

    return count;
}