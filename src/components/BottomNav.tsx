import { Home, Bell, BarChart3, Settings } from "lucide-react";
import { useApp } from "../lib/AppContext";

interface BottomNavProps {
  activeScreen: "dashboard" | "alerts" | "reports" | "settings";
  onNavigate: (screen: "dashboard" | "alerts" | "reports" | "settings") => void;
  alertCount?: number;
}

export function BottomNav({ activeScreen, onNavigate, alertCount = 0 }: BottomNavProps) {
  const { t } = useApp();
  
  const navItems = [
    { id: "dashboard" as const, icon: Home, label: t('roomStatus').replace(' Status', '') },
    { id: "alerts" as const, icon: Bell, label: t('alert') + 's' },
    { id: "reports" as const, icon: BarChart3, label: t('reports') },
    { id: "settings" as const, icon: Settings, label: t('settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 shadow-lg max-w-[480px] mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors relative ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? "fill-primary" : ""}`} />
                {item.id === "alerts" && alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </div>
              <span className={`text-xs ${isActive ? "" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
