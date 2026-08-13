#ifndef MISSION_MANAGER_H
#define MISSION_MANAGER_H

#include <Arduino.h>

enum class MissionState
{
    BOOT,
    DEPLOYED,
    NOMINAL,
    LOW_POWER,
    SAFE_MODE,
    EMERGENCY
};

extern MissionState missionState;

void initMissionManager();

void missionTask(void *parameter);

void evaluateMissionState();

void setMissionState(
    MissionState newState
);

const char* missionStateToString();

#endif