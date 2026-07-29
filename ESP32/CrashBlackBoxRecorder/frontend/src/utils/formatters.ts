/**
 * Utility functions for formatting hardware telemetry metrics
 */

export function formatUptime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export function formatBytes(bytes: number): string {
  if (isNaN(bytes) || bytes <= 0) return '0 Bytes';
  if (bytes < 1024) return `${bytes} Bytes`;
  const kb = (bytes / 1024).toFixed(2);
  return `${bytes.toLocaleString()} Bytes (${kb} KB)`;
}

export function getRssiSignalLevel(rssi: number): {
  label: string;
  bars: number;
  color: string;
} {
  if (rssi >= -60) return { label: 'Excellent', bars: 4, color: '#00FF88' };
  if (rssi >= -70) return { label: 'Good', bars: 3, color: '#34D399' };
  if (rssi >= -80) return { label: 'Fair', bars: 2, color: '#F59E0B' };
  return { label: 'Weak', bars: 1, color: '#EF4444' };
}

export interface ResetReasonInfo {
  severity: 'success' | 'warning' | 'danger';
  description: string;
  badgeText: string;
}

export function analyzeResetReason(reason: string): ResetReasonInfo {
  const normalized = (reason || '').toLowerCase();
  
  if (normalized.includes('power') || normalized.includes('default') || normalized.includes('normal')) {
    return {
      severity: 'success',
      badgeText: 'NORMAL BOOT',
      description: 'Normal power cycle or startup initialization.'
    };
  }
  
  if (normalized.includes('watchdog') || normalized.includes('wdt')) {
    return {
      severity: 'danger',
      badgeText: 'CRITICAL WDT CRASH',
      description: 'Task Watchdog Timer expired. CPU stuck in loop or task blocked.'
    };
  }

  if (normalized.includes('panic') || normalized.includes('exception') || normalized.includes('abort')) {
    return {
      severity: 'danger',
      badgeText: 'PANIC EXCEPTION',
      description: 'Hardware/Software Panic Exception triggered. Illegal instruction or memory fault.'
    };
  }

  if (normalized.includes('brownout') || normalized.includes('voltage')) {
    return {
      severity: 'warning',
      badgeText: 'BROWNOUT DETECTED',
      description: 'Supply voltage dropped below operating threshold.'
    };
  }

  if (normalized.includes('software') || normalized.includes('sw reset') || normalized.includes('restart')) {
    return {
      severity: 'warning',
      badgeText: 'SOFTWARE RESET',
      description: 'Restart requested via esp_restart() or firmware update.'
    };
  }

  return {
    severity: 'warning',
    badgeText: 'UNEXPECTED RESET',
    description: `System rebooted with reason: ${reason}`
  };
}

// Fallback initial/demo data matching prompt specification
export const DEFAULT_STATUS = {
  firmware: 'v1.0.0',
  chip: 'ESP32-D0WD-V3',
  resetReason: 'Power On',
  freeHeap: 237448,
  uptime: 342,
  cpuFreqMHz: 240,
  wifiRSSI: -61,
  restartCount: 10,
  ssid: 'vivoV27',
  ipAddress: '10.85.102.24',
  macAddress: '5C:01:3B:4D:2B:08'
};

export const DEFAULT_PREVIOUS_CRASH = {
  firmware: 'v1.0.0',
  resetReason: 'Watchdog Reset',
  freeHeap: 325340,
  uptime: 947,
  wifiRSSI: -60,
  restartCount: 9
};
