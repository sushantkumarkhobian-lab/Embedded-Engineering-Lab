import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StatusGrid } from './components/StatusGrid';
import { PreviousCrashCard } from './components/PreviousCrashCard';
import { SimulateModal } from './components/SimulateModal';
import { Footer } from './components/Footer';
import { DeviceStatus, CrashData } from './types';
import { DEFAULT_STATUS, DEFAULT_PREVIOUS_CRASH } from './utils/formatters';

export const App: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState<string>('http://localhost:3000');
  const [pollInterval, setPollInterval] = useState<number>(2000); // 2 seconds auto-poll
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>('14:25:17');
  const [syncCount, setSyncCount] = useState<number>(0);
  const [isSimModalOpen, setIsSimModalOpen] = useState<boolean>(false);

  const [status, setStatus] = useState<DeviceStatus>(DEFAULT_STATUS);
  const [previousCrash, setPreviousCrash] = useState<CrashData>(DEFAULT_PREVIOUS_CRASH);

  const fetchTelemetryData = useCallback(async () => {
    setIsPolling(true);
    let connected = false;

    try {
      // 1. Fetch current status
      const statusRes = await fetch(`${backendUrl}/api/device/status`);
      if (statusRes.ok) {
        const data = await statusRes.json();
        if (data && Object.keys(data).length > 0) {
          setStatus(data);
          connected = true;
        }
      }

      // 2. Fetch previous crash report
      const crashRes = await fetch(`${backendUrl}/api/device/previous-crash`);
      if (crashRes.ok) {
        const crashData = await crashRes.json();
        if (crashData && Object.keys(crashData).length > 0) {
          setPreviousCrash(crashData);
          connected = true;
        }
      }

      // 3. Health check fallback if both endpoints returned empty
      if (!connected) {
        const healthRes = await fetch(`${backendUrl}/health`);
        if (healthRes.ok) {
          connected = true;
        }
      }

      setIsConnected(connected);
      
      // Update last timestamp formatted as HH:MM:SS (e.g., 14:25:17)
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setLastUpdated(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      setSyncCount((prev) => prev + 1);

    } catch (error) {
      console.warn('Telemetry fetch error (Backend offline or unreachable):', error);
      setIsConnected(false);
    } finally {
      setIsPolling(false);
    }
  }, [backendUrl]);

  // Polling Effect
  useEffect(() => {
    fetchTelemetryData();

    if (pollInterval <= 0) return;

    const timer = setInterval(() => {
      fetchTelemetryData();
    }, pollInterval);

    return () => clearInterval(timer);
  }, [fetchTelemetryData, pollInterval]);

  return (
    <div className="dashboard-container">
      {/* Header with Title & Device Bar */}
      <Header
        chipModel={status.chip || 'ESP32-D0WD-V3'}
        isConnected={isConnected}
        isPolling={isPolling}
        pollInterval={pollInterval}
        setPollInterval={setPollInterval}
        onRefresh={fetchTelemetryData}
        onOpenSimModal={() => setIsSimModalOpen(true)}
        backendUrl={backendUrl}
        setBackendUrl={setBackendUrl}
      />

      {/* Main Real-time Status Grid */}
      <main>
        <StatusGrid status={status} />

        {/* Previous Crash Report Section */}
        <PreviousCrashCard crash={previousCrash} />
      </main>

      {/* Footer with Timestamp */}
      <Footer lastUpdated={lastUpdated} syncCount={syncCount} />

      {/* Developer Payload Simulator Modal */}
      <SimulateModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        backendUrl={backendUrl}
        onSuccess={() => {
          setIsSimModalOpen(false);
          fetchTelemetryData();
        }}
      />
    </div>
  );
};

export default App;
