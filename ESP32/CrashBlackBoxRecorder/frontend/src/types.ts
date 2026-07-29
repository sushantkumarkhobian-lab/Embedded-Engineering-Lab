export interface DeviceStatus {
  firmware: string;
  chip: string;
  resetReason: string;
  freeHeap: number;
  uptime: number;
  cpuFreqMHz: number;
  wifiRSSI: number;
  restartCount: number;
  ssid: string;
  ipAddress: string;
  macAddress: string;
}

export interface CrashData {
  firmware: string;
  resetReason: string;
  freeHeap: number;
  uptime: number;
  wifiRSSI: number;
  restartCount: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}
