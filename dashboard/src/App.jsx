import React, { useState, useEffect } from "react";
import { AlertTriangle, Activity, ShieldCheck, RefreshCw, Radio } from "lucide-react";

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [currentReadings, setCurrentReadings] = useState({
    temperature: 32.4,
    pressure: 1002.1,
    humidity: 65.3,
  });

  useEffect(() => {
    // Attempt WebSocket connection to FastAPI
    const ws = new WebSocket("ws://localhost:8000/ws/alerts");

    ws.onopen = () => setConnectionStatus("Connected (Live)");
    ws.onerror = () => setConnectionStatus("Disconnected (Demo Mode)");
    ws.onclose = () => setConnectionStatus("Disconnected (Demo Mode)");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.metrics) {
        setCurrentReadings(data.metrics);
      }
      if (data.anomaly_detected) {
        setAlerts((prev) => [data, ...prev.slice(0, 9)]);
      }
    };

    return () => ws.close();
  }, []);

  // Simulation Trigger for Demonstrations / Presentations
 // Dynamic Simulation Generator for Testing Various Fault Types
const triggerSimulatedAnomaly = () => {
  // Preset fault scenarios for realistic presentation testing
  const faultScenarios = [
    {
      station_id: "AWS-104",
      fault_type: "Temperature Spike & Sensor Drift",
      metrics: { temperature: 55.2, pressure: 980.5, humidity: 98.0 },
      health_score: 38,
      recommended_action: "Inspect / Calibrate Temperature Sensor",
    },
    {
      station_id: "AWS-108",
      fault_type: "Frozen Sensor Value (Zero Variance)",
      metrics: { temperature: 24.0, pressure: 1013.2, humidity: 50.0 },
      health_score: 62,
      recommended_action: "Reset AWS Transducer & Clear Data Buffer",
    },
    {
      station_id: "AWS-201",
      fault_type: "Pressure Drop (Multivariate Inconsistency)",
      metrics: { temperature: 42.1, pressure: 890.0, humidity: 12.0 },
      health_score: 24,
      recommended_action: "Verify Barometric Sensor Wiring & Power Input",
    },
    {
      station_id: "AWS-112",
      fault_type: "Communication Line Noise / High Rate of Change",
      metrics: { temperature: -15.4, pressure: 1050.8, humidity: 100.0 },
      health_score: 15,
      recommended_action: "Replace Communication Interface Module",
    },
  ];

  // Pick a random fault scenario from the list
  const randomScenario = faultScenarios[Math.floor(Math.random() * faultScenarios.length)];
  
  const alertData = {
    ...randomScenario,
    timestamp: new Date().toISOString(),
    anomaly_detected: true,
  };

  setCurrentReadings(alertData.metrics);
  setAlerts((prev) => [alertData, ...prev.slice(0, 9)]);
};
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-500" /> SkyGuard AI Monitoring Network
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-Time AWS Anomaly Detection & Sensor Health Diagnostics (PS ID: SIH26073)
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Demo Simulation Trigger */}
          <button
            onClick={triggerSimulatedAnomaly}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/30 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Inject Test Anomaly
          </button>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus.includes("Live")
                  ? "bg-green-500 animate-pulse"
                  : "bg-amber-500"
              }`}
            ></span>
            <span className="text-gray-300">{connectionStatus}</span>
          </div>
        </div>
      </header>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Network Health Card */}
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl backdrop-blur">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Network Health Score
            </h2>
            <Radio className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-black text-green-400">98.2%</div>
          <p className="text-gray-400 text-xs mt-3 flex items-center justify-between">
            <span>Active AWS Nodes</span>
            <span className="font-semibold text-white">120 / 122 Stations</span>
          </p>
        </div>

        {/* Real-Time Live Readings */}
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl backdrop-blur">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Active Parameters Monitored
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Temperature (°C)</span>
              <span
                className={`font-mono font-bold ${
                  currentReadings.temperature > 50 ? "text-red-400 animate-bounce" : "text-blue-400"
                }`}
              >
                {currentReadings.temperature} °C
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Atmospheric Pressure (hPa)</span>
              <span className="font-mono font-bold text-blue-400">
                {currentReadings.pressure} hPa
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Relative Humidity (%)</span>
              <span className="font-mono font-bold text-blue-400">
                {currentReadings.humidity} %
              </span>
            </div>
          </div>
        </div>

        {/* Maintenance Alert Card */}
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl backdrop-blur">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Pending Maintenance
          </h2>
          <div className="text-3xl font-extrabold text-amber-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <span>{alerts.length > 0 ? `${alerts.length} AWS Unit` : "0 Pending"}</span>
          </div>
          <p className="text-amber-200/70 text-xs mt-3 font-mono">
            {alerts.length > 0 ? `${alerts[0].station_id} - ${alerts[0].fault_type}` : "All system sensors operational."}
          </p>
        </div>
      </div>

      {/* Live Anomaly Feed */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="text-blue-400" /> Live Real-Time Anomaly Stream
          </h2>
          <span className="text-xs text-gray-500">{alerts.length} events logged</span>
        </div>

        <div className="bg-gray-900/80 rounded-2xl p-5 border border-gray-800 shadow-xl space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No active anomalies detected across station network.</p>
              <p className="text-gray-600 text-xs mt-1">Click "Inject Test Anomaly" above to test presentation mode.</p>
            </div>
          ) : (
            alerts.map((alert, idx) => (
              <div
                key={idx}
                className="bg-gray-950 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-red-500 gap-3 transition-all hover:bg-gray-900"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-red-950 text-red-400 border border-red-800 px-2.5 py-0.5 rounded font-mono font-semibold">
                      {alert.station_id}
                    </span>
                    <span className="font-bold text-sm text-gray-200">{alert.fault_type}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    <span className="text-gray-500">Recommended Action:</span>{" "}
                    <span className="text-blue-300 font-medium">{alert.recommended_action}</span>
                  </p>
                </div>

                <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 border-gray-800 pt-2 md:pt-0">
                  <div className="text-xs text-gray-500 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-red-400 font-bold mt-1">
                    Health Score: {alert.health_score} / 100
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}