import { Bell, TrendingUp, Activity } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { useApp } from "../lib/AppContext";
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

const rooms: Room[] = [
  { id: "1", number: "Room 101", status: "normal", currentUsage: 2.4, percentage: 45, warningCount: 0 },
  { id: "2", number: "Room 102", status: "normal", currentUsage: 1.8, percentage: 35, warningCount: 1 },
  { id: "3", number: "Room 103", status: "warning", currentUsage: 4.2, percentage: 75, detectedDevice: "electricIron", warningCount: 3 },
  { id: "4", number: "Room 104", status: "alert", currentUsage: 6.8, percentage: 95, detectedDevice: "riceCooker", warningCount: 7 },
  { id: "5", number: "Room 105", status: "normal", currentUsage: 2.1, percentage: 40, warningCount: 0 },
  { id: "6", number: "Room 106", status: "normal", currentUsage: 1.5, percentage: 28, warningCount: 2 },
  { id: "7", number: "Room 107", status: "warning", currentUsage: 4.5, percentage: 80, detectedDevice: "inductionCooker", warningCount: 5 },
  { id: "8", number: "Room 108", status: "normal", currentUsage: 2.0, percentage: 38, warningCount: 1 },
];

const activeAlerts = 3;

export function DashboardScreen({ onRoomClick, onAlertClick }: DashboardScreenProps) {
  const { t } = useApp();
  const totalUsage = rooms.reduce((sum, room) => sum + room.currentUsage, 0);
  const averageUsage = totalUsage / rooms.length;

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
          <Badge variant="secondary" className="bg-secondary/50 text-primary border-secondary">
            {rooms.length} {t('rooms')}
          </Badge>
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
    </div>
  );
}