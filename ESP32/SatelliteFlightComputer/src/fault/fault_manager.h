#ifndef FAULT_MANAGER_H
#define FAULT_MANAGER_H

#include <Arduino.h>

#define FAULT_THERMAL       0x01
#define FAULT_RADIATION     0x02
#define FAULT_LOW_BATTERY   0x04

void faultTask(
    void *parameter
);

#endif