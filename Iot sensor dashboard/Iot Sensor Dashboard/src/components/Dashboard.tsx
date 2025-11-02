import { useState, useEffect } from "react";
import { SensorCard } from "./SensorCard";
import { ChartWidget } from "./ChartWidget";
import { StatusPanel } from "./StatusPanel";
import { ArduinoSetup, type ArduinoConfig } from "./ArduinoSetup";
import { arduinoService, type SensorData } from "@/services/arduinoService";
import { Button } from "./ui/button";
import { Settings, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Simulate real-time sensor data
const generateSensorData = () => ({
  temperature: 20 + Math.random() * 15, // 20-35°C
  humidity: 40 + Math.random() * 40,    // 40-80%
  gas: Math.random() * 1000,           // 0-1000 ppm
  timestamp: new Date().toISOString(),
});

// Generate historical data for charts
const generateHistoricalData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours().toString().padStart(2, '0') + ':00',
      temperature: 22 + Math.sin(i * 0.3) * 5 + Math.random() * 2,
      humidity: 60 + Math.cos(i * 0.4) * 15 + Math.random() * 5,
      gas: 200 + Math.random() * 300,
    });
  }
  
  return data;
};

// Define alert type
type Alert = {
  id: string;
  message: string;
  severity: "info" | "warning" | "error";
  timestamp: string;
};

export function Dashboard() {
  const [sensorData, setSensorData] = useState(generateSensorData());
  const [historicalData] = useState(generateHistoricalData());
  const [isArduinoConnected, setIsArduinoConnected] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      message: "System initialized with simulated data",
      severity: "info",
      timestamp: "2 minutes ago",
    },
  ]);

  // Handle Arduino connection
  const handleArduinoConnection = async (enabled: boolean, config?: ArduinoConfig) => {
    if (enabled && config) {
      try {
        await arduinoService.connect(config);
        setIsArduinoConnected(true);
        
        // Subscribe to Arduino data
        arduinoService.onData((data: SensorData) => {
          setSensorData({
            temperature: data.temperature,
            humidity: data.humidity,
            gas: data.gas,
            timestamp: new Date(data.timestamp).toISOString(),
          });
        });

        setAlerts(prev => [{
          id: Date.now().toString(),
          message: "Arduino/ESP32 connected successfully",
          severity: "info" as const,
          timestamp: "Just now",
        }, ...prev].slice(0, 5));
      } catch (error) {
        console.error('Failed to connect to Arduino:', error);
      }
    } else {
      arduinoService.disconnect();
      setIsArduinoConnected(false);
      
      setAlerts(prev => [{
        id: Date.now().toString(),
        message: "Switched to simulated sensor data",
        severity: "info" as const,
        timestamp: "Just now",
      }, ...prev].slice(0, 5));
    }
  };

  // Simulate real-time updates (only when Arduino not connected)
  useEffect(() => {
    if (isArduinoConnected) return;

    const interval = setInterval(() => {
      const newData = generateSensorData();
      setSensorData(newData);
      
      // Simulate alerts
      if (newData.temperature > 30) {
        const alertExists = alerts.some(a => a.message.includes("High temperature"));
        if (!alertExists) {
          setAlerts(prev => [{
            id: Date.now().toString(),
            message: "High temperature detected",
            severity: "warning" as const,
            timestamp: "Just now",
          }, ...prev].slice(0, 5));
        }
      }
      
      if (newData.gas > 800) {
        const alertExists = alerts.some(a => a.message.includes("Gas level"));
        if (!alertExists) {
          setAlerts(prev => [{
            id: Date.now().toString(),
            message: "Gas level exceeds safe threshold",
            severity: "error" as const,
            timestamp: "Just now",
          }, ...prev].slice(0, 5));
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [alerts, isArduinoConnected]);

  const getTemperatureStatus = (temp: number) => {
    if (temp > 30) return "danger";
    if (temp > 25) return "warning";
    return "normal";
  };

  const getHumidityStatus = (humidity: number): "normal" | "warning" | "danger" => {
    if (humidity > 80 || humidity < 20) return "danger";
    if (humidity > 75 || humidity < 30) return "warning";
    return "normal";
  };

  const getGasStatus = (gas: number) => {
    if (gas > 800) return "danger";
    if (gas > 500) return "warning";
    return "normal";
  };

  const overallStatus = 
    getTemperatureStatus(sensorData.temperature) === "danger" ||
    getHumidityStatus(sensorData.humidity) === "danger" ||
    getGasStatus(sensorData.gas) === "danger"
      ? "danger"
      : getTemperatureStatus(sensorData.temperature) === "warning" ||
        getHumidityStatus(sensorData.humidity) === "warning" ||
        getGasStatus(sensorData.gas) === "warning"
      ? "warning"
      : "normal";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IoT Sensor Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time environmental monitoring with Arduino/ESP32 support
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Arduino Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Connection Status Banner */}
            {isArduinoConnected && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 text-center">
                <p className="text-success font-medium">
                  ✓ Connected to Arduino/ESP32 - Displaying live sensor data
                </p>
              </div>
            )}

            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SensorCard
                title="Temperature"
                value={sensorData.temperature}
                unit="°C"
                type="temperature"
                status={getTemperatureStatus(sensorData.temperature)}
              />
              <SensorCard
                title="Humidity"
                value={sensorData.humidity}
                unit="%"
                type="humidity"
                status={getHumidityStatus(sensorData.humidity)}
              />
              <SensorCard
                title="Gas Level"
                value={sensorData.gas}
                unit="ppm"
                type="gas"
                status={getGasStatus(sensorData.gas)}
              />
            </div>

            {/* Charts and Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ChartWidget
                  data={historicalData}
                  title="Temperature Trend"
                  dataKey="temperature"
                  color="hsl(var(--temperature))"
                  unit="°C"
                />
                <ChartWidget
                  data={historicalData}
                  title="Humidity Trend"
                  dataKey="humidity"
                  color="hsl(var(--humidity))"
                  unit="%"
                />
              </div>
              
              <div className="space-y-6">
                <ChartWidget
                  data={historicalData}
                  title="Gas Level Trend"
                  dataKey="gas"
                  color="hsl(var(--gas))"
                  unit="ppm"
                />
                <StatusPanel
                  overallStatus={overallStatus}
                  alerts={alerts}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="setup" className="mt-6">
            <ArduinoSetup 
              isConnected={isArduinoConnected}
              onConnectionToggle={handleArduinoConnection}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}