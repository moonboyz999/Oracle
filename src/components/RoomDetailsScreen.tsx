import { ArrowLeft, Calendar, AlertTriangle, CheckCircle, Power, Wrench, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { useApp } from "../lib/AppContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

interface RoomDetailsScreenProps {
  roomId: string;
  onBack: () => void;
}

// Appliance detection data
const detectedAppliance = {
  device: "riceCooker",
  estimatedPower: "1.2 kW",
  detectedAt: "20:15",
  confidence: "High"
};

// Outlet status data
const outlets = [
  { id: 1, number: "Outlet 1", status: "working" as const },
  { id: 2, number: "Outlet 2", status: "working" as const },
  { id: 3, number: "Outlet 3", status: "faulty" as const },
  { id: 4, number: "Outlet 4", status: "working" as const },
];

// Warning history data
const warningHistory = [
  {
    id: "w1",
    date: "2025-10-31 20:15",
    type: "unauthorizedAppliance",
    details: "Rice cooker detected - 1.2 kW consumption",
    severity: "high" as const,
  },
  {
    id: "w2",
    date: "2025-10-30 18:30",
    type: "excessiveUsage",
    details: "Power usage exceeded 5 kWh threshold",
    severity: "medium" as const,
  },
  {
    id: "w3",
    date: "2025-10-29 14:20",
    type: "powerSpike",
    details: "Sudden power spike detected - 2.5 kW",
    severity: "medium" as const,
  },
  {
    id: "w4",
    date: "2025-10-27 21:45",
    type: "unauthorizedAppliance",
    details: "Electric kettle detected - 0.8 kW consumption",
    severity: "high" as const,
  },
  {
    id: "w5",
    date: "2025-10-25 19:10",
    type: "repeatedViolation",
    details: "Multiple unauthorized device usage violations",
    severity: "high" as const,
  },
  {
    id: "w6",
    date: "2025-10-24 16:35",
    type: "excessiveUsage",
    details: "Extended high power consumption period",
    severity: "low" as const,
  },
  {
    id: "w7",
    date: "2025-10-22 22:00",
    type: "powerSpike",
    details: "Power surge detected - potential overload",
    severity: "medium" as const,
  },
];

const usageData = [
  { time: "00:00", usage: 1.2 },
  { time: "04:00", usage: 0.8 },
  { time: "08:00", usage: 2.1 },
  { time: "12:00", usage: 3.2 },
  { time: "16:00", usage: 4.5 },
  { time: "20:00", usage: 6.8 },
  { time: "23:59", usage: 5.2 },
];

const recentEvents = [
  { id: "1", timestamp: "2025-10-16 20:15", event: "High load detected", status: "alert", usage: 6.8 },
  { id: "2", timestamp: "2025-10-16 18:30", event: "Normal usage resumed", status: "normal", usage: 3.2 },
  { id: "3", timestamp: "2025-10-16 15:45", event: "Moderate load detected", status: "warning", usage: 4.5 },
  { id: "4", timestamp: "2025-10-16 12:00", event: "Standard operation", status: "normal", usage: 2.8 },
  { id: "5", timestamp: "2025-10-16 08:30", event: "Low usage period", status: "normal", usage: 1.5 },
];

export function RoomDetailsScreen({ roomId, onBack }: RoomDetailsScreenProps) {
  const { t, isDarkMode } = useApp();
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmitMaintenance = () => {
    toast.success(t('maintenanceReported'));
    setIsMaintenanceDialogOpen(false);
    setIssueType("");
    setPriority("");
    setDescription("");
  };

  const getOutletStatusText = (status: string) => {
    switch (status) {
      case "working":
        return t('outletWorking');
      case "faulty":
        return t('outletFaulty');
      case "maintenance":
        return t('underMaintenance');
      default:
        return status;
    }
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
            <h1 className="text-2xl">Room 104</h1>
            <p className="text-white/80 text-sm">Real-time monitoring</p>
          </div>
        </div>

        {/* Current Status */}
        <Card className="bg-white/95 p-4 border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#78909C] text-sm mb-1">Current Usage</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl text-[#263238]">6.8</h2>
                <span className="text-[#78909C]">kWh</span>
              </div>
            </div>
            <Badge className="bg-[#E53935] text-white border-0">
              Alert
            </Badge>
          </div>
        </Card>

        {/* Power Control */}
        <Card className={`p-4 border-0 shadow-lg mt-4 ${
          isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white/95'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${
                isPowerOn 
                  ? 'bg-[#08796B]/10' 
                  : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Power className={`w-6 h-6 ${
                  isPowerOn ? 'text-[#08796B]' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <h3 className={isDarkMode ? 'text-white' : 'text-[#263238]'}>
                  {t('powerControl')}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                  {t('roomPowerStatus')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${
                isPowerOn 
                  ? 'text-[#08796B]' 
                  : isDarkMode ? 'text-gray-400' : 'text-[#78909C]'
              }`}>
                {isPowerOn ? t('powerOn') : t('powerOff')}
              </span>
              <Switch 
                checked={isPowerOn}
                onCheckedChange={setIsPowerOn}
                className="data-[state=checked]:bg-[#08796B]"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Usage Graph */}
        <Card className={`p-5 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={isDarkMode ? 'text-white' : 'text-[#263238]'}>{t('dailyUsagePattern')}</h3>
            <button className="flex items-center gap-2 text-sm text-[#08796B]">
              <Calendar className="w-4 h-4" />
              {t('today')}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                stroke="#78909C"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#78909C"
                label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="usage" 
                stroke="#08796B" 
                strokeWidth={3}
                dot={{ fill: '#08796B', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Alert Info */}
        <Card className="p-5 bg-[#E53935]/10 border-[#E53935]/30">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#E53935] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className={isDarkMode ? 'text-white mb-1' : 'text-[#263238] mb-1'}>{t('unauthorizedUsage')}</h4>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                {t('highLoadDetected')}
              </p>
              <Button 
                variant="destructive" 
                size="sm"
                className="bg-[#E53935] hover:bg-[#D32F2F]"
              >
                {t('resetRoomAlert')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Detected Appliance Card */}
        <Card className={`p-5 border-2 border-[#E53935]/40 ${
          isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={isDarkMode ? 'text-white' : 'text-[#263238]'}>{t('detectedAppliance')}</h3>
            <Badge className="bg-[#E53935] text-white border-0">
              {t('unauthorizedDevice')}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {/* Device Type */}
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
            }`}>
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                Device Type
              </p>
              <p className={`${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                {t(detectedAppliance.device as any)}
              </p>
            </div>

            {/* Grid for Power and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
              }`}>
                <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                  {t('estimatedPower')}
                </p>
                <p className={`${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                  {detectedAppliance.estimatedPower}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
              }`}>
                <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                  Detected At
                </p>
                <p className={`${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                  {detectedAppliance.detectedAt}
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="flex items-start gap-2 p-3 bg-[#FFF3E0] rounded-lg">
              <AlertTriangle className="w-4 h-4 text-[#F57C00] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#E65100]">
                {t('deviceNotAllowed')}
              </p>
            </div>
          </div>
        </Card>

        {/* Outlet Status & Maintenance Card */}
        <Card className={`p-5 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={isDarkMode ? 'text-white' : 'text-[#263238]'}>{t('outletStatus')}</h3>
            <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#08796B] hover:bg-[#066B5E]">
                  <Wrench className="w-4 h-4 mr-2" />
                  {t('reportMaintenance')}
                </Button>
              </DialogTrigger>
              <DialogContent className={`sm:max-w-[425px] ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-white'}`}>
                <DialogHeader>
                  <DialogTitle className={isDarkMode ? 'text-white' : ''}>{t('reportMaintenance')}</DialogTitle>
                  <DialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
                    {t('reportIssue')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueType" className={isDarkMode ? 'text-white' : ''}>{t('issueType')}</Label>
                    <Select value={issueType} onValueChange={setIssueType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('issueType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brokenOutlet">{t('brokenOutlet')}</SelectItem>
                        <SelectItem value="electricalIssue">{t('electricalIssue')}</SelectItem>
                        <SelectItem value="wiringProblem">{t('wiringProblem')}</SelectItem>
                        <SelectItem value="circuitBreakerTrip">{t('circuitBreakerTrip')}</SelectItem>
                        <SelectItem value="overheating">{t('overheating')}</SelectItem>
                        <SelectItem value="otherIssue">{t('otherIssue')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className={isDarkMode ? 'text-white' : ''}>{t('priority')}</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('priority')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t('low')}</SelectItem>
                        <SelectItem value="medium">{t('medium')}</SelectItem>
                        <SelectItem value="high">{t('high')}</SelectItem>
                        <SelectItem value="urgent">{t('urgent')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className={isDarkMode ? 'text-white' : ''}>{t('issueDescription')}</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t('describeIssue')}
                      className="h-24 resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button
                    className="bg-[#08796B] hover:bg-[#066B5E]"
                    onClick={handleSubmitMaintenance}
                  >
                    {t('submitReport')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {/* Outlet Status Summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-[#3B8E3C]" />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                    {t('outletWorking')}
                  </p>
                </div>
                <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                  {outlets.filter(o => o.status === 'working').length}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-[#E53935]" />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                    {t('outletFaulty')}
                  </p>
                </div>
                <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                  {outlets.filter(o => o.status === 'faulty').length}
                </p>
              </div>
            </div>

            {/* Individual Outlets */}
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    outlet.status === 'working' 
                      ? 'bg-[#3B8E3C]/10' 
                      : 'bg-[#E53935]/10'
                  }`}>
                    <Zap className={`w-5 h-5 ${
                      outlet.status === 'working' ? 'text-[#3B8E3C]' : 'text-[#E53935]'
                    }`} />
                  </div>
                  <div>
                    <p className={isDarkMode ? 'text-white' : 'text-[#263238]'}>
                      {outlet.number}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                      {t('lastChecked')}: 2 hours ago
                    </p>
                  </div>
                </div>
                <Badge className={`${
                  outlet.status === 'working'
                    ? 'bg-[#3B8E3C]'
                    : 'bg-[#E53935]'
                } text-white border-0`}>
                  {getOutletStatusText(outlet.status)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Warning History Card */}
        <Card className={`p-5 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={isDarkMode ? 'text-white' : 'text-[#263238]'}>{t('warningHistory')}</h3>
            <Badge className="bg-[#FD0835] text-white border-0">
              {warningHistory.length} {t('totalWarnings')}
            </Badge>
          </div>

          {/* Warning Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className={`p-3 rounded-xl text-center ${
              isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
            }`}>
              <p className={`text-2xl mb-1 ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                {warningHistory.length}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                {t('totalWarnings')}
              </p>
            </div>

            <div className={`p-3 rounded-xl text-center ${
              isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
            }`}>
              <p className={`text-2xl mb-1 ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                {warningHistory.filter(w => {
                  const warningDate = new Date(w.date);
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return warningDate >= monthAgo;
                }).length}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                {t('thisMonth')}
              </p>
            </div>

            <div className={`p-3 rounded-xl text-center ${
              isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]'
            }`}>
              <p className={`text-2xl mb-1 ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                {warningHistory.filter(w => {
                  const warningDate = new Date(w.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return warningDate >= weekAgo;
                }).length}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                {t('thisWeek')}
              </p>
            </div>
          </div>

          {/* Warning List */}
          <div className="space-y-3">
            {warningHistory.slice(0, 5).map((warning) => {
              const getSeverityColor = (severity: string) => {
                switch (severity) {
                  case 'high':
                    return 'bg-[#E53935]';
                  case 'medium':
                    return 'bg-[#FD0835]';
                  case 'low':
                    return 'bg-[#FDD835]';
                  default:
                    return 'bg-gray-400';
                }
              };

              return (
                <div
                  key={warning.id}
                  className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-[#1A1A1A] border-[#3A3A3A]' : 'bg-[#F5F5F5] border-[#E0E0E0]'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getSeverityColor(warning.severity)}/10`}>
                      <AlertTriangle className={`w-4 h-4 ${getSeverityColor(warning.severity).replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className={`${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>
                          {t(warning.type as any)}
                        </p>
                        <Badge 
                          className={`${getSeverityColor(warning.severity)} text-white border-0 text-xs`}
                        >
                          {t(warning.severity as any)}
                        </Badge>
                      </div>
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>
                        {warning.details}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-[#90A4AE]'}`}>
                        {warning.date}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {warningHistory.length > 5 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4 text-[#08796B]"
            >
              {t('viewDetails')} ({warningHistory.length - 5} more)
            </Button>
          )}
        </Card>

        {/* Recent Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={isDarkMode ? 'text-white' : 'text-[#263238]'}>{t('recentActivity')}</h3>
            <Button variant="ghost" size="sm" className="text-[#08796B]">
              {t('viewFullLog')}
            </Button>
          </div>

          <div className="space-y-3">
            {recentEvents.map((event) => (
              <Card key={event.id} className={`p-4 ${
                isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
              } ${
                event.status === 'alert' ? 'border-[#E53935]/30' : 
                event.status === 'warning' ? 'border-[#FD0835]/30' : 
                'border-[#B2DFB8]'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    {event.status === 'alert' ? (
                      <AlertTriangle className="w-4 h-4 text-[#E53935] mt-0.5 flex-shrink-0" />
                    ) : event.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-[#FD0835] mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-[#3B8E3C] mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm mb-1 ${
                        isDarkMode ? 'text-white' : 'text-[#263238]'
                      }`}>
                        {event.event}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#78909C]'}`}>{event.timestamp}</p>
                    </div>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#263238]'}`}>{event.usage} kWh</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}