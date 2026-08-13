#include "wifi_manager.h"

#include "../../include/config.h"

WiFiServer tcpServer(
    TCP_PORT
);

WiFiClient activeClient;


void initWiFi()
{
    Serial.println();
    Serial.println(
        "[WIFI] Connecting..."
    );

    WiFi.mode(
        WIFI_STA
    );

    WiFi.begin(
        WIFI_SSID,
        WIFI_PASSWORD
    );

    int attempts = 0;

    while (
        WiFi.status() != WL_CONNECTED &&
        attempts < 30
    )
    {
        delay(500);

        Serial.print(".");

        attempts++;
    }

    Serial.println();

    if (
        WiFi.status() ==
        WL_CONNECTED
    )
    {
        Serial.println(
            "[WIFI] Connected"
        );

        Serial.print(
            "[WIFI] IP: "
        );

        Serial.println(
            WiFi.localIP()
        );

        Serial.print(
            "[WIFI] TCP port: "
        );

        Serial.println(
            TCP_PORT
        );

        tcpServer.begin();

        Serial.println(
            "[WIFI] TCP server started"
        );
    }
    else
    {
        Serial.println(
            "[WIFI] Connection FAILED"
        );
    }
}


void sendToGround(
    const String& message
)
{
    if (
        activeClient &&
        activeClient.connected()
    )
    {
        activeClient.println(
            message
        );
    }
}


void wifiTask(void *parameter)
{
    while (true)
    {
        // Check for new client

        if (
            !activeClient ||
            !activeClient.connected()
        )
        {
            WiFiClient newClient =
                tcpServer.available();

            if (newClient)
            {
                activeClient =
                    newClient;

                Serial.println(
                    "[WIFI] Ground station connected"
                );

                activeClient.println(
                    "SATELLITE:CONNECTED"
                );
            }
        }


        // Process incoming data

        if (
            activeClient &&
            activeClient.connected() &&
            activeClient.available()
        )
        {
            String command =
                activeClient.readStringUntil(
                    '\n'
                );

            command.trim();

            if (command.length() > 0)
            {
                Serial.print(
                    "[TCP RX] "
                );

                Serial.println(
                    command
                );

                // Command handler is implemented
                // in command_handler.cpp

                extern void processCommand(
                    String command
                );

                processCommand(
                    command
                );
            }
        }


        vTaskDelay(
            pdMS_TO_TICKS(10)
        );
    }
}