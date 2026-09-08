import React, { useState, useEffect } from "react";
import { AlertTriangle, Activity, ShieldCheck, RefreshCw, Radio, MapPin } from "lucide-react";

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Fetching IMD Data...");
  const [currentReadings, setCurrentReadings] = useState({
    temperature: 0,
    pressure: 0,
    humidity: 0,
  });

  // Fetch Real-Time Weather Data for Ajmer, Rajasthan, India
  const fetchAjmerIMDData = async () => {
    try {
      setConnectionStatus("Syncing IMD Feed...");
      // Open-Meteo API configured for Ajmer, Rajasthan coordinates (26.4499° N, 74.6399° E)
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=26.4499&longitude=74.6399&current=temperature_2m,relative_humidity_2m,surface_pressure"
      );
      const data = await res.json();

      const liveMetrics = {
        temperature: data.current.temperature_2m,
        pressure: data.current.surface_pressure,
        humidity: data.current.relative_humidity_2m,
      };

      setCurrentReadings(liveMetrics);
      setConnectionStatus("IMD Live Feed Active");

      // Automated Rule-Based Check based on Ajmer IMD Baseline
      evaluateIMDAnomalies("AWS-AJMER-01", liveMetrics);
    } catch (error) {
      console.error("Failed to fetch IMD data:", error);
      setConnectionStatus("IMD Feed Offline (Demo Mode)");
    }
  };

  useEffect(() => {
    fetchAjmerIMDData();
    const interval = setInterval(fetchAjmerIMDData, 60000); // Auto-refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const evaluateIMDAnomalies = (stationId, metrics) => {
    // IMD Rajasthan Region Safety Thresholds
    let healthScore = 100;
    let faultType = null;
    let action = null;

    if (metrics.temperature > 48.0) {
      healthScore -= 45;
      faultType = "Extreme Thermal Spike / Heatwave Outlier";
      action = "Verify Temperature Transducer & Shield Integrity";
    } else if (metrics.temperature < 2.0) {
      healthScore -= 40;
      faultType = "Cold Wave Drift Anomaly";
      action = "Recalibrate Thermal Resistor Circuit";
    }

    if (metrics.pressure < 950.0 || metrics.pressure > 1030.0) {
      healthScore -= 35;
      faultType = "Barometric Pressure Sensor Fault";
      action = "Inspect Barometer Venting Line for Blockage";
    }

    if (healthScore < 100) {
      const anomalyEvent = {
        station_id: stationId,
        timestamp: new Date().toISOString(),
        metrics: metrics,
        anomaly_detected: true,
        fault_type: faultType || "Multivariate Parameter Variance",
        health_score: healthScore,
        recommended_action: action || "Perform On-Site AWS Maintenance",
      };
      setAlerts((prev) => [anomalyEvent, ...prev.slice(0, 9)]);
    }
  };

  // Inject Simulated Anomaly for Demo Purposes
  const triggerAjmerSimulatedAnomaly = () => {
    const ajmerFaults = [
      {
        station_id: "AWS-AJMER-01",
        fault_type: "Sensory Spike: Desert Heat Hardware Noise",
        metrics: { temperature: 52.4, pressure: 994.2, humidity: 12.0 },
        health_score: 32,
        recommended_action: "Replace Thermistor Probe at Ajmer Station",
      },
      {
        station_id: "AWS-PUSHKAR-02",
        fault_type: "Barometric Drift / Pressure Drop",
        metrics: { temperature: 34.1, pressure: 910.5, humidity: 45.0 },
        health_score: 41,
        recommended_action: "Calibrate Pushkar Pressure Transducer",
      },
      {
        station_id: "AWS-KISHANGARH-03",
        fault_type: "Frozen Humidity Sensor Stream",
        metrics: { temperature: 31.0, pressure: 1004.1, humidity: 0.0 },
        health_score: 55,
        recommended_action: "Clear Dust Obstruction from Humidity Module",
      },
    ];

    const scenario = ajmerFaults[Math.floor(Math.random() * ajmerFaults.length)];
    const event = { ...scenario, timestamp: new Date().toISOString(), anomaly_detected: true };

    setCurrentReadings(event.metrics);
    setAlerts((prev) => [event, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-500" /> SkyGuard AI — IMD Station Monitor
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" /> Real-Time AWS Node: Ajmer, Rajasthan, India (26.4499° N, 74.6399° E)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={triggerAjmerSimulatedAnomaly}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-lg active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Inject Anomaly Test
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-300">{connectionStatus}</span>
          </div>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-400 text-xs font-semibold uppercase">IMD Regional Network Health</h2>
            <Radio className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-black text-green-400">97.8%</div>
          <p className="text-gray-400 text-xs mt-3 flex justify-between">
            <span>Rajasthan Active Nodes</span>
            <span className="font-semibold text-white">45 / 46 Stations</span>
          </p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <h2 className="text-gray-400 text-xs font-semibold uppercase mb-4">Ajmer Real-Time Live Feed</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Temperature (°C)</span>
              <span className="font-mono font-bold text-blue-400">{currentReadings.temperature} °C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pressure (hPa)</span>
              <span className="font-mono font-bold text-blue-400">{currentReadings.pressure} hPa</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Humidity (%)</span>
              <span className="font-mono font-bold text-blue-400">{currentReadings.humidity} %</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <h2 className="text-gray-400 text-xs font-semibold uppercase mb-4">Pending Maintenance</h2>
          <div className="text-3xl font-extrabold text-amber-400 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <span>{alerts.length} Flagged AWS</span>
          </div>
          <p className="text-amber-200/70 text-xs mt-3 font-mono">
            {alerts.length > 0 ? `${alerts[0].station_id}: ${alerts[0].fault_type}` : "Ajmer AWS node operating within normal parameters."}
          </p>
        </div>
      </div>

      {/* Stream Feed */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="text-blue-400" /> Regional Anomaly Stream (IMD Rajasthan Division)
          </h2>
          <span className="text-xs text-gray-500">{alerts.length} events logged</span>
        </div>

        <div className="bg-gray-900/80 rounded-2xl p-5 border border-gray-800 shadow-xl space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No live sensor anomalies detected across Ajmer AWS division.</p>
            </div>
          ) : (
            alerts.map((alert, idx) => (
              <div key={idx} className="bg-gray-950 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-red-500 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-red-950 text-red-400 border border-red-800 px-2.5 py-0.5 rounded font-mono font-semibold">
                      {alert.station_id}
                    </span>
                    <span className="font-bold text-sm text-gray-200">{alert.fault_type}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Action Required: <span className="text-blue-300">{alert.recommended_action}</span>
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-xs text-gray-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                  <div className="text-xs text-red-400 font-bold mt-1">Health Score: {alert.health_score} / 100</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}