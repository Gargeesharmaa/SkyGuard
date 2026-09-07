from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from datetime import datetime
from src.backend.websocket_manager import manager
from src.models.spatial_checker import SpatialConsistencyChecker

app = FastAPI(title="SkyGuard AI API", version="1.0.0")
spatial_checker = SpatialConsistencyChecker()

class StationDataInput(BaseModel):
    station_id: str
    timestamp: str
    temperature: float
    pressure: float
    humidity: float
    neighbor_stations: list[dict] = []

@app.get("/")
def health_check():
    return {"status": "online", "system": "SkyGuard Real-Time Anomaly Engine", "timestamp": datetime.now().isoformat()}

@app.post("/api/ingest")
async def ingest_station_data(payload: StationDataInput):
    """
    Ingests live weather sensor data, runs multi-tier checks, and broadcasts alerts over WebSocket.
    """
    station_dict = payload.model_dump()
    
    # 1. Spatial & Neighbor Checks
    is_spatial_fault, classification = spatial_checker.evaluate_spatial_consistency(
        station_dict, payload.neighbor_stations
    )
    
    # 2. Derive Health Score (0 - 100)
    health_score = 100
    if is_spatial_fault:
        health_score -= 40
        
    response_payload = {
        "station_id": payload.station_id,
        "timestamp": payload.timestamp,
        "metrics": {
            "temperature": payload.temperature,
            "pressure": payload.pressure,
            "humidity": payload.humidity
        },
        "anomaly_detected": is_spatial_fault,
        "fault_type": classification,
        "health_score": health_score,
        "recommended_action": "Inspect/Calibrate Sensor" if is_spatial_fault else "Status Normal"
    }

    # Broadcast to live UI dashboard if flagged
    if is_spatial_fault:
        await manager.broadcast_json(response_payload)

    return response_payload

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)