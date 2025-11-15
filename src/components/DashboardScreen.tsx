import { Bell, TrendingUp, Activity, Plus, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useApp } from "../lib/AppContext";
import { getHostelRoomData, getActiveAlerts, smartPlugAPI, SmartPlugDevice } from "../lib/smartPlugAPI";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import logo from "figma:asset/319df5b2d19a5da3f80d1835660cd5b1915402d0.png";

interface Room {
  id: string;
  number: string;
  status: "normal" | "warning" | "alert";
  currentUsage: number;
  percentage: number;
  detectedDevice?: string; // Added for appliance detection
  warningCount?: number; // Added for warning count tracking
}

interface DashboardScreenProps {
  onRoomClick: (roomId: string) => void;
  onAlertClick: () => void;
}

// Mock data as fallback
const fallbackRooms: Room[] = [
  { id: "1", number: "Room 101", status: "normal", currentUsage: 2.4, percentage: 45, warningCount: 0 },
  { id: "2", number: "Room 102", status: "normal", currentUsage: 1.8, percentage: 35, warningCount: 1 },
  { id: "3", number: "Room 103", status: "warning", currentUsage: 4.2, percentage: 75, detectedDevice: "electricIron", warningCount: 3 },
  { id: "4", number: "Room 104", status: "alert", currentUsage: 6.8, percentage: 95, detectedDevice: "riceCooker", warningCount: 7 },
  { id: "5", number: "Room 105", status: "normal", currentUsage: 2.1, percentage: 40, warningCount: 0 },
  { id: "6", number: "Room 106", status: "normal", currentUsage: 1.5, percentage: 28, warningCount: 2 },
  { id: "7", number: "Room 107", status: "warning", currentUsage: 4.5, percentage: 80, detectedDevice: "inductionCooker", warningCount: 5 },
  { id: "8", number: "Room 108", status: "normal", currentUsage: 2.0, percentage: 38, warningCount: 1 },
];

