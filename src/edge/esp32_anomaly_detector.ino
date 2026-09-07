#include <WiFi.h>
#include <HTTPClient.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// FastAPI Ingestion Endpoint
const char* serverName = "http://YOUR_SERVER_IP:8000/api/ingest";

// Hardware Sensor Thresholds for Local Edge Safety Checks
const float TEMP_MAX = 50.0; // °C
const float TEMP_MIN = -10.0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Network");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    // Simulated local sensor readings
    float current_temp = 32.4;
    float current_pressure = 1002.1;
    float current_humidity = 65.3;

    // Fast local edge rule check before network transfer
    bool local_anomaly = (current_temp > TEMP_MAX || current_temp < TEMP_MIN);

    String jsonPayload = "{\"station_id\":\"AWS-104\",\"timestamp\":\"2026-09-04T12:00:00Z\",\"temperature\":" 
                          + String(current_temp) + ",\"pressure\":" + String(current_pressure) 
                          + ",\"humidity\":" + String(current_humidity) + "}";

    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("Data Sent. Server Response: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
  
  // Transmit every 10 seconds
  delay(10000);
}