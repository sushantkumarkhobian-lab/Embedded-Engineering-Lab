#include "api_client.h"

#include <HTTPClient.h>
#include <WiFi.h>

namespace
{
    String baseURL;
}

namespace ApiClient
{

void begin(const String &serverURL)
{
    baseURL = serverURL;
}

bool isServerReachable()
{
    if (WiFi.status() != WL_CONNECTED)
        return false;

    HTTPClient http;

    http.begin(baseURL + "/health");

    int code = http.GET();

    http.end();

    return (code == HTTP_CODE_OK);
}

bool sendCurrentStatus(const DeviceStatus &status,
                       uint32_t restartCount,
                       int wifiRSSI,
                       const String &ssid,
                       const String &ipAddress,
                       const String &macAddress)
{
    if (WiFi.status() != WL_CONNECTED)
        return false;

    HTTPClient http;

    http.begin(baseURL + "/api/device/status");

    http.addHeader("Content-Type", "application/json");

    String json = "{";

    json += "\"firmware\":\"" + String(status.firmwareVersion) + "\",";
    json += "\"chip\":\"" + String(status.chipModel) + "\",";
    json += "\"resetReason\":\"" + String(status.resetReason) + "\",";
    json += "\"freeHeap\":" + String(status.freeHeap) + ",";
    json += "\"uptime\":" + String(status.uptime) + ",";
    json += "\"cpuFreqMHz\":" + String(status.cpuFreqMHz) + ",";
    json += "\"wifiRSSI\":" + String(wifiRSSI) + ",";
    json += "\"restartCount\":" + String(restartCount) + ",";
    json += "\"ssid\":\"" + ssid + "\",";
    json += "\"ipAddress\":\"" + ipAddress + "\",";
    json += "\"macAddress\":\"" + macAddress + "\"";

    json += "}";

    int code = http.POST(json);

    http.end();

    return (code == HTTP_CODE_OK || code == HTTP_CODE_CREATED);
}

bool sendPreviousCrash(const CrashData &crash)
{
    if (WiFi.status() != WL_CONNECTED)
        return false;

    HTTPClient http;

    http.begin(baseURL + "/api/device/previous-crash");

    http.addHeader("Content-Type", "application/json");

    String json = "{";

    json += "\"firmware\":\"" + String(crash.firmwareVersion) + "\",";
    json += "\"resetReason\":\"" + String(crash.resetReason) + "\",";
    json += "\"freeHeap\":" + String(crash.freeHeap) + ",";
    json += "\"uptime\":" + String(crash.uptime) + ",";
    json += "\"wifiRSSI\":" + String(crash.wifiRSSI) + ",";
    json += "\"restartCount\":" + String(crash.restartCount);

    json += "}";

    int code = http.POST(json);

    http.end();

    return (code == HTTP_CODE_OK || code == HTTP_CODE_CREATED);
}

}