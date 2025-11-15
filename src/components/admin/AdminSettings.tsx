import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Settings, 
  User, 
  Lock, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Download,
  Upload,
  Database,
  Wifi,
  Activity
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

interface AdminSettingsProps {
  onEditProfile: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

export function AdminSettings({ onEditProfile, onChangePassword, onLogout }: AdminSettingsProps) {
  const { t, isDarkMode, toggleDarkMode, language, setLanguage } = useApp();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState('12');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'en' | 'ms' | 'zh');
    toast.success(`Language changed to ${newLanguage === 'en' ? 'English' : newLanguage === 'ms' ? 'Bahasa Malaysia' : 'Chinese'}`);
  };

  const handleExportData = () => {
    toast.info('Exporting system data...');
    // TODO: Implement data export
  };

  const handleImportData = () => {
    toast.info('Import data functionality');
    // TODO: Implement data import
  };

  const handleBackupData = () => {
    toast.success('System backup initiated');
    // TODO: Implement backup functionality
  };

  const handleRestoreData = () => {
    toast.info('Restore data functionality');
    // TODO: Implement restore functionality
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">{t('settings')}</h1>
        <p className="text-white/70 text-sm">System preferences and configuration</p>
      </div>

      {/* Profile Section */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#08796B]/10 dark:bg-[#08796B]/20 rounded-xl">
              <User className="w-5 h-5 text-[#08796B] dark:text-[#B2DFB8]" />
            </div>
            <h3 className="text-lg text-[#263238] dark:text-white">{t('profileSettings')}</h3>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={onEditProfile}
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
            >
              <User className="w-4 h-4 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium">{t('editProfile')}</p>
                <p className="text-xs text-gray-500">Update your personal information</p>
              </div>
            </Button>

            <Button
              onClick={onChangePassword}
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
            >
              <Lock className="w-4 h-4 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium">{t('changePassword')}</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
            </Button>
          </div>
        </Card>
      </div>

      {/* Appearance Section */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <h3 className="text-lg text-[#263238] dark:text-white">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{t('darkMode')}</Label>
                <p className="text-xs text-gray-500">Toggle dark/light theme</p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('language')}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications Section */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl">
              <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg text-[#263238] dark:text-white">Notifications</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">System Notifications</Label>
              <p className="text-xs text-gray-500">Receive alerts and system updates</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </Card>
      </div>

      {/* System Configuration */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl">
              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg text-[#263238] dark:text-white">System Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Maintenance Mode</Label>
                <p className="text-xs text-gray-500">Enable system maintenance mode</p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Backup</Label>
                <p className="text-xs text-gray-500">Automatically backup system data</p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Retention Period (months)</Label>
              <Select value={dataRetentionPeriod} onValueChange={setDataRetentionPeriod}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Max Login Attempts</Label>
              <Select value={maxLoginAttempts} onValueChange={setMaxLoginAttempts}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                  <SelectItem value="10">10 attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-xl">
              <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg text-[#263238] dark:text-white">Data Management</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>

            <Button
              onClick={handleImportData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Data
            </Button>

            <Button
              onClick={handleBackupData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Backup
            </Button>

            <Button
              onClick={handleRestoreData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Restore
            </Button>
          </div>
        </Card>
      </div>

      {/* System Status */}
      <div className="px-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-xl">
              <Wifi className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg text-[#263238] dark:text-white">System Status</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Server Status</span>
              <span className="text-sm text-green-600 dark:text-green-400">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Backup</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">System Version</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">v1.2.3</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Logout Section */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <Button
            onClick={onLogout}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <User className="w-4 h-4 mr-2" />
            {t('logout')}
          </Button>
        </Card>
      </div>
    </div>
  );
}