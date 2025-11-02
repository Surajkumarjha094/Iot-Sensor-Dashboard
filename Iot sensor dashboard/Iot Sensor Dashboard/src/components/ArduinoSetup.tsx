import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Wifi, 
  Cpu, 
  Code, 
  Settings, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Copy
} from "lucide-react";

interface ArduinoSetupProps {
  isConnected: boolean;
  onConnectionToggle: (enabled: boolean, config?: ArduinoConfig) => void;
}

export interface ArduinoConfig {
  ipAddress: string;
  port: string;
  endpoint: string;
  updateInterval: number;
}

export function ArduinoSetup({ isConnected, onConnectionToggle }: ArduinoSetupProps) {
  const [config, setConfig] = useState<ArduinoConfig>({
    ipAddress: "192.168.1.100",
    port: "80",
    endpoint: "/sensors",
    updateInterval: 5000,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
      onConnectionToggle(true, config);
      toast({
        title: "Connected Successfully",
        description: "Arduino/ESP32 sensors are now active",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Arduino/ESP32. Check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    onConnectionToggle(false);
    toast({
      title: "Disconnected",
      description: "Switched back to simulated data",
    });
  };

  const copyArduinoCode = () => {
    const code = `#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

#define DHT_PIN 2
#define GAS_PIN A0
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);
WebServer server(${config.port});

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  server.on("${config.endpoint}", HTTP_GET, handleSensors);
  server.enableCORS(true);
  server.begin();
}

void loop() {
  server.handleClient();
  delay(100);
}

void handleSensors() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int gasValue = analogRead(GAS_PIN);
  
  DynamicJsonDocument doc(200);
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["gas"] = gasValue;
  doc["timestamp"] = millis();
  
  String response;
  serializeJson(doc, response);
  
  server.send(200, "application/json", response);
}`;

    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: "Arduino code has been copied to your clipboard",
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <Cpu className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Arduino/ESP32 Setup</h3>
        <Badge className={isConnected ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
          {isConnected ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 mr-1" />
              Disconnected
            </>
          )}
        </Badge>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="code">Arduino Code</TabsTrigger>
          <TabsTrigger value="wiring">Wiring Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                value={config.ipAddress}
                onChange={(e) => setConfig(prev => ({ ...prev, ipAddress: e.target.value }))}
                placeholder="192.168.1.100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={config.port}
                onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
                placeholder="80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                value={config.endpoint}
                onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="/sensors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Update Interval (ms)</Label>
              <Input
                id="interval"
                type="number"
                value={config.updateInterval}
                onChange={(e) => setConfig(prev => ({ ...prev, updateInterval: parseInt(e.target.value) }))}
                placeholder="5000"
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Live Data Connection</h4>
              <p className="text-sm text-muted-foreground">
                Connect to your Arduino/ESP32 for real sensor data
              </p>
            </div>
            {!isConnected ? (
              <Button 
                onClick={handleConnect} 
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleDisconnect}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Complete Arduino Code</h4>
            <Button onClick={copyArduinoCode} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
          </div>
          
          <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground whitespace-pre-wrap">
{`#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

#define DHT_PIN 2
#define GAS_PIN A0
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);
WebServer server(${config.port});

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  server.on("${config.endpoint}", HTTP_GET, handleSensors);
  server.enableCORS(true);
  server.begin();
}

void loop() {
  server.handleClient();
  delay(100);
}

void handleSensors() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int gasValue = analogRead(GAS_PIN);
  
  DynamicJsonDocument doc(200);
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["gas"] = gasValue;
  doc["timestamp"] = millis();
  
  String response;
  serializeJson(doc, response);
  
  server.send(200, "application/json", response);
}`}
            </pre>
          </div>

          <div className="text-sm text-muted-foreground">
            <h5 className="font-medium text-foreground mb-2">Required Libraries:</h5>
            <ul className="list-disc pl-4 space-y-1">
              <li>WiFi (Built-in for ESP32)</li>
              <li>WebServer (Built-in for ESP32)</li>
              <li>ArduinoJson (Install via Library Manager)</li>
              <li>DHT sensor library (Install via Library Manager)</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="wiring" className="space-y-4 mt-4">
          <h4 className="font-medium text-foreground">Sensor Wiring Guide</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-temperature/10 border-temperature/30">
              <h5 className="font-medium text-foreground mb-2">DHT22 Temperature/Humidity</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>VCC → 3.3V</li>
                <li>GND → GND</li>
                <li>DATA → GPIO 2</li>
                <li>Add 10kΩ pull-up resistor</li>
              </ul>
            </Card>

            <Card className="p-4 bg-gas/10 border-gas/30">
              <h5 className="font-medium text-foreground mb-2">MQ Gas Sensor</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>VCC → 5V (or 3.3V)</li>
                <li>GND → GND</li>
                <li>AOUT → A0 (GPIO 36)</li>
                <li>Allow 24h preheat time</li>
              </ul>
            </Card>

            <Card className="p-4 bg-primary/10 border-primary/30">
              <h5 className="font-medium text-foreground mb-2">ESP32 Power</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>USB cable for power</li>
                <li>Or 3.3V external supply</li>
                <li>GND connections</li>
                <li>WiFi antenna connected</li>
              </ul>
            </Card>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <h5 className="font-medium text-warning mb-2">⚠️ Important Notes</h5>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Ensure your ESP32 and computer are on the same WiFi network</li>
              <li>Gas sensors need 24-48 hours to stabilize after first use</li>
              <li>Use proper voltage levels - some sensors need 5V, others 3.3V</li>
              <li>Test each sensor individually before combining</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}