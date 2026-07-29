import React, { useState } from 'react';
import { 
  Cpu, 
  Wifi, 
  HardDrive, 
  RotateCcw, 
  Globe, 
  Copy, 
  Check, 
  Clock,
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { DeviceStatus } from '../types';
import { formatUptime, getRssiSignalLevel, analyzeResetReason } from '../utils/formatters';

interface StatusGridProps {
  status: DeviceStatus;
}

export const StatusGrid: React.FC<StatusGridProps> = ({ status }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const rssiInfo = getRssiSignalLevel(status.wifiRSSI ?? -61);
  const resetInfo = analyzeResetReason(status.resetReason ?? 'Power On');

  // ESP32 internal SRAM is total ~520 KB
  const totalHeapBytes = 520 * 1024;
  const freeHeap = status.freeHeap ?? 237448;
  const freeHeapPercent = Math.min(100, Math.max(0, (freeHeap / totalHeapBytes) * 100));

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section>
      {/* 3x3 Grid Layout matching spec */}
      <div className="grid-3">

        {/* 1. Firmware */}
        <div className="card">
          <div className="card-title">
            <span>Firmware</span>
            <Tag size={16} color="var(--color-brand-neon)" />
          </div>
          <div className="card-value card-highlight">
            {status.firmware || 'v1.0.0'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Production Build
          </div>
        </div>

        {/* 2. Reset Reason */}
        <div className="card">
          <div className="card-title">
            <span>Reset Reason</span>
            <ShieldCheck size={16} color={resetInfo.severity === 'danger' ? '#EF4444' : 'var(--color-brand-neon)'} />
          </div>
          <div className="card-value" style={{ 
            color: resetInfo.severity === 'danger' ? '#EF4444' : 'var(--color-text-main)' 
          }}>
            {status.resetReason || 'Power On'}
          </div>
          <div style={{ marginTop: '6px' }}>
            <span className={`badge badge-${resetInfo.severity}`}>
              {resetInfo.badgeText}
            </span>
          </div>
        </div>

        {/* 3. Restart Count */}
        <div className="card">
          <div className="card-title">
            <span>Restart Count</span>
            <RotateCcw size={16} color="var(--color-brand-neon)" />
          </div>
          <div className="card-value card-highlight">
            {status.restartCount ?? 10}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Total reboots since flash
          </div>
        </div>

        {/* 4. Free Heap */}
        <div className="card">
          <div className="card-title">
            <span>Free Heap</span>
            <HardDrive size={16} color="var(--color-brand-neon)" />
          </div>
          <div className="card-value">
            {freeHeap.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)' }}>Bytes</span>
          </div>
          
          {/* Heap Progress Bar */}
          <div className="heap-progress-bg" title={`${freeHeapPercent.toFixed(1)}% Free Heap`}>
            <div className="heap-progress-fill" style={{ width: `${freeHeapPercent}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            <span>{(freeHeap / 1024).toFixed(1)} KB Available</span>
            <span>{freeHeapPercent.toFixed(0)}%</span>
          </div>
        </div>

        {/* 5. CPU Frequency */}
        <div className="card">
          <div className="card-title">
            <span>CPU Frequency</span>
            <Cpu size={16} color="var(--color-brand-neon)" />
          </div>
          <div className="card-value card-highlight">
            {status.cpuFreqMHz ?? 240} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)' }}>MHz</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} color="var(--color-brand-neon)" /> Dual-Core Xtensa LX6
          </div>
        </div>

        {/* 6. Uptime */}
        <div className="card">
          <div className="card-title">
            <span>Uptime</span>
            <Clock size={16} color="var(--color-brand-neon)" />
          </div>
          <div className="card-value card-highlight font-mono">
            {formatUptime(status.uptime ?? 342)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {status.uptime ?? 342} total seconds elapsed
          </div>
        </div>

        {/* 7. Wi-Fi RSSI */}
        <div className="card">
          <div className="card-title">
            <span>Wi-Fi RSSI</span>
            <Wifi size={16} color={rssiInfo.color} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-value font-mono">
              {status.wifiRSSI ?? -61} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)' }}>dBm</span>
            </div>
            
            {/* Visual Signal Gauge Bars */}
            <div className="rssi-bars" title={`Signal: ${rssiInfo.label}`}>
              {[1, 2, 3, 4].map((bar) => (
                <div 
                  key={bar} 
                  className={`rssi-bar ${bar <= rssiInfo.bars ? 'active' : ''}`} 
                  style={{ height: `${bar * 4}px` }} 
                />
              ))}
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: rssiInfo.color, marginTop: '4px', fontWeight: 600 }}>
            Signal: {rssiInfo.label}
          </div>
        </div>

        {/* 8. SSID */}
        <div className="card">
          <div className="card-title">
            <span>SSID</span>
            <Globe size={16} color="var(--color-brand-neon)" />
          </div>
          <div className="card-value font-mono" style={{ fontSize: '1.2rem' }}>
            {status.ssid || 'vivoV27'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Connected Access Point
          </div>
        </div>

        {/* 9. IP Address */}
        <div className="card">
          <div className="card-title">
            <span>IP Address</span>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--color-text-sub)', cursor: 'pointer' }}
              onClick={() => copyToClipboard(status.ipAddress || '10.85.102.24', 'ip')}
              title="Copy IP Address"
            >
              {copiedField === 'ip' ? <Check size={14} color="var(--color-brand-neon)" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="card-value font-mono" style={{ fontSize: '1.15rem' }}>
            {status.ipAddress || '10.85.102.24'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Station Local IPv4
          </div>
        </div>

      </div>

      {/* 10. MAC Address (Full Width Box) */}
      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title">
          <span>MAC Address</span>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--color-text-sub)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
            onClick={() => copyToClipboard(status.macAddress || '5C:01:3B:4D:2B:08', 'mac')}
            title="Copy MAC Address"
          >
            {copiedField === 'mac' ? (
              <>
                <Check size={14} color="var(--color-brand-neon)" />
                <span style={{ color: 'var(--color-brand-neon)' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy MAC</span>
              </>
            )}
          </button>
        </div>
        <div className="card-value font-mono card-highlight" style={{ fontSize: '1.4rem', letterSpacing: '0.08em' }}>
          {status.macAddress || '5C:01:3B:4D:2B:08'}
        </div>
      </div>
    </section>
  );
};
