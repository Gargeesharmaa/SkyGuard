import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Activity, ShieldCheck } from "lucide-react";

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    // Establish WebSocket connection to FastAPI server
    const ws = new WebSocket("ws://localhost:8000/ws/alerts");

    ws.onopen = () => setConnectionStatus("Connected (Live)");
    ws.onclose = () => setConnectionStatus("Disconnected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAlerts((prev) => [data, ...prev.slice(0, 9)]); // Keep latest 10 alerts
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8" /> SkyGuard AI Monitoring Network
          </h1>
          <p className="text-gray-400 text-sm">Real-time AWS Anomaly & Sensor Health System</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${connectionStatus.includes("Live") ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
          {connectionStatus}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
          <h2 className="text-gray-400 text-xs font-semibold uppercase mb-2">Network Health</h2>
          <div className="text-4xl font-extrabold text-green-400">98.2%</div>
          <p className="text-gray-400 text-xs mt-2">Active AWS Nodes: 120 / 122</p>
        </div>

        {/* Live Metrics */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
          <h2 className="text-gray-400 text-xs font-semibold uppercase mb-2">Parameters Monitored</h2>
          <div className="flex justify-between text-sm mt-3">
            <span>Temperature (°C)</span> <span className="font-bold text-blue-400">32.4 °C</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Pressure (hPa)</span> <span className="font-bold text-blue-400">1002.1 hPa</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Humidity (%)</span> <span className="font-bold text-blue-400">65.3 %</span>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
          <h2 className="text-gray-400 text-xs font-semibold uppercase mb-2">Pending Maintenance</h2>
          <div className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
            <AlertTriangle /> 1 AWS Unit
          </div>
          <p className="text-gray-400 text-xs mt-2">AWS-104 requires calibration</p>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="text-blue-400" /> Live Real-Time Alert Log
        </h2>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-3">
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No active anomalies detected across station network.</p>
          ) : (
            alerts.map((alert, idx) => (
              <div key={idx} className="bg-gray-900 p-3 rounded-lg flex justify-between items-center border-l-4 border-red-500">
                <div>
                  <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded font-mono mr-2">{alert.station_id}</span>
                  <span className="font-semibold text-sm">{alert.fault_type}</span>
                  <p className="text-xs text-gray-400 mt-1">Rec: {alert.recommended_action}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                  <div className="text-xs text-red-400 font-bold mt-1">Health Score: {alert.health_score}/100</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}