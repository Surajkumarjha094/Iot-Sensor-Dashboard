# 🔧 Arduino IoT Dashboard
A **real-time monitoring dashboard** for Arduino sensor data, built with **React + TypeScript**. Track **temperature**, **humidity**, and **gas levels** with smooth **visualizations** and **live updates** — all in a clean, responsive UI.

![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Features
- ⚡ **Real-time Monitoring** — Live updates from Arduino sensors  
- 📊 **Interactive Visualizations** — Beautiful charts via **Recharts**  
- 🌡️ **Multi-Sensor Support** — Temperature, humidity, and gas detection  
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile  
- ⚙️ **Easy Setup** — Quick configuration for Arduino connectivity  
- 💎 **Modern UI** — Built using **shadcn/ui** and **Tailwind CSS**

---

## 📋 Prerequisites
- Node.js **18+**
- Arduino with sensors (temperature, humidity, gas)
- Arduino configured to expose an **HTTP JSON endpoint**

---

## 🛠️ Installation
```bash
# 1️⃣ Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start development server
npm run dev
```
Then open 👉 `http://localhost:8080`

---

## 🔧 Arduino Setup

### 🧩 Expected Data Format
Your Arduino should expose an endpoint returning JSON in this format:
```json
{
  "temperature": 23.5,
  "humidity": 55.2,
  "gas": 350,
  "timestamp": 1699564800000
}
```

### ⚙️ Configuration Steps
1. Click **“Setup Arduino”** in the dashboard  
2. Enter your Arduino’s **IP address**, **port**, and **endpoint path**  
3. Choose update interval (in ms)  
4. Hit **Connect**

---

### 💡 Example Arduino Code
```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);

void handleSensors() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  int gas = analogRead(A0);
  
  String json = "{";
  json += "\"temperature\":" + String(temp) + ",";
  json += "\"humidity\":" + String(humidity) + ",";
  json += "\"gas\":" + String(gas) + ",";
  json += "\"timestamp\":" + String(millis());
  json += "}";
  
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(200, "application/json", json);
}

void setup() {
  WiFi.begin("YOUR_SSID", "YOUR_PASSWORD");
  dht.begin();
  server.on("/sensors", handleSensors);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

---

## 🏗️ Tech Stack
| Technology | Purpose |
|-------------|----------|
| **React 18.3** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Modern UI components |
| **Recharts** | Data visualization |
| **Lucide React** | Icons |

---

## 📁 Project Structure
```
src/
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── ArduinoSetup.tsx   # Arduino setup wizard
│   ├── Dashboard.tsx      # Main dashboard view
│   ├── SensorCard.tsx     # Individual sensor display
│   ├── ChartWidget.tsx    # Visualization charts
│   └── StatusPanel.tsx    # Connection status and info
├── services/
│   └── arduinoService.ts  # Arduino data fetching logic
├── pages/
│   └── Index.tsx          # Home page
└── main.tsx               # App entry point
```
---

## 💡 Next Steps
After remixing this project, you can:
1. 🔗 **Connect Real Hardware** — Use your Arduino board for live data  
2. 🚨 **Add Alerts** — Set thresholds for critical values  
3. 📈 **Enable Data Logging** — Store readings in Lovable Cloud  
4. 🌍 **Add More Sensors** — Expand to motion, light, or pressure  
5. 🔐 **Add Authentication** — Secure your dashboard  
6. 🧾 **Generate Reports** — Daily or weekly summaries of sensor data  

---

> ✨ *Monitor your environment in real-time — elegant, open-source, and developer-friendly.*
