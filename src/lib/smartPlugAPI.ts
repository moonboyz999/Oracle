// Smart Plug API Integration for Oracle Smart Hostel System
import CryptoJS from 'crypto-js';

// Smart Plug API Configuration
const SMART_PLUG_CONFIG = {
  clientId: import.meta.env.VITE_SMART_PLUG_CLIENT_ID || 'qyn73xvjs8jsg584v37',
  clientSecret: import.meta.env.VITE_SMART_PLUG_CLIENT_SECRET || '30bc9fc8ea754661b98754052b4b8a61',
  baseUrl: import.meta.env.VITE_SMART_PLUG_API_URL || 'https://openapi.tuyaus.com',
  version: '1.0'
};

// Device data interfaces
export interface SmartPlugDevice {
  id: string;
  name: string;
  roomNumber: string;
  online: boolean;
  powerState: boolean; // on/off
  currentPower: number; // watts
  voltage: number;
  current: number; // amperage
  totalEnergy: number; // kWh
  lastUpdate: Date;
}

export interface PowerReading {
  deviceId: string;
  timestamp: Date;
  power: number;
  voltage: number;
  current: number;
  energy: number;
}

export interface DeviceAlert {
  deviceId: string;
  roomNumber: string;
  type: 'high_power' | 'offline' | 'unauthorized_device';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

// Authentication and API utilities
class SmartPlugAPI {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  // Generate signature for API authentication
  private generateSignature(method: string, url: string, body: string, timestamp: string): string {
    const stringToSign = [
      method,
      CryptoJS.SHA256(body).toString(CryptoJS.enc.Hex),
      '',
      url
    ].join('\n');

    const signStr = SMART_PLUG_CONFIG.clientId + timestamp + stringToSign;
    return CryptoJS.HmacSHA256(signStr, SMART_PLUG_CONFIG.clientSecret).toString(CryptoJS.enc.Hex).toUpperCase();
  }

  // Get access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const timestamp = Date.now().toString();
    const method = 'GET';
    const url = '/v1.0/token?grant_type=1';
    const body = '';

    const signature = this.generateSignature(method, url, body, timestamp);

