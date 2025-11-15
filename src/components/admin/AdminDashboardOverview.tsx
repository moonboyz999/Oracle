import React from 'react';
import { Card } from '../ui/card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { 
  AlertCircle, 
  Users, 
  Shield, 
  Activity, 
  Building, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';

interface AdminStats {
  totalWardens: number;
  totalHR: number;
  totalAlerts: number;
  activeDevices: number;
  totalHostels: number;
  offlineDevices: number;
}

interface MonthlyAlertsData {
  month: string;
  alerts: number;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  status: 'success' | 'warning' | 'error';
}

interface AdminDashboardOverviewProps {
  stats: AdminStats;
  monthlyAlertsData: MonthlyAlertsData[];
  activityLogs: ActivityLog[];
  userEmail?: string;
}

export function AdminDashboardOverview({ 
  stats, 
  monthlyAlertsData, 
  activityLogs, 
  userEmail 
}: AdminDashboardOverviewProps) {
  const { t, isDarkMode } = useApp();

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">{t('adminDashboardOverview')}</h1>
        {userEmail && (
          <p className="text-white/70 text-sm">
            {t('loggedInAs')}: {userEmail}
          </p>
        )}
      </div>

      {/* System Notification Banner */}
      <div className="px-6">
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-orange-900 dark:text-orange-200">
              <span className="font-semibold">{stats.offlineDevices} {t('devicesOffline')}</span> - Block C sensors require attention
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#08796B]/10 dark:bg-[#08796B]/20 rounded-xl">
                <Users className="w-5 h-5 text-[#08796B] dark:text-[#B2DFB8]" />
              </div>
            </div>
            <p className="text-2xl text-[#263238] dark:text-white mb-1">{stats.totalWardens}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('totalWardens')}</p>
          </Card>

          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-2xl text-[#263238] dark:text-white mb-1">{stats.totalHR}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('totalHRAccounts')}</p>
          </Card>

          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 dark:bg-red-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-2xl text-[#263238] dark:text-white mb-1">{stats.totalAlerts}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('totalAlertsRecorded')}</p>
          </Card>

          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-xl">
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-2xl text-[#263238] dark:text-white mb-1">{stats.activeDevices}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('activeDevices')}</p>
          </Card>

          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl">
                <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-2xl text-[#263238] dark:text-white mb-1">{stats.totalHostels}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('totalHostels')}</p>
          </Card>
        </div>
      </div>

      {/* Monthly Alerts Chart */}
      <div className="px-4 sm:px-6">
        <Card className="p-3 sm:p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <h3 className="text-[#263238] dark:text-white mb-3 sm:mb-4 text-center text-sm sm:text-base">{t('monthlyAlerts')}</h3>
          <div className="px-1 sm:px-2">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart 
                data={monthlyAlertsData} 
                margin={{ 
                  top: 5, 
                  right: 10, 
                  left: 5, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#E0E0E0'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDarkMode ? '#999' : '#666'} 
                  fontSize={11}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  stroke={isDarkMode ? '#999' : '#666'} 
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  width={25}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#2A2A2A' : '#fff',
                    border: `1px solid ${isDarkMode ? '#444' : '#E0E0E0'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="alerts" fill="#08796B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* System Notifications */}
      <div className="px-6">
        <h3 className="text-[#263238] dark:text-white mb-3">{t('systemNotifications')}</h3>
        <div className="space-y-2">
          {activityLogs.slice(0, 3).map((log) => (
            <Card key={log.id} className="p-3 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
              <div className="flex items-center gap-3">
                {log.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#263238] dark:text-white truncate">{log.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{log.timestamp}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}