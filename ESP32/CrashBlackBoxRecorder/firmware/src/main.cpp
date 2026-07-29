#include "diagnostics.h"
#include "storage.h"
#include "wifi_manager.h"
#include "api_client.h"

uint32_t restartCount = 0;

// Wi-Fi Credentials
const char *WIFI_SSID = "YOUR_SSID_WIFI";
const char *WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend Server
const String SERVER_URL = "http://YOUR_LAPTOP_IP:3000";

void setup()
{
    Serial.begin(115200);
    delay(4000);

    Diagnostics::begin();
    Storage::begin();

    CrashData previous = Storage::loadCrashData();

    restartCount = Storage::incrementRestartCount();

    // Initialize Wi-Fi
    WifiManager::begin(WIFI_SSID, WIFI_PASSWORD);

    // Initialize API Client
    ApiClient::begin(SERVER_URL);

    // Send the previous crash report once
    ApiClient::sendPreviousCrash(previous);
}

void loop()
{
    // Keep Wi-Fi connected
    WifiManager::update();

    DeviceStatus status = Diagnostics::getCurrentStatus();

    CrashData data;

    data.firmwareVersion = status.firmwareVersion;
    data.resetReason = status.resetReason;
    data.freeHeap = status.freeHeap;
    data.uptime = status.uptime;
    data.wifiRSSI = WifiManager::getRSSI();
    data.restartCount = restartCount;

    // Save latest status locally
    Storage::saveCrashData(data);

    // Send live telemetry
    ApiClient::sendCurrentStatus(
        status,
        restartCount,
        WifiManager::getRSSI(),
        WifiManager::getSSID(),
        WifiManager::getIPAddress(),
        WifiManager::getMACAddress());

    delay(5000);
}