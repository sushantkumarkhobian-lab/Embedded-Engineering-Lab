import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { DEFAULT_STATUS, DEFAULT_PREVIOUS_CRASH } from '../utils/formatters';

interface SimulateModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendUrl: string;
  onSuccess: () => void;
}

export const SimulateModal: React.FC<SimulateModalProps> = ({
  isOpen,
  onClose,
  backendUrl,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'status' | 'crash'>('status');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [statusForm, setStatusForm] = useState(DEFAULT_STATUS);
  const [crashForm, setCrashForm] = useState(DEFAULT_PREVIOUS_CRASH);

  const handleSendStatus = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${backendUrl}/api/device/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusForm)
      });
      if (res.ok) {
        setMessage({ text: 'Current Status payload posted successfully!', type: 'success' });
        onSuccess();
      } else {
        setMessage({ text: `Failed with status ${res.status}`, type: 'error' });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setMessage({ text: `Connection error: ${errorMessage}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCrash = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${backendUrl}/api/device/previous-crash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crashForm)
      });
      if (res.ok) {
        setMessage({ text: 'Crash Report payload posted successfully!', type: 'success' });
        onSuccess();
      } else {
        setMessage({ text: `Failed with status ${res.status}`, type: 'error' });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setMessage({ text: `Connection error: ${errorMessage}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: '#0D1B14',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '560px',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-brand-neon)' }}>
            ESP32 Payload Simulator
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-sub)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'status' ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
              color: activeTab === 'status' ? 'var(--color-brand-neon)' : 'var(--color-text-sub)',
              border: 'none',
              borderBottom: activeTab === 'status' ? '2px solid var(--color-brand-neon)' : 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('status')}
          >
            POST Current Status
          </button>
          <button
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'crash' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              color: activeTab === 'crash' ? '#EF4444' : 'var(--color-text-sub)',
              border: 'none',
              borderBottom: activeTab === 'crash' ? '2px solid #EF4444' : 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('crash')}
          >
            POST Crash Report
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          
          {message && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: message.type === 'success' ? 'var(--color-brand-neon)' : '#FCA5A5',
              border: `1px solid ${message.type === 'success' ? 'var(--color-brand-neon)' : '#EF4444'}`
            }}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          {activeTab === 'status' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Reset Reason</label>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={statusForm.resetReason}
                  onChange={(e) => setStatusForm({ ...statusForm, resetReason: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Restart Count</label>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={statusForm.restartCount}
                  onChange={(e) => setStatusForm({ ...statusForm, restartCount: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Free Heap (Bytes)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={statusForm.freeHeap}
                  onChange={(e) => setStatusForm({ ...statusForm, freeHeap: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Uptime (Sec)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={statusForm.uptime}
                  onChange={(e) => setStatusForm({ ...statusForm, uptime: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Wi-Fi RSSI (dBm)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={statusForm.wifiRSSI}
                  onChange={(e) => setStatusForm({ ...statusForm, wifiRSSI: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>SSID</label>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={statusForm.ssid}
                  onChange={(e) => setStatusForm({ ...statusForm, ssid: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Reset Reason</label>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={crashForm.resetReason}
                  onChange={(e) => setCrashForm({ ...crashForm, resetReason: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Restart Count</label>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={crashForm.restartCount}
                  onChange={(e) => setCrashForm({ ...crashForm, restartCount: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Free Heap (Bytes)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={crashForm.freeHeap}
                  onChange={(e) => setCrashForm({ ...crashForm, freeHeap: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Uptime at Crash (Sec)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '100%', marginTop: '4px' }}
                  value={crashForm.uptime}
                  onChange={(e) => setCrashForm({ ...crashForm, uptime: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(0,0,0,0.3)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          
          <button 
            className="btn btn-primary"
            disabled={loading}
            onClick={activeTab === 'status' ? handleSendStatus : handleSendCrash}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
            <span>Transmit Payload</span>
          </button>
        </div>

      </div>
    </div>
  );
};