export function DashboardScreen({ onRoomClick, onAlertClick }: DashboardScreenProps) {
  const { t } = useApp();
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Room Management State
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<SmartPlugDevice[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [formRoomNumber, setFormRoomNumber] = useState('');
  const [formSelectedDevice, setFormSelectedDevice] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Load real data from smart plugs
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        setIsLoading(true);
        console.log('🔌 Loading real smart plug data...');
        
        const [roomData, alertsCount] = await Promise.all([
          getHostelRoomData(),
          getActiveAlerts()
        ]);
        
        setRooms(roomData);
        setActiveAlerts(alertsCount);
        setLastUpdate(new Date());
        console.log('✅ Smart plug data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading smart plug data:', error);
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadRoomData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalUsage = rooms.reduce((sum, room) => sum + room.currentUsage, 0);
  const averageUsage = totalUsage / rooms.length;

  // Room Management Functions
  const handleAddRoom = async () => {
    try {
      setIsLoadingDevices(true);
      console.log('🔌 Loading available smart devices...');
      
      const devices = await smartPlugAPI.getDevices();
      // Filter out devices that are already assigned to rooms
      const assignedDeviceIds = rooms.map(room => room.id);
      const unassignedDevices = devices.filter(device => !assignedDeviceIds.includes(device.id));
      
      setAvailableDevices(unassignedDevices);
      setShowAddRoomModal(true);
      console.log(`✅ Found ${unassignedDevices.length} available devices`);
    } catch (error) {
      console.error('❌ Error loading devices:', error);
      toast.error('Failed to load available devices');
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const handleSaveRoom = async () => {
    // Validation
    if (!formRoomNumber.trim()) {
      toast.error('Room number is required');
      return;
    }
    
    if (!formSelectedDevice) {
      toast.error('Please select a smart device');
      return;
    }
    
    // Check if room number already exists
    if (rooms.some(room => room.number.toLowerCase().includes(formRoomNumber.trim().toLowerCase()))) {
      toast.error('Room number already exists');
      return;
    }

    try {
      setIsCreatingRoom(true);
      
      // Find the selected device
      const selectedDevice = availableDevices.find(device => device.id === formSelectedDevice);
      if (!selectedDevice) {
        toast.error('Selected device not found');
        return;
      }

      // Create new room with smart device
      const newRoom: Room = {
        id: selectedDevice.id,
        number: `Room ${formRoomNumber.trim()}`,
        status: selectedDevice.currentPower > 5000 ? 'alert' : 
                selectedDevice.currentPower > 3000 ? 'warning' : 'normal',
        currentUsage: Number((selectedDevice.currentPower / 1000).toFixed(1)),
        percentage: Math.min(Math.round((selectedDevice.currentPower / 6000) * 100), 100),
        detectedDevice: selectedDevice.currentPower > 5000 ? 'High Power Device' : undefined,
        warningCount: selectedDevice.currentPower > 3000 ? 1 : 0
      };

      // Add to rooms list
      setRooms(prev => [...prev, newRoom]);
      
      // Reset form and close modal
      resetRoomForm();
      setShowAddRoomModal(false);
      
      console.log('Room added successfully:', newRoom.number);
      toast.success(`${newRoom.number} added successfully!`, {
        description: `Connected to device: ${selectedDevice.name}`,
        duration: 4000
      });
      
    } catch (error) {
      console.error('Error adding room:', error);
      toast.error('Error adding room', {
        description: 'Please try again.',
        duration: 4000
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const resetRoomForm = () => {
    setFormRoomNumber('');
    setFormSelectedDevice('');
  };

  const handleCloseRoomModal = () => {
    resetRoomForm();
    setShowAddRoomModal(false);
  };

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "normal":
        return "bg-[#3B8E3C]";
      case "warning":
        return "bg-[#FD0835]";
      case "alert":
        return "bg-[#E53935]";
    }
  };

  const getStatusBorderColor = (status: Room["status"]) => {
    switch (status) {
      case "normal":
        return "border-[#B2DFB8]";
      case "warning":
        return "border-[#FDD835]/40";
      case "alert":
        return "border-[#E53935]/40";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-8 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-2 flex-shrink-0">
              <img src={logo} alt="Oracle Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <p className="text-primary-foreground/80 text-sm">{t('welcomeBack')}</p>
              <h1 className="text-2xl">{t('hostelAdmin')}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onAlertClick}
              className="relative p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {activeAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeAlerts}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-2 bg-white/20 rounded-xl px-3 py-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
              <span className="text-xs text-primary-foreground/70">
                {isLoading ? 'Updating...' : `Live • ${lastUpdate.toLocaleTimeString()}`}
              </span>
            </div>
          </div>
        </div>
                {activeAlerts}
              </span>
            )}
          </button>
        </div>

        {/* Total Power Usage Card */}
        <Card className="bg-card/95 p-5 border-0 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-muted-foreground text-sm mb-1">{t('totalPowerUsage')}</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl text-card-foreground">{totalUsage.toFixed(1)}</h2>
                <span className="text-muted-foreground">kWh</span>
              </div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-xl">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-[#3B8E3C]" />
            <span className="text-[#3B8E3C]">12% {t('lowerThanYesterday')}</span>
            <span className="text-muted-foreground"></span>
          </div>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center border-[#B2DFB8] bg-card">
            <div className="w-3 h-3 bg-[#3B8E3C] rounded-full mx-auto mb-2" />
            <p className="text-2xl mb-1">{rooms.filter(r => r.status === "normal").length}</p>
            <p className="text-xs text-muted-foreground">{t('normal')}</p>
          </Card>
          <Card className="p-4 text-center border-[#FDD835]/40 bg-card">
            <div className="w-3 h-3 bg-[#FD0835] rounded-full mx-auto mb-2" />
            <p className="text-2xl mb-1">{rooms.filter(r => r.status === "warning").length}</p>
            <p className="text-xs text-muted-foreground">{t('warning')}</p>
          </Card>
          <Card className="p-4 text-center border-[#E53935]/40 bg-card">
            <div className="w-3 h-3 bg-[#E53935] rounded-full mx-auto mb-2" />
            <p className="text-2xl mb-1">{rooms.filter(r => r.status === "alert").length}</p>
            <p className="text-xs text-muted-foreground">{t('alert')}</p>
          </Card>
        </div>

        {/* Room List */}
        <div className="flex items-center justify-between mb-4">
          <h3>{t('roomStatus')}</h3>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-secondary/50 text-primary border-secondary">
              {rooms.length} {t('rooms')}
            </Badge>
            <Button
              onClick={handleAddRoom}
              size="sm"
              className="bg-[#08796B] hover:bg-[#065D52] text-white"
              disabled={isLoadingDevices}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isLoadingDevices ? 'Loading...' : 'Add Room'}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {rooms.map((room) => (
            <Card
              key={room.id}
              onClick={() => onRoomClick(room.id)}
              className={`p-4 border-2 ${getStatusBorderColor(room.status)} bg-card cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${getStatusColor(room.status)} rounded-full`} />
                  <h4>{t('room')} {room.number.replace('Room ', '')}</h4>
                  {room.warningCount !== undefined && room.warningCount > 0 && (
                    <Badge 
                      variant="outline" 
                      className="bg-[#FD0835]/10 text-[#FD0835] border-[#FD0835]/30 text-xs"
                    >
                      {room.warningCount} {t('warnings')}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-card-foreground">{room.currentUsage} kWh</p>
                  <p className="text-xs text-muted-foreground">{t('currentUsage')}</p>
                </div>
              </div>
              {room.detectedDevice && (
                <div className="mb-3">
                  <Badge variant="destructive" className="bg-[#E53935] text-white">
                    {t('unauthorizedDevice')}: {t(room.detectedDevice as any)}
                  </Badge>
                </div>
              )}
              <Progress value={room.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{room.percentage}% {t('ofCapacity')}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Room Modal */}
      <Dialog open={showAddRoomModal} onOpenChange={handleCloseRoomModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#08796B]" />
              Add New Room
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                type="text"
                placeholder="Enter room number (e.g., 101, 205)"
                value={formRoomNumber}
                onChange={(e) => setFormRoomNumber(e.target.value)}
                className="bg-gray-50 border-gray-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smartDevice">Smart Device</Label>
              <Select value={formSelectedDevice} onValueChange={setFormSelectedDevice}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select a smart device" />
                </SelectTrigger>
                <SelectContent>
                  {availableDevices.length === 0 ? (
                    <SelectItem value="no-devices" disabled>
                      No available devices
                    </SelectItem>
                  ) : (
                    availableDevices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{device.name}</span>
                          <div className="flex items-center gap-2 ml-2">
                            <div className={`w-2 h-2 rounded-full ${device.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs text-gray-500">
                              {(device.currentPower / 1000).toFixed(1)}kW
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formSelectedDevice && (
                <p className="text-xs text-gray-500">
                  Selected device will be assigned to this room for monitoring
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCloseRoomModal}
              className="flex-1"
              disabled={isCreatingRoom}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRoom}
              className="flex-1 bg-[#08796B] hover:bg-[#065D52] text-white"
              disabled={isCreatingRoom || !formRoomNumber.trim() || !formSelectedDevice}
            >
              {isCreatingRoom ? 'Adding...' : 'Add Room'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}