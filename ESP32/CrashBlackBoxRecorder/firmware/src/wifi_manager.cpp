#include "wifi_manager.h"

#include <WiFi.h>

namespace
{
    const char *wifiSSID = nullptr;
    const char *wifiPassword = nullptr;
}

namespace WifiManager
{

void begin(const char *ssid, const char *password)
{
    wifiSSID = ssid;
    wifiPassword = password;

    Serial.println();
    Serial.println("Connecting to Wi-Fi...");

    WiFi.mode(WIFI_STA);
    WiFi.begin(wifiSSID, wifiPassword);

    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(500);
    }

    Serial.println();
    Serial.println("Wi-Fi Connected");
    Serial.print("SSID : ");
    Serial.println(WiFi.SSID());

    Serial.print("IP Address : ");
    Serial.println(WiFi.localIP());

    Serial.print("MAC Address : ");
    Serial.println(WiFi.macAddress());

    Serial.print("RSSI : ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
}

void update()
{
    if (WiFi.status() == WL_CONNECTED)
        return;

    Serial.println();
    Serial.println("Wi-Fi disconnected.");
    Serial.println("Reconnecting...");

    WiFi.disconnect();
    WiFi.begin(wifiSSID, wifiPassword);

    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(500);
    }

    Serial.println();
    Serial.println("Wi-Fi Reconnected");
}

bool isConnected()
{
    return WiFi.status() == WL_CONNECTED;
}

String getIPAddress()
{
    return WiFi.localIP().toString();
}

int getRSSI()
{
    return WiFi.RSSI();
}

String getSSID()
{
    return WiFi.SSID();
}

String getMACAddress()
{
    return WiFi.macAddress();
}

}