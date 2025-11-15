import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Activity, 
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Building,
  FileText
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  status: 'success' | 'warning' | 'error';
}

interface MaintenanceLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  status: 'completed' | 'pending' | 'in-progress';
  room?: string;
  block?: string;
  issueType?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  reportType?: 'warden' | 'system' | 'technician';
}

type LogTabType = 'activity' | 'maintenance';

interface AdminLogsViewerProps {
  activityLogs: ActivityLog[];
  maintenanceLogs: MaintenanceLog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
}

export function AdminLogsViewer({
  activityLogs,
  maintenanceLogs,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter
}: AdminLogsViewerProps) {
  const { t, isDarkMode } = useApp();
  const [logTab, setLogTab] = useState<LogTabType>('activity');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'warning':
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'in-progress':
        return <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getReportTypeIcon = (reportType?: string) => {
    switch (reportType) {
      case 'warden':
        return <User className="w-3 h-3" />;
      case 'system':
        return <Activity className="w-3 h-3" />;
      case 'technician':
        return <Wrench className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const filteredActivityLogs = activityLogs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaintenanceLogs = maintenanceLogs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.room && log.room.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (log.block && log.block.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportLogs = () => {
    const logs = logTab === 'activity' ? filteredActivityLogs : filteredMaintenanceLogs;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Action,Performed By,Status\n"
      + logs.map(log => `${log.timestamp},${log.action},${log.performedBy},${log.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${logTab}_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">System Logs</h1>
        <p className="text-white/70 text-sm">View system activity and maintenance logs</p>
      </div>

      {/* Tab Navigation */}
      <div className="px-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setLogTab('activity')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm transition-all ${
              logTab === 'activity'
                ? 'bg-white dark:bg-[#2A2A2A] text-[#08796B] shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Activity Logs ({activityLogs.length})
          </button>
          <button
            onClick={() => setLogTab('maintenance')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm transition-all ${
              logTab === 'maintenance'
                ? 'bg-white dark:bg-[#2A2A2A] text-[#08796B] shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Wrench className="w-4 h-4 inline mr-2" />
            Maintenance Logs ({maintenanceLogs.length})
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 rounded-xl h-12"
            />
          </div>
          <Button
            variant="outline"
            className="px-4 h-12"
            onClick={exportLogs}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 w-44 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 rounded-xl h-12"
            />
          </div>
          <Button variant="outline" className="h-12 px-4">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Logs Content */}
      <div className="px-6">
        {logTab === 'activity' ? (
          <div className="space-y-3">
            {filteredActivityLogs.length === 0 ? (
              <Card className="p-8 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No activity logs found</p>
              </Card>
            ) : (
              filteredActivityLogs.map((log) => (
                <Card key={log.id} className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(log.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#263238] dark:text-white">{log.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-500">{log.timestamp}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">by {log.performedBy}</span>
                      </div>
                    </div>
                    <Badge
                      className={`text-xs ${
                        log.status === 'success' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : log.status === 'warning'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {log.status}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMaintenanceLogs.length === 0 ? (
              <Card className="p-8 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 text-center">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No maintenance logs found</p>
              </Card>
            ) : (
              filteredMaintenanceLogs.map((log) => (
                <Card key={log.id} className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(log.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#263238] dark:text-white mb-1">{log.action}</p>
                      {log.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{log.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500">{log.timestamp}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">by {log.performedBy}</span>
                        {log.room && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <Building className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{log.room}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {log.priority && (
                        <Badge className={`text-xs ${getPriorityColor(log.priority)}`}>
                          {log.priority}
                        </Badge>
                      )}
                      <Badge
                        className={`text-xs ${
                          log.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : log.status === 'pending'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        {log.status}
                      </Badge>
                      {log.reportType && (
                        <div className="flex items-center gap-1">
                          {getReportTypeIcon(log.reportType)}
                          <span className="text-xs text-gray-500 capitalize">{log.reportType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}