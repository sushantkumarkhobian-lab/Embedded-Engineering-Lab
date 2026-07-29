#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>

namespace WifiManager
{
    void begin(const char *ssid, const char *password);

    void update();

    bool isConnected();

    String getIPAddress();

    int getRSSI();

    String getSSID();

    String getMACAddress();
}

#endif