    try {
      const response = await fetch(`${SMART_PLUG_CONFIG.baseUrl}${url}`, {
        method: 'GET',
        headers: {
          'client_id': SMART_PLUG_CONFIG.clientId,
          'sign': signature,
          'sign_method': 'HMAC-SHA256',
          't': timestamp,
          'v': SMART_PLUG_CONFIG.version,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success && data.result) {
        this.accessToken = data.result.access_token;
        this.tokenExpiry = new Date(Date.now() + (data.result.expire_time * 1000));
        console.log('✅ Smart Plug API: Access token obtained');
        return this.accessToken;
      } else {
        throw new Error(`Authentication failed: ${data.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Smart Plug API: Authentication error:', error);
      throw error;
    }
  }

  // Make authenticated API request
  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' = 'GET', body?: any): Promise<any> {
    const token = await this.getAccessToken();
    const timestamp = Date.now().toString();
    const url = endpoint;
    const requestBody = body ? JSON.stringify(body) : '';

    const signature = this.generateSignature(method, url, requestBody, timestamp);

    try {
      const response = await fetch(`${SMART_PLUG_CONFIG.baseUrl}${url}`, {
        method,
        headers: {
          'client_id': SMART_PLUG_CONFIG.clientId,
          'access_token': token,
          'sign': signature,
          'sign_method': 'HMAC-SHA256',
          't': timestamp,
          'v': SMART_PLUG_CONFIG.version,
          'Content-Type': 'application/json'
        },
        body: requestBody || undefined
      });

      const data = await response.json();
      
      if (data.success) {
        return data.result;
      } else {
        throw new Error(`API request failed: ${data.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`❌ Smart Plug API: Request error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all devices
  async getDevices(): Promise<SmartPlugDevice[]> {
    try {
      console.log('🔌 Fetching smart plug devices...');
      const devices = await this.makeRequest('/v1.0/devices');
      
      return devices.map((device: any) => ({
        id: device.id,
        name: device.name,
        roomNumber: this.extractRoomNumber(device.name),
        online: device.online,
        powerState: device.status?.find((s: any) => s.code === 'switch_1')?.value || false,
        currentPower: device.status?.find((s: any) => s.code === 'cur_power')?.value || 0,
        voltage: device.status?.find((s: any) => s.code === 'cur_voltage')?.value || 0,
        current: device.status?.find((s: any) => s.code === 'cur_current')?.value || 0,
        totalEnergy: device.status?.find((s: any) => s.code === 'add_ele')?.value || 0,
        lastUpdate: new Date()
      }));
    } catch (error) {
      console.error('❌ Error fetching devices:', error);
      return [];
    }
  }

  // Get device status by ID
  async getDeviceStatus(deviceId: string): Promise<SmartPlugDevice | null> {
    try {
      const device = await this.makeRequest(`/v1.0/devices/${deviceId}/status`);
      
      return {
        id: deviceId,
        name: device.name || `Device ${deviceId}`,
        roomNumber: this.extractRoomNumber(device.name || ''),
        online: device.online,
        powerState: device.status?.find((s: any) => s.code === 'switch_1')?.value || false,
        currentPower: device.status?.find((s: any) => s.code === 'cur_power')?.value || 0,
        voltage: device.status?.find((s: any) => s.code === 'cur_voltage')?.value || 0,
        current: device.status?.find((s: any) => s.code === 'cur_current')?.value || 0,
        totalEnergy: device.status?.find((s: any) => s.code === 'add_ele')?.value || 0,
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error(`❌ Error fetching device ${deviceId}:`, error);
      return null;
    }
  }

  // Control device (turn on/off)
  async controlDevice(deviceId: string, powerState: boolean): Promise<boolean> {
    try {
      console.log(`🔌 ${powerState ? 'Turning ON' : 'Turning OFF'} device ${deviceId}`);
      
      await this.makeRequest(`/v1.0/devices/${deviceId}/commands`, 'POST', {
        commands: [{
          code: 'switch_1',
          value: powerState
        }]
      });
      
      console.log(`✅ Device ${deviceId} ${powerState ? 'turned ON' : 'turned OFF'}`);
      return true;
    } catch (error) {
      console.error(`❌ Error controlling device ${deviceId}:`, error);
      return false;
    }
  }

  // Get power history for a device
  async getPowerHistory(deviceId: string, days: number = 7): Promise<PowerReading[]> {
    try {
      const endTime = Date.now();
      const startTime = endTime - (days * 24 * 60 * 60 * 1000);
      
      const history = await this.makeRequest(
        `/v1.0/devices/${deviceId}/logs?start_time=${startTime}&end_time=${endTime}&type=7&size=100`
      );
      
      return history.map((reading: any) => ({
        deviceId,
        timestamp: new Date(reading.event_time),
        power: reading.value || 0,
        voltage: 0, // May need separate API call
        current: 0, // May need separate API call
        energy: 0   // May need separate API call
      }));
    } catch (error) {
      console.error(`❌ Error fetching power history for ${deviceId}:`, error);
      return [];
    }
  }

  // Extract room number from device name
  private extractRoomNumber(deviceName: string): string {
    const match = deviceName.match(/room\s*(\d+)/i) || deviceName.match(/(\d{3})/);
    return match ? `Room ${match[1]}` : 'Unknown Room';
  }

  // Detect unusual power patterns
  async detectAlerts(devices: SmartPlugDevice[]): Promise<DeviceAlert[]> {
    const alerts: DeviceAlert[] = [];
    
    devices.forEach(device => {
      // High power usage alert (> 5kW)
      if (device.currentPower > 5000) {
        alerts.push({
          deviceId: device.id,
          roomNumber: device.roomNumber,
          type: 'high_power',
          message: `High power usage detected: ${(device.currentPower / 1000).toFixed(2)}kW`,
          timestamp: new Date(),
          severity: device.currentPower > 8000 ? 'high' : 'medium'
        });
      }
      
      // Offline device alert
      if (!device.online) {
        alerts.push({
          deviceId: device.id,
          roomNumber: device.roomNumber,
          type: 'offline',
          message: `Device is offline`,
          timestamp: new Date(),
          severity: 'medium'
        });
      }
      
      // Potential unauthorized device (very high power)
      if (device.currentPower > 8000) {
        alerts.push({
          deviceId: device.id,
          roomNumber: device.roomNumber,
          type: 'unauthorized_device',
          message: `Possible unauthorized high-power device detected`,
          timestamp: new Date(),
          severity: 'high'
        });
      }
    });
    
    return alerts;
  }
}

// Export singleton instance
export const smartPlugAPI = new SmartPlugAPI();

// Utility functions for the app
export const getHostelRoomData = async () => {
  try {
    console.log('🏠 Fetching real hostel room data...');
    const devices = await smartPlugAPI.getDevices();
    
    // Transform to match existing Room interface
    return devices.map(device => ({
      id: device.id,
      number: device.roomNumber,
      status: device.currentPower > 5000 ? 'alert' : 
              device.currentPower > 3000 ? 'warning' : 'normal',
      currentUsage: Number((device.currentPower / 1000).toFixed(1)), // Convert to kW
      percentage: Math.min(Math.round((device.currentPower / 6000) * 100), 100), // Max 6kW = 100%
      detectedDevice: device.currentPower > 5000 ? 'High Power Device' : undefined,
      warningCount: device.currentPower > 3000 ? 1 : 0
    }));
  } catch (error) {
    console.error('❌ Error fetching room data:', error);
    // Return mock data as fallback
    return [
      { id: "1", number: "Room 101", status: "normal" as const, currentUsage: 2.4, percentage: 45, warningCount: 0 },
      { id: "2", number: "Room 102", status: "normal" as const, currentUsage: 1.8, percentage: 35, warningCount: 1 },
      { id: "3", number: "Room 103", status: "warning" as const, currentUsage: 4.2, percentage: 75, detectedDevice: "Electric Iron", warningCount: 3 },
      { id: "4", number: "Room 104", status: "alert" as const, currentUsage: 6.8, percentage: 95, detectedDevice: "Rice Cooker", warningCount: 7 }
    ];
  }
};

export const getActiveAlerts = async () => {
  try {
    console.log('⚠️ Checking for active alerts...');
    const devices = await smartPlugAPI.getDevices();
    const alerts = await smartPlugAPI.detectAlerts(devices);
    return alerts.length;
  } catch (error) {
    console.error('❌ Error fetching alerts:', error);
    return 3; // Fallback count
  }
};

export const controlRoomPower = async (roomId: string, powerState: boolean) => {
  try {
    console.log(`🔌 Controlling power for room ${roomId}`);
    return await smartPlugAPI.controlDevice(roomId, powerState);
  } catch (error) {
    console.error(`❌ Error controlling room ${roomId}:`, error);
    return false;
  }
};