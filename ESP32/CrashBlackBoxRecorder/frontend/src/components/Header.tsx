import React, { useState } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Terminal, 
  Sliders
} from 'lucide-react';

interface HeaderProps {
  chipModel: string;
  isConnected: boolean;
  isPolling: boolean;
  pollInterval: number;
  setPollInterval: (interval: number) => void;
  onRefresh: () => void;
  onOpenSimModal: () => void;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  chipModel,
  isConnected,
  isPolling,
  pollInterval,
  setPollInterval,
  onRefresh,
  onOpenSimModal,
  backendUrl,
  setBackendUrl
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="header-card">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        
        {/* Title & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0, 255, 136, 0.1))',
            border: '1px solid var(--border-active)',
            padding: '12px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <Radio size={28} color="var(--color-brand-neon)" style={{ animation: 'spin 12s linear infinite' }} />
          </div>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Crash Black Box Recorder Dashboard
            </h1>
            <p style={{ color: 'var(--color-text-sub)', fontSize: '0.85rem', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Real-time ESP32 Diagnostic Telemetry</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span className="font-mono" style={{ color: 'var(--color-brand-neon)' }}>v1.0.0</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Device Banner */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Quick Simulate Button */}
          <button 
            className="btn btn-outline" 
            onClick={onOpenSimModal}
            title="Simulate ESP32 status / crash report payloads"
          >
            <Terminal size={16} />
            <span>Simulate ESP32</span>
          </button>

          {/* Refresh Button */}
          <button 
            className="btn btn-ghost" 
            onClick={onRefresh}
            title="Force refresh status"
          >
            <RefreshCw size={16} className={isPolling ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>

          {/* Settings Toggle */}
          <button 
            className={`btn ${showSettings ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Server & Polling Configuration"
          >
            <Sliders size={16} />
            <span>Config</span>
          </button>

        </div>
      </div>

      {/* Device Info & Status Bar */}
      <div style={{ 
        marginTop: '20px', 
        paddingTop: '16px', 
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        
        {/* Device Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem', fontWeight: 600 }}>Device :</span>
          <span className="font-mono" style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            color: 'var(--color-text-main)',
            background: 'rgba(255,255,255,0.06)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {chipModel || 'ESP32-D0WD-V3'}
          </span>
        </div>

        {/* Live Connected Indicator */}
        <div className={`pulse-indicator ${isConnected ? 'pulse-connected' : 'pulse-disconnected'}`}>
          <span className={`dot-beacon ${isConnected ? 'active' : 'inactive'}`} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>

      </div>

      {/* Expandable Configuration Drawer */}
      {showSettings && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div>
            <label style={{ display: 'block', color: 'var(--color-text-sub)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 600 }}>
              BACKEND SERVER URL
            </label>
            <input 
              type="text" 
              className="input-field" 
              style={{ width: '100%' }}
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="http://localhost:3000"
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--color-text-sub)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 600 }}>
              AUTO-POLL INTERVAL
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1000, 2000, 5000, 0].map((interval) => (
                <button
                  key={interval}
                  className={`btn ${pollInterval === interval ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => setPollInterval(interval)}
                >
                  {interval === 0 ? 'Paused' : `${interval / 1000}s`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
