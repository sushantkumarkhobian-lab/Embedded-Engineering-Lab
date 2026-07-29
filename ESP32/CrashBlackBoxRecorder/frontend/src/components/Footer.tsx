import React from 'react';
import { Clock, Activity, Cpu } from 'lucide-react';

interface FooterProps {
  lastUpdated: string | null;
  syncCount: number;
}

export const Footer: React.FC<FooterProps> = ({ lastUpdated, syncCount }) => {
  return (
    <footer className="footer-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={15} color="var(--color-brand-neon)" />
        <span style={{ fontWeight: 600 }}>Last Updated :</span>
        <span className="font-mono" style={{ color: 'var(--color-brand-neon)', fontWeight: 700 }}>
          {lastUpdated || '14:25:17'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="var(--color-brand-neon)" />
          <span>Syncs: <strong className="font-mono">{syncCount}</strong></span>
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={14} color="var(--color-text-sub)" />
          <span>ESP32 Black Box Core</span>
        </span>
      </div>
    </footer>
  );
};
