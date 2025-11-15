import { ArrowLeft, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { useApp } from "../lib/AppContext";

interface AlertsScreenProps {
  onBack: () => void;
  onRoomClick: (roomId: string) => void;
}

interface Alert {
  id: string;
  roomNumber: string;
  issue: string;
  timestamp: string;
  status: "active" | "resolved";
  severity: "high" | "medium";
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    roomNumber: "Room 104",
    issue: "High load detected - Possible unauthorized appliance",
    timestamp: "2025-10-16 20:15",
    status: "active",
    severity: "high"
  },
  {
    id: "2",
    roomNumber: "Room 107",
    issue: "Moderate load increase detected",
    timestamp: "2025-10-16 19:30",
    status: "active",
    severity: "medium"
  },
  {
    id: "3",
    roomNumber: "Room 103",
    issue: "Unusual power spike detected",
    timestamp: "2025-10-16 18:45",
    status: "active",
    severity: "medium"
  },
  {
    id: "4",
    roomNumber: "Room 102",
    issue: "High load detected during restricted hours",
    timestamp: "2025-10-16 15:20",
    status: "resolved",
    severity: "high"
  },
  {
    id: "5",
    roomNumber: "Room 108",
    issue: "Power consumption exceeded threshold",
    timestamp: "2025-10-16 12:10",
    status: "resolved",
    severity: "medium"
  },
];

export function AlertsScreen({ onBack, onRoomClick }: AlertsScreenProps) {
  const { t, isDarkMode } = useApp();
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    return alert.status === filter;
  });

  const activeCount = alerts.filter(a => a.status === "active").length;
  const resolvedCount = alerts.filter(a => a.status === "resolved").length;

  const handleResolve = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: "resolved" as const } : alert
    ));
  };

  // Convert room number to room ID (e.g., "Room 104" -> "4")
  const getRoomIdFromNumber = (roomNumber: string): string => {
    const match = roomNumber.match(/\d+/);
    if (!match) return "1";
    const roomNum = parseInt(match[0]);
    return String(roomNum - 100);
  };

  const handleAlertClick = (alert: Alert) => {
    const roomId = getRoomIdFromNumber(alert.roomNumber);
    onRoomClick(roomId);
  };

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'}`}>
      {/* Header */}
      <div className="bg-[#08796B] text-white px-6 pt-8 pb-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl">{t('alertsNotifications')}</h1>
            <p className="text-white/80 text-sm">{t('monitorSystemAlerts')}</p>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className={`p-4 border-0 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white/95'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E53935]/10 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-[#E53935]" />
              </div>
              <div>
                <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>{activeCount}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>{t('active')}</p>
              </div>
            </div>
          </Card>
          <Card className={`p-4 border-0 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white/95'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#4CAF50]/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-[#4CAF50] fill-[#4CAF50]/30" strokeWidth={2.5} />
              </div>
              <div>
                <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>{resolvedCount}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>{t('resolved')}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Filter */}
        <div className="mb-4">
          <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <SelectTrigger className={`${isDarkMode ? 'bg-[#2A2A2A] border-gray-700 text-white' : 'bg-white border-[#E0E0E0]'}`}>
              <SelectValue placeholder="Filter alerts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allAlerts')}</SelectItem>
              <SelectItem value="active">{t('activeOnly')}</SelectItem>
              <SelectItem value="resolved">{t('resolvedOnly')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              onClick={() => handleAlertClick(alert)}
              className={`p-5 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
                isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
              } ${
                alert.status === "active" 
                  ? alert.severity === "high" 
                    ? "border-[#E53935]/30" 
                    : "border-[#FD0835]/30"
                  : "border-[#B2DFB8]"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {alert.status === "active" ? (
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    alert.severity === "high" ? "text-[#E53935]" : "text-[#FD0835]"
                  }`} />
                ) : (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#3B8E3C]" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className={isDarkMode ? 'text-white' : 'text-[#263238]'}>{alert.roomNumber}</h4>
                    <Badge 
                      className={`${
                        alert.status === "active"
                          ? alert.severity === "high"
                            ? "bg-[#E53935]/10 text-[#E53935] border-[#E53935]/30"
                            : "bg-[#FD0835]/10 text-[#FD0835] border-[#FD0835]/30"
                          : "bg-[#B2DFB8]/50 text-[#3B8E3C] border-[#B2DFB8]"
                      }`}
                      variant="outline"
                    >
                      {alert.status === "active" ? t('active') : t('resolved')}
                    </Badge>
                  </div>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>{alert.issue}</p>
                  <div className={`flex items-center gap-2 text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                  {alert.status === "active" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolve(alert.id);
                      }}
                      className="border-[#08796B] text-[#08796B] hover:bg-[#B2DFB8]/30"
                    >
                      {t('markAsResolved')}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <Card className={`p-8 text-center ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <CheckCircle className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-[#E0E0E0]'}`} />
            <p className={isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}>{t('noAlertsToDisplay')}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
