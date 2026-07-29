import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  RotateCcw, 
  HardDrive, 
  Clock, 
  Wifi, 
  Download, 
  Tag, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { CrashData } from '../types';
import { formatUptime, analyzeResetReason, getRssiSignalLevel } from '../utils/formatters';

interface PreviousCrashCardProps {
  crash: CrashData | null;
}

export const PreviousCrashCard: React.FC<PreviousCrashCardProps> = ({ crash }) => {
  // If no crash report is received yet, show fallback from spec
  const crashData: CrashData = crash && Object.keys(crash).length > 0 ? crash : {
    firmware: 'v1.0.0',
    resetReason: 'Watchdog Reset',
    freeHeap: 325340,
    uptime: 947,
    wifiRSSI: -60,
    restartCount: 9
  };

  const resetInfo = analyzeResetReason(crashData.resetReason);
  const rssiInfo = getRssiSignalLevel(crashData.wifiRSSI ?? -60);

  const exportCrashReport = () => {
    const reportText = `================================================================================
                    ESP32 CRASH BLACK BOX RECORD REPORT
================================================================================
Generated At      : ${new Date().toISOString()}
Firmware Version  : ${crashData.firmware}
Reset Reason      : ${crashData.resetReason} (${resetInfo.badgeText})
Restart Count     : ${crashData.restartCount}
Free Heap         : ${crashData.freeHeap} Bytes (${(crashData.freeHeap / 1024).toFixed(2)} KB)
Uptime at Crash   : ${crashData.uptime} sec (${formatUptime(crashData.uptime)})
Wi-Fi RSSI        : ${crashData.wifiRSSI} dBm (${rssiInfo.label})
--------------------------------------------------------------------------------
Diagnostics Note  : ${resetInfo.description}
================================================================================
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `esp32_crash_report_boot_${crashData.restartCount}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section style={{ marginTop: '40px' }}>
      
      {/* Section Header */}
      <div className="section-title-box">
        <div className="section-heading">
          <ShieldAlert size={22} color={resetInfo.severity === 'danger' ? '#EF4444' : 'var(--color-brand-neon)'} />
          <span>Previous Crash Report</span>
        </div>
        <button 
          className="btn btn-outline" 
          onClick={exportCrashReport}
          title="Export telemetry crash dump as text file"
        >
          <Download size={15} />
          <span>Export Dump</span>
        </button>
      </div>

      {/* Main Black Box Crash Container */}
      <div className={`crash-card-container ${resetInfo.severity === 'success' ? 'normal-boot' : ''}`}>
        
        {/* Banner Alert Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {resetInfo.severity === 'danger' ? (
              <AlertTriangle size={20} color="#EF4444" />
            ) : (
              <CheckCircle2 size={20} color="var(--color-brand-neon)" />
            )}
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: resetInfo.severity === 'danger' ? '#FCA5A5' : 'var(--color-text-main)' }}>
              {resetInfo.severity === 'danger' ? 'CRITICAL SYSTEM REBOOT RECORDED' : 'SYSTEM STATUS NORMAL'}
            </span>
          </div>

          <span className={`badge badge-${resetInfo.severity}`}>
            {resetInfo.badgeText}
          </span>
        </div>

        {/* 2x3 Grid matching layout spec */}
        <div className="grid-3">
          
          {/* 1. Firmware */}
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="card-title">
              <span>Firmware</span>
              <Tag size={15} color="var(--color-brand-neon)" />
            </div>
            <div className="card-value font-mono">
              {crashData.firmware || 'v1.0.0'}
            </div>
          </div>

          {/* 2. Reset Reason */}
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="card-title">
              <span>Reset Reason</span>
              <ShieldAlert size={15} color={resetInfo.severity === 'danger' ? '#EF4444' : 'var(--color-brand-neon)'} />
            </div>
            <div className="card-value" style={{ 
              color: resetInfo.severity === 'danger' ? '#EF4444' : 'var(--color-brand-neon)' 
            }}>
              {crashData.resetReason || 'Watchdog Reset'}
            </div>
          </div>

          {/* 3. Restart Count */}
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="card-title">
              <span>Restart Count</span>
              <RotateCcw size={15} color="var(--color-brand-neon)" />
            </div>
            <div className="card-value font-mono">
              {crashData.restartCount ?? 9}
            </div>
          </div>

          {/* 4. Free Heap */}
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="card-title">
              <span>Free Heap</span>
              <HardDrive size={15} color="var(--color-brand-neon)" />
            </div>
            <div className="card-value font-mono">
              {(crashData.freeHeap ?? 325340).toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)' }}>Bytes</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {((crashData.freeHeap ?? 325340) / 1024).toFixed(1)} KB SRAM
            </div>
          </div>

          {/* 5. Uptime */}
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="card-title">
              <span>Uptime</span>
              <Clock size={15} color="var(--color-brand-neon)" />
            </div>
            <div className="card-value font-mono" style={{ color: 'var(--color-brand-neon)' }}>
              {crashData.uptime ?? 947} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)' }}>sec</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Formatted: {formatUptime(crashData.uptime ?? 947)}
            </div>
          </div>

          {/* 6. Wi-Fi RSSI */}
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="card-title">
              <span>Wi-Fi RSSI</span>
              <Wifi size={15} color={rssiInfo.color} />
            </div>
            <div className="card-value font-mono">
              {crashData.wifiRSSI ?? -60} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)' }}>dBm</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: rssiInfo.color, marginTop: '4px', fontWeight: 600 }}>
              {rssiInfo.label} Signal
            </div>
          </div>

        </div>

        {/* Diagnostics & Root Cause Analysis Note */}
        <div style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 'var(--radius-md)',
          borderLeft: `4px solid ${resetInfo.severity === 'danger' ? '#EF4444' : 'var(--color-brand-neon)'}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <FileText size={18} color={resetInfo.severity === 'danger' ? '#EF4444' : 'var(--color-brand-neon)'} style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-main)', marginBottom: '2px' }}>
              Black Box Analysis & Diagnostics
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-sub)', lineHeight: 1.4 }}>
              {resetInfo.description}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
