import { ArrowLeft, User, Bell, Lock, Moon, Sun, LogOut, ChevronRight, Globe, BarChart3, FileBarChart } from "lucide-react";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { useApp } from "../lib/AppContext";
import { Language } from "../lib/translations";

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onAdminDashboard?: () => void;
  onHRDashboard?: () => void;
}

export function SettingsScreen({ onBack, onLogout, onEditProfile, onChangePassword, onAdminDashboard, onHRDashboard }: SettingsScreenProps) {
  const { isDarkMode, toggleDarkMode, language, setLanguage, t } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-8 pb-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl">{t('settings')}</h1>
            <p className="text-primary-foreground/80 text-sm">{t('managePreferences')}</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="bg-card/95 p-5 border-0">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 bg-secondary/50">
              <AvatarFallback className="bg-secondary/50 text-primary text-xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-card-foreground">John Doe</h3>
              <p className="text-sm text-muted-foreground">{t('admin')}</p>
              <p className="text-sm text-muted-foreground">john.doe@hostel.edu</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Account Settings */}
        <div>
          <h3 className="mb-3 text-foreground">{t('accountSettings')}</h3>
          <Card className="bg-card divide-y divide-border">
            <button 
              onClick={onEditProfile}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/30 rounded-xl">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span>{t('editProfile')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button 
              onClick={onChangePassword}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/30 rounded-xl">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <span>{t('changePassword')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="mb-3 text-foreground">{t('notifications')}</h3>
          <Card className="bg-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/30 rounded-xl">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p>{t('pushNotifications')}</p>
                  <p className="text-sm text-muted-foreground">{t('receiveAlerts')}</p>
                </div>
              </div>
              <Switch 
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p>{t('emailAlerts')}</p>
                <p className="text-sm text-muted-foreground">{t('getAlertsEmail')}</p>
              </div>
              <Switch 
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p>{t('criticalAlertsOnly')}</p>
                <p className="text-sm text-muted-foreground">{t('onlyHighPriority')}</p>
              </div>
              <Switch 
                checked={criticalOnly}
                onCheckedChange={setCriticalOnly}
              />
            </div>
          </Card>
        </div>

        {/* Management Dashboards */}
        {(onAdminDashboard || onHRDashboard) && (
          <div>
            <h3 className="mb-3 text-foreground">Management Dashboards</h3>
            <Card className="bg-card divide-y divide-border">
              {onAdminDashboard && (
                <button 
                  onClick={onAdminDashboard}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/30 rounded-xl">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <span>{t('adminDashboard')}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
              
              {onHRDashboard && (
                <button 
                  onClick={onHRDashboard}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/30 rounded-xl">
                      <FileBarChart className="w-5 h-5 text-primary" />
                    </div>
                    <span>{t('hrDashboard')}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </Card>
          </div>
        )}

        {/* Appearance & Language */}
        <div>
          <h3 className="mb-3 text-foreground">{t('appearance')}</h3>
          <Card className="bg-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/30 rounded-xl">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <p>{t('darkMode')}</p>
                  <p className="text-sm text-muted-foreground">{t('switchToDarkTheme')}</p>
                </div>
              </div>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-secondary/30 rounded-xl">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p>{t('language')}</p>
                  <p className="text-sm text-muted-foreground">{t('selectLanguage')}</p>
                </div>
              </div>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="bg-card border-border">
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

        {/* About */}
        <div>
          <h3 className="mb-3 text-foreground">{t('about')}</h3>
          <Card className="bg-card divide-y divide-border">
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span>{t('termsConditions')}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span>{t('privacyPolicy')}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span>{t('helpSupport')}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="p-4">
              <p className="text-sm text-muted-foreground">{t('version')}</p>
            </div>
          </Card>
        </div>

        {/* Logout Button */}
        <Button 
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
}
