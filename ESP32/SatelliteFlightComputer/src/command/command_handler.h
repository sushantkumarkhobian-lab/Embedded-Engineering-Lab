#ifndef COMMAND_HANDLER_H
#define COMMAND_HANDLER_H

#include <Arduino.h>

void processCommand(
    String command
);

void commandTask(
    void *parameter
);

#endif