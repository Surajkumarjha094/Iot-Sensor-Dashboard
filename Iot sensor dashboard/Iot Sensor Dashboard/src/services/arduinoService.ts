import type { ArduinoConfig } from "@/components/ArduinoSetup";

export interface SensorData {
  temperature: number;
  humidity: number;
  gas: number;
  timestamp: number;
}

export class ArduinoService {
  private config: ArduinoConfig | null = null;
  private isConnected = false;
  private pollInterval: NodeJS.Timeout | null = null;
  private listeners: ((data: SensorData) => void)[] = [];

  connect(config: ArduinoConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this.config = config;
      this.isConnected = true;
      
      // Start polling for data
      this.startPolling();
      
      // Simulate connection success for demo
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  disconnect(): void {
    this.isConnected = false;
    this.config = null;
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  private startPolling(): void {
    if (!this.config || this.pollInterval) return;

    this.pollInterval = setInterval(async () => {
      try {
        const data = await this.fetchSensorData();
        if (data) {
          this.notifyListeners(data);
        }
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
        // In a real implementation, you might want to handle reconnection here
      }
    }, this.config.updateInterval);
  }

  private async fetchSensorData(): Promise<SensorData | null> {
    if (!this.config) return null;

    const url = `http://${this.config.ipAddress}:${this.config.port}${this.config.endpoint}`;
    
    try {
      // For demo purposes, we'll simulate real Arduino data with some realistic variations
      // In a real implementation, you would do:
      // const response = await fetch(url);
      // const data = await response.json();
      // return data as SensorData;

      // Simulated realistic sensor data
      const now = Date.now();
      const baseTemp = 23;
      const baseHumidity = 55;
      const baseGas = 300;

      return {
        temperature: baseTemp + Math.sin(now / 60000) * 3 + (Math.random() - 0.5) * 2,
        humidity: baseHumidity + Math.cos(now / 80000) * 10 + (Math.random() - 0.5) * 5,
        gas: baseGas + Math.random() * 200 + Math.sin(now / 120000) * 100,
        timestamp: now,
      };
    } catch (error) {
      console.error('Arduino fetch error:', error);
      return null;
    }
  }

  onData(callback: (data: SensorData) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(data: SensorData): void {
    this.listeners.forEach(listener => listener(data));
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getConfig(): ArduinoConfig | null {
    return this.config;
  }
}

// Singleton instance
export const arduinoService = new ArduinoService();