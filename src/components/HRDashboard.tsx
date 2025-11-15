import { useState } from "react";
import { useApp } from "../lib/AppContext";
import { Language } from "../lib/translations";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  Settings,
  Zap,
  AlertCircle,
  Home,
  TrendingDown,
  Download,
  Share2,
  FileOutput,
  Calendar,
  Building2,
  Mail,
  Bell,
  Moon,
  Globe,
  LogOut,
  Shield,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  Search,
  Eye,
  Trash2,
  BarChart3
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface HRDashboardProps {
  onBack: () => void;
  onLogout?: () => void;
}

type TabType = 'dashboard' | 'reports' | 'analytics' | 'logs' | 'settings';

interface ReportLog {
  id: string;
  timestamp: string;
  generatedBy: string;
  reportType: string;
  dateRange: string;
  status: 'success' | 'pending';
  downloadUrl?: string;
}

interface RoomUsageData {
  room: string;
  period: string;
  usage: number;
  alerts: number;
  status: 'normal' | 'warning' | 'critical';
}

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  dateRange: string;
  generatedDate: string;
  data: RoomUsageData[];
  totalUsage: number;
  totalAlerts: number;
}

export function HRDashboard({ onBack, onLogout }: HRDashboardProps) {
  const { t, isDarkMode, userEmail, toggleDarkMode, language, setLanguage } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Report filters
  const [reportType, setReportType] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [startDate, setStartDate] = useState('2024-10-01');
  const [endDate, setEndDate] = useState('2024-10-31');
  const [showReport, setShowReport] = useState(false);
  const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);

  // Logs filtering
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState('all');
  
  // Saved reports
  const [savedReports, setSavedReports] = useState<GeneratedReport[]>([]);
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState('');

  // Profile and password modals
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profileName, setProfileName] = useState('HR User');
  const [profileEmail, setProfileEmail] = useState(userEmail || 'hr@hr.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Stats data
  const stats = {
    totalEnergy: 5420,
    totalAlerts: 27,
    highestUsageRoom: 'Room 315',
    roomsUnderAlert: 5,
    averageUsage: 542,
    costEstimate: 2710,
  };

  // Daily usage trend data
  const dailyUsageData = [
    { day: 'Mon', usage: 850 },
    { day: 'Tue', usage: 920 },
    { day: 'Wed', usage: 780 },
    { day: 'Thu', usage: 950 },
    { day: 'Fri', usage: 890 },
    { day: 'Sat', usage: 650 },
    { day: 'Sun', usage: 580 },
  ];

  // Monthly consumption data
  const monthlyConsumptionData = [
    { month: 'Jan', consumption: 4200 },
    { month: 'Feb', consumption: 4500 },
    { month: 'Mar', consumption: 4100 },
    { month: 'Apr', consumption: 4800 },
    { month: 'May', consumption: 5200 },
    { month: 'Jun', consumption: 5420 },
  ];

  // Hourly consumption pattern
  const hourlyPatternData = [
    { hour: '0-6h', usage: 120 },
    { hour: '6-12h', usage: 480 },
    { hour: '12-18h', usage: 890 },
    { hour: '18-24h', usage: 620 },
  ];

  // Block comparison data
  const blockComparisonData = [
    { block: 'Block A', usage: 1280, alerts: 8 },
    { block: 'Block B', usage: 1450, alerts: 12 },
    { block: 'Block C', usage: 980, alerts: 5 },
    { block: 'Block D', usage: 1710, alerts: 15 },
  ];

  // Top 5 high usage rooms
  const topRoomsData = [
    { room: 'Room 315', usage: 285, block: 'Block C' },
    { room: 'Room 202', usage: 265, block: 'Block B' },
    { room: 'Room 418', usage: 242, block: 'Block D' },
    { room: 'Room 105', usage: 228, block: 'Block A' },
    { room: 'Room 307', usage: 215, block: 'Block C' },
  ];

  // Room status distribution for pie chart
  const statusDistributionData = [
    { name: 'Normal', value: 75, color: '#10B981' },
    { name: 'Warning', value: 18, color: '#F59E0B' },
    { name: 'Critical', value: 7, color: '#EF4444' },
  ];

  // Report generation logs
  const [reportLogs, setReportLogs] = useState<ReportLog[]>([
    { id: '1', timestamp: '10:10 AM - Oct 28', generatedBy: 'HR Chen', reportType: 'Monthly Report (All Rooms)', dateRange: 'Oct 1-31', status: 'success' },
    { id: '2', timestamp: '2:30 PM - Oct 27', generatedBy: 'HR Sarah', reportType: 'Block B Report', dateRange: 'Oct 20-27', status: 'success' },
    { id: '3', timestamp: '11:45 AM - Oct 26', generatedBy: 'HR Chen', reportType: 'Room 315 Report', dateRange: 'Oct 1-26', status: 'success' },
    { id: '4', timestamp: '4:15 PM - Oct 25', generatedBy: 'HR01', reportType: 'Weekly Summary', dateRange: 'Oct 18-25', status: 'success' },
    { id: '5', timestamp: '9:30 AM - Oct 24', generatedBy: 'HR Sarah', reportType: 'Block A Report', dateRange: 'Oct 1-24', status: 'pending' },
  ]);

  // Sample report data generator
  const generateReportData = (): RoomUsageData[] => {
    const baseData: RoomUsageData[] = [
      { room: 'Room 315', period: 'Oct 2024', usage: 285, alerts: 5, status: 'critical' },
      { room: 'Room 202', period: 'Oct 2024', usage: 265, alerts: 3, status: 'warning' },
      { room: 'Room 418', period: 'Oct 2024', usage: 242, alerts: 2, status: 'warning' },
      { room: 'Room 105', period: 'Oct 2024', usage: 228, alerts: 1, status: 'normal' },
      { room: 'Room 307', period: 'Oct 2024', usage: 215, alerts: 0, status: 'normal' },
      { room: 'Room 401', period: 'Oct 2024', usage: 198, alerts: 0, status: 'normal' },
      { room: 'Room 112', period: 'Oct 2024', usage: 187, alerts: 1, status: 'normal' },
      { room: 'Room 503', period: 'Oct 2024', usage: 175, alerts: 0, status: 'normal' },
    ];

    // Filter based on report type
    if (reportType === 'room' && selectedRoom) {
      return baseData.filter(d => d.room === selectedRoom);
    } else if (reportType === 'block' && selectedBlock) {
      // Filter rooms by block (simplified logic)
      const blockRooms = {
        'A': ['Room 105', 'Room 112'],
        'B': ['Room 202'],
        'C': ['Room 315', 'Room 307'],
        'D': ['Room 418', 'Room 401', 'Room 503'],
      };
      const rooms = blockRooms[selectedBlock as keyof typeof blockRooms] || [];
      return baseData.filter(d => rooms.includes(d.room));
    }
    
    return baseData;
  };

  // ========== PROFILE AND PASSWORD FUNCTIONS ==========

  const handleEditProfile = () => {
    if (!profileName || !profileEmail) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Update profile (in a real app, this would update the backend)
    toast.success('Profile updated successfully');
    setShowEditProfileModal(false);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Change password (in a real app, this would update the backend)
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePasswordModal(false);
  };

  // ========== REPORT FUNCTIONS ==========

  const handleGenerateReport = () => {
    if (reportType === 'room' && !selectedRoom) {
      toast.error('Please select a room');
      return;
    }
    if (reportType === 'block' && !selectedBlock) {
      toast.error('Please select a block');
      return;
    }

    const reportData = generateReportData();
    const totalUsage = reportData.reduce((sum, d) => sum + d.usage, 0);
    const totalAlerts = reportData.reduce((sum, d) => sum + d.alerts, 0);

    const report: GeneratedReport = {
      id: (savedReports.length + 1).toString(),
      title: reportType === 'all' ? 'All Rooms Report' : 
             reportType === 'room' ? `Room ${selectedRoom} Report` : 
             `Block ${selectedBlock} Report`,
      type: reportType,
      dateRange: `${startDate} to ${endDate}`,
      generatedDate: new Date().toLocaleString(),
      data: reportData,
      totalUsage,
      totalAlerts,
    };

    setCurrentReport(report);
    setSavedReports([report, ...savedReports]);
    setShowReport(true);
    
    // Add to logs
    const newLog: ReportLog = {
      id: (reportLogs.length + 1).toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' - Oct 29',
      generatedBy: userEmail || 'HR User',
      reportType: report.title,
      dateRange: report.dateRange,
      status: 'success',
    };
    setReportLogs([newLog, ...reportLogs]);
    
    toast.success('Report generated successfully');
  };

  const handleViewReport = (report: GeneratedReport) => {
    setCurrentReport(report);
    setShowReport(true);
    setActiveTab('reports');
    toast.success('Report loaded');
  };

  const confirmDeleteReport = (reportId: string) => {
    setDeleteTargetId(reportId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteReport = () => {
    const report = savedReports.find(r => r.id === deleteTargetId);
    setSavedReports(savedReports.filter(r => r.id !== deleteTargetId));
    
    if (report) {
      toast.success('Report deleted');
    }
    
    setShowDeleteConfirm(false);
    setDeleteTargetId('');
  };

  const handleExportPDF = () => {
    if (!currentReport) {
      toast.error('Please generate a report first');
      return;
    }
    
    // Simulate PDF export
    const pdfContent = `
Report: ${currentReport.title}
Date Range: ${currentReport.dateRange}
Generated: ${currentReport.generatedDate}
Total Usage: ${currentReport.totalUsage} kWh
Total Alerts: ${currentReport.totalAlerts}

Room Details:
${currentReport.data.map(d => `${d.room}: ${d.usage} kWh, ${d.alerts} alerts, Status: ${d.status}`).join('\n')}
    `;
    
    // Create download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported as PDF');
  };

  const handleExportCSV = () => {
    if (!currentReport) {
      toast.error('Please generate a report first');
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Room,Period,Usage (kWh),Alerts,Status\n"
      + currentReport.data.map(d => 
          `${d.room},${d.period},${d.usage},${d.alerts},${d.status}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report exported as CSV');
  };

  const handleShareReport = () => {
    if (!currentReport) {
      toast.error('Please generate a report first');
      return;
    }
    
    // Simulate sharing link
    const shareLink = `https://hostel-power-monitor.app/reports/${currentReport.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success('Report sharing link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleEmailReport = () => {
    if (!currentReport) {
      toast.error('Please generate a report first');
      return;
    }
    
    toast.success(`Report will be sent to ${userEmail || 'your email'}`);
  };

  // ========== FILTERED DATA ==========

  const filteredLogs = reportLogs.filter(log => {
    const matchesSearch = log.reportType.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                         log.generatedBy.toLowerCase().includes(logSearchQuery.toLowerCase());
    const matchesStatus = logStatusFilter === 'all' || log.status === logStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // ========== DASHBOARD TAB ==========
  
  const DashboardContent = () => (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">{t('hrDashboardOverview')}</h1>
        {userEmail && (
          <p className="text-white/70 text-sm">
            {t('loggedInAs')}: {userEmail}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#08796B]/10 dark:bg-[#08796B]/20 rounded-xl">
                <Zap className="w-5 h-5 text-[#08796B] dark:text-[#B2DFB8]" />
              </div>
            </div>
            <p className="text-2xl text-[#263238] dark:text-white mb-1">{stats.totalEnergy}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('totalEnergyUsed')} ({t('kwhUnit')})</p>
          </Card>

          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 dark:bg-red-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-2xl text-[#263238] dark:text-white mb-1">{stats.totalAlerts}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('totalAlertsThisMonth')}</p>
          </Card>

          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-lg text-[#263238] dark:text-white mb-1">{stats.highestUsageRoom}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Highest Usage Room</p>
          </Card>

          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-2xl text-[#263238] dark:text-white mb-1">{stats.roomsUnderAlert}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Rooms Under Alert</p>
          </Card>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <h3 className="text-[#263238] dark:text-white mb-4">Power Usage Trend (This Week)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dailyUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#E0E0E0'} />
              <XAxis dataKey="day" stroke={isDarkMode ? '#999' : '#666'} />
              <YAxis stroke={isDarkMode ? '#999' : '#666'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#2A2A2A' : '#fff',
                  border: `1px solid ${isDarkMode ? '#444' : '#E0E0E0'}`,
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="usage" stroke="#08796B" strokeWidth={2} dot={{ fill: '#08796B', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <h3 className="text-[#263238] dark:text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setActiveTab('reports')}
            className="h-auto py-4 flex flex-col items-center gap-2 bg-[#08796B] hover:bg-[#065D52] text-white"
          >
            <FileText className="w-6 h-6" />
            <span className="text-sm">{t('generateQuickReport')}</span>
          </Button>
          <Button
            onClick={() => setActiveTab('analytics')}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-[#E0E0E0] dark:border-gray-700"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm">View {t('analytics')}</span>
          </Button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#263238] dark:text-white">Recent Reports</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setActiveTab('logs')}
            className="text-[#08796B] dark:text-[#B2DFB8]"
          >
            View All
          </Button>
        </div>
        <div className="space-y-2">
          {savedReports.slice(0, 3).map((report) => (
            <Card key={report.id} className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm text-[#263238] dark:text-white mb-1">{report.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{report.generatedDate}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {report.totalUsage} kWh • {report.totalAlerts} alerts
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewReport(report)}
                  className="text-[#08796B] dark:text-[#B2DFB8]"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
          {savedReports.length === 0 && (
            <Card className="p-8 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">No reports generated yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // ========== REPORTS TAB ==========
  
  const ReportsContent = () => (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">{t('reportsOverview')}</h1>
        <p className="text-white/70 text-sm">Generate and manage electricity reports</p>
      </div>

      {/* Report Filters */}
      <div className="px-6 space-y-4">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 space-y-4">
          {/* Report Type */}
          <div className="space-y-2">
            <Label className="text-[#263238] dark:text-white">{t('reportType')}</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                <SelectItem value="block">By Block</SelectItem>
                <SelectItem value="room">Specific Room</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room Selection */}
          {reportType === 'room' && (
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">{t('selectRoom')}</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Room 315">Room 315</SelectItem>
                  <SelectItem value="Room 202">Room 202</SelectItem>
                  <SelectItem value="Room 418">Room 418</SelectItem>
                  <SelectItem value="Room 105">Room 105</SelectItem>
                  <SelectItem value="Room 307">Room 307</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Block Selection */}
          {reportType === 'block' && (
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">{t('selectBlock')}</Label>
              <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                <SelectTrigger className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700">
                  <SelectValue placeholder="Select a block" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Block A</SelectItem>
                  <SelectItem value="B">Block B</SelectItem>
                  <SelectItem value="C">Block C</SelectItem>
                  <SelectItem value="D">Block D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">{t('startDate')}</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">{t('endDate')}</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700"
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Button 
          onClick={handleGenerateReport}
          className="w-full bg-[#08796B] hover:bg-[#065D52] text-white h-12"
        >
          <FileText className="w-5 h-5 mr-2" />
          {t('generateReport')}
        </Button>
      </div>

      {/* Report Preview */}
      {showReport && currentReport && (
        <div className="px-6 space-y-4">
          {/* Report Header */}
          <Card className="p-5 bg-gradient-to-br from-[#08796B] to-[#065D52] text-white">
            <h3 className="text-xl mb-2">{currentReport.title}</h3>
            <p className="text-white/80 text-sm mb-3">{currentReport.dateRange}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/70 text-xs mb-1">Total Usage</p>
                <p className="text-2xl">{currentReport.totalUsage} kWh</p>
              </div>
              <div>
                <p className="text-white/70 text-xs mb-1">Total Alerts</p>
                <p className="text-2xl">{currentReport.totalAlerts}</p>
              </div>
            </div>
          </Card>

          {/* Export Options */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleExportPDF}
              variant="outline"
              className="border-[#08796B] text-[#08796B] dark:border-[#B2DFB8] dark:text-[#B2DFB8]"
            >
              <FileOutput className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
            <Button 
              onClick={handleExportCSV}
              variant="outline"
              className="border-[#08796B] text-[#08796B] dark:border-[#B2DFB8] dark:text-[#B2DFB8]"
            >
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
            <Button 
              onClick={handleShareReport}
              variant="outline"
              className="border-[#E0E0E0] dark:border-gray-700"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button 
              onClick={handleEmailReport}
              variant="outline"
              className="border-[#E0E0E0] dark:border-gray-700"
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
          </div>

          {/* Chart */}
          <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <h4 className="text-[#263238] dark:text-white mb-3">Usage Breakdown</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={currentReport.data}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#E0E0E0'} />
                <XAxis dataKey="room" stroke={isDarkMode ? '#999' : '#666'} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke={isDarkMode ? '#999' : '#666'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#2A2A2A' : '#fff',
                    border: `1px solid ${isDarkMode ? '#444' : '#E0E0E0'}`,
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="usage" fill="#08796B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Data Table */}
          <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 overflow-hidden">
            <h4 className="text-[#263238] dark:text-white mb-3">Detailed Data</h4>
            <div className="overflow-x-auto -mx-5 px-5">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableHead className="text-[#263238] dark:text-white">Room</TableHead>
                    <TableHead className="text-[#263238] dark:text-white">Usage (kWh)</TableHead>
                    <TableHead className="text-[#263238] dark:text-white">Alerts</TableHead>
                    <TableHead className="text-[#263238] dark:text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReport.data.map((row, index) => (
                    <TableRow key={index} className="border-gray-200 dark:border-gray-700">
                      <TableCell className="text-[#263238] dark:text-white">{row.room}</TableCell>
                      <TableCell className="text-[#263238] dark:text-white">{row.usage}</TableCell>
                      <TableCell className="text-[#263238] dark:text-white">{row.alerts}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-lg text-xs ${
                          row.status === 'critical' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : row.status === 'warning'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* Saved Reports */}
      {!showReport && savedReports.length > 0 && (
        <div className="px-6">
          <h3 className="text-[#263238] dark:text-white mb-3">Saved Reports</h3>
          <div className="space-y-2">
            {savedReports.map((report) => (
              <Card key={report.id} className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm text-[#263238] dark:text-white mb-1">{report.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{report.generatedDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewReport(report)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirmDeleteReport(report.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <span>{report.totalUsage} kWh</span>
                  <span>•</span>
                  <span>{report.totalAlerts} alerts</span>
                  <span>•</span>
                  <span>{report.dateRange}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ========== ANALYTICS TAB ==========
  
  const AnalyticsContent = () => (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">{t('analytics')}</h1>
        <p className="text-white/70 text-sm">Analyze power consumption patterns</p>
      </div>

      {/* Monthly Trend */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <h3 className="text-[#263238] dark:text-white mb-4">Monthly Consumption Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyConsumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#E0E0E0'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#999' : '#666'} />
              <YAxis stroke={isDarkMode ? '#999' : '#666'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#2A2A2A' : '#fff',
                  border: `1px solid ${isDarkMode ? '#444' : '#E0E0E0'}`,
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="consumption" stroke="#08796B" strokeWidth={3} dot={{ fill: '#08796B', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Hourly Pattern */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <h3 className="text-[#263238] dark:text-white mb-4">Daily Usage Pattern</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hourlyPatternData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#E0E0E0'} />
              <XAxis dataKey="hour" stroke={isDarkMode ? '#999' : '#666'} />
              <YAxis stroke={isDarkMode ? '#999' : '#666'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#2A2A2A' : '#fff',
                  border: `1px solid ${isDarkMode ? '#444' : '#E0E0E0'}`,
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="usage" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Block Comparison */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <h3 className="text-[#263238] dark:text-white mb-4">Block Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={blockComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#E0E0E0'} />
              <XAxis dataKey="block" stroke={isDarkMode ? '#999' : '#666'} />
              <YAxis stroke={isDarkMode ? '#999' : '#666'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#2A2A2A' : '#fff',
                  border: `1px solid ${isDarkMode ? '#444' : '#E0E0E0'}`,
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="usage" fill="#08796B" radius={[8, 8, 0, 0]} />
              <Bar dataKey="alerts" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#08796B] rounded"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Usage (kWh)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#EF4444] rounded"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Alerts</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Distribution */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <h3 className="text-[#263238] dark:text-white mb-4">Room Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Usage Rooms */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <h3 className="text-[#263238] dark:text-white mb-4">Top 5 High Usage Rooms</h3>
          <div className="space-y-3">
            {topRoomsData.map((room, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                  index === 1 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#263238] dark:text-white">{room.room}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{room.block}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#263238] dark:text-white">{room.usage} kWh</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  // ========== LOGS TAB ==========
  
  const LogsContent = () => (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">Report Generation Logs</h1>
        <p className="text-white/70 text-sm">Track all report generation activities</p>
      </div>

      {/* Filters */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              className="pl-9 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 h-10 text-sm"
            />
          </div>
          <Select value={logStatusFilter} onValueChange={setLogStatusFilter}>
            <SelectTrigger className="bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Logs List */}
      <div className="px-6 space-y-2">
        {filteredLogs.length === 0 ? (
          <Card className="p-8 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">No logs found</p>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${
                  log.status === 'success'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {log.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#263238] dark:text-white mb-1">{log.reportType}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>{log.timestamp}</span>
                    <span>•</span>
                    <span>{log.generatedBy}</span>
                    <span>•</span>
                    <span>{log.dateRange}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${
                  log.status === 'success'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {log.status}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  // ========== SETTINGS TAB ==========
  
  const SettingsContent = () => (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">{t('settings')}</h1>
        <p className="text-white/70 text-sm">Manage your profile and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#08796B]/10 dark:bg-[#08796B]/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#08796B] dark:text-[#B2DFB8]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-[#263238] dark:text-white">HR User</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{userEmail || 'hr@hr.com'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Human Resources</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => setShowEditProfileModal(true)}
              variant="outline" 
              className="w-full justify-start border-[#E0E0E0] dark:border-gray-700"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {t('editProfile')}
            </Button>
            <Button 
              onClick={() => setShowChangePasswordModal(true)}
              variant="outline" 
              className="w-full justify-start border-[#E0E0E0] dark:border-gray-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              {t('changePassword')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Notification Preferences */}
      <div className="px-6">
        <h3 className="text-[#263238] dark:text-white mb-3">{t('notificationPreferences')}</h3>
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-[#263238] dark:text-white">{t('emailNotifications')}</p>
                <p className="text-xs text-gray-500">Receive report updates via email</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="h-px bg-gray-200 dark:bg-gray-700" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-[#263238] dark:text-white">{t('pushNotifications')}</p>
                <p className="text-xs text-gray-500">Receive push notifications</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>
      </div>

      {/* Appearance */}
      <div className="px-6">
        <h3 className="text-[#263238] dark:text-white mb-3">{t('appearance')}</h3>
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-[#263238] dark:text-white">{t('darkMode')}</p>
                <p className="text-xs text-gray-500">Toggle dark mode theme</p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <div>
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-[#263238] dark:text-white">{t('language')}</p>
                <p className="text-xs text-gray-500">{t('selectLanguage')}</p>
              </div>
            </div>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700">
                <SelectValue placeholder={t('selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="ms">{t('malay')}</SelectItem>
                <SelectItem value="zh">{t('chinese')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Report Settings */}
      <div className="px-6">
        <h3 className="text-[#263238] dark:text-white mb-3">Report Settings</h3>
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-[#263238] dark:text-white">Auto-save reports</p>
                <p className="text-xs text-gray-500">Automatically save generated reports</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="h-px bg-gray-200 dark:bg-gray-700" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-[#263238] dark:text-white">Auto-export to PDF</p>
                <p className="text-xs text-gray-500">Export reports to PDF by default</p>
              </div>
            </div>
            <Switch />
          </div>
        </Card>
      </div>

      {/* Logout */}
      <div className="px-6">
        <Button 
          onClick={onLogout || onBack}
          variant="outline" 
          className="w-full justify-center border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t('logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'}`}>
      {/* Content based on active tab */}
      {activeTab === 'dashboard' && <DashboardContent />}
      {activeTab === 'reports' && <ReportsContent />}
      {activeTab === 'analytics' && <AnalyticsContent />}
      {activeTab === 'logs' && <LogsContent />}
      {activeTab === 'settings' && <SettingsContent />}

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
        <DialogContent className="bg-white dark:bg-[#2A2A2A] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#263238] dark:text-white">
              {t('editProfile')}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">{t('name')}</Label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">{t('email')}</Label>
              <Input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditProfileModal(false)}
              className="border-[#E0E0E0] dark:border-gray-700"
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleEditProfile}
              className="bg-[#08796B] hover:bg-[#065D52] text-white"
            >
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showChangePasswordModal} onOpenChange={setShowChangePasswordModal}>
        <DialogContent className="bg-white dark:bg-[#2A2A2A] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#263238] dark:text-white">
              {t('changePassword')}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Update your account password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#263238] dark:text-white">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-white dark:bg-[#1A1A1A] border-[#E0E0E0] dark:border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowChangePasswordModal(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="border-[#E0E0E0] dark:border-gray-700"
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleChangePassword}
              className="bg-[#08796B] hover:bg-[#065D52] text-white"
            >
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Report Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-white dark:bg-[#2A2A2A]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#263238] dark:text-white">
              Delete Report?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the saved report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#E0E0E0] dark:border-gray-700">
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReport}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2A2A2A] border-t border-[#E0E0E0] dark:border-gray-700 px-2 py-2 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">{t('dashboard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'reports'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">{t('reports')}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">{t('analytics')}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'logs'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">{t('settings')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
