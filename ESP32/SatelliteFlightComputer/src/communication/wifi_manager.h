#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>

extern WiFiServer tcpServer;

extern WiFiClient activeClient;

void initWiFi();

void wifiTask(void *parameter);

void sendToGround(
    const String& message
);

#endif