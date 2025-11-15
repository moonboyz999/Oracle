import { useState, useEffect } from "react";
import { AppProvider, useApp, UserRole } from "./lib/AppContext";
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { SplashScreen } from "./components/SplashScreen";
import { RoleSplashScreen } from "./components/RoleSplashScreen";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { RoomDetailsScreen } from "./components/RoomDetailsScreen";
import { AlertsScreen } from "./components/AlertsScreen";
import { ReportsScreen } from "./components/ReportsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { EditProfileScreen } from "./components/EditProfileScreen";
import { ChangePasswordScreen } from "./components/ChangePasswordScreen";
import { AdminDashboard } from "./components/AdminDashboard";
import { HRDashboard } from "./components/HRDashboard";
import { LogoutSplashScreen } from "./components/LogoutSplashScreen";
import { BottomNav } from "./components/BottomNav";
import { Toaster } from "./components/ui/sonner";

type Screen = "dashboard" | "alerts" | "reports" | "settings" | "roomDetails" | "editProfile" | "changePassword" | "adminDashboard" | "hrDashboard";
type AuthScreen = "login" | "register";

function AppContent() {
  const { user, userRole, isLoading, isRoleLoading } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [showRoleSplash, setShowRoleSplash] = useState(false);
  const [showLogoutSplash, setShowLogoutSplash] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [activeScreen, setActiveScreen] = useState<Screen>("settings");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [hasShownRoleSplash, setHasShownRoleSplash] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialScreenSet, setInitialScreenSet] = useState(false);
  const [pendingRoleSplash, setPendingRoleSplash] = useState(false);
  
  // Store user info for logout splash
  const [logoutUserInfo, setLogoutUserInfo] = useState<{
    email: string;
    role: 'admin' | 'hr' | 'warden';
  } | null>(null);

  // Mark app as ready when splash is done AND Firebase auth is loaded
  useEffect(() => {
    if (!showSplash && !isLoading) {
      // Add a small delay to ensure login screen is ready
      setTimeout(() => {
        setIsAppReady(true);
      }, 100);
    }
  }, [showSplash, isLoading]);

  // Reset role splash when user changes (ensures splash shows for each login)
  useEffect(() => {
    if (user && userRole) {
      console.log('🔄 User session detected, ensuring role splash can show');
      // Only reset if this is a fresh login (not a page refresh)
      if (hasShownRoleSplash) {
        setHasShownRoleSplash(false);
      }
    }
  }, [user?.uid]); // Only when user ID changes (new login)

  // Show role splash when user logs in and has a role
  useEffect(() => {
    console.log('🔍 App state check:', { 
      user: user ? `${user.email} (${user.uid.substring(0,8)}...)` : 'No user',
      userRole, 
      showSplash, 
      hasShownRoleSplash, 
      showRoleSplash,
      isAppReady,
      isLoading 
    });
    
    // Special debug for admin role
    if (user && userRole === 'admin') {
      console.log('� ADMIN ROLE DEBUG:', {
        userEmail: user.email,
        userRole,
        showSplash,
        isLoading,
        hasShownRoleSplash,
        showRoleSplash,
        shouldShowRoleSplash: !showSplash && !isLoading && !hasShownRoleSplash
      });
    }
    
    // Show role splash for all authenticated users (no default dashboard)
    if (user && userRole && !showSplash && !isLoading && !hasShownRoleSplash) {
      console.log('🚀 Triggering role splash for user with role:', userRole);
      if (!showRoleSplash && !pendingRoleSplash) {
        setShowRoleSplash(true);
        setPendingRoleSplash(true);
      }
      return; // Exit early to prevent additional logic
    } 
    
    // Route to correct dashboard if user is logged in and role splash was already shown
    // Only auto-route if user is on an invalid screen for their role
    if (user && userRole && !showSplash && !isLoading && hasShownRoleSplash && !showRoleSplash) {
      const validScreensForRole = {
        admin: ['adminDashboard', 'settings', 'editProfile', 'changePassword'],
        hr: ['hrDashboard', 'settings', 'editProfile', 'changePassword'],
        warden: ['dashboard', 'alerts', 'reports', 'settings', 'editProfile', 'changePassword', 'roomDetails']
      };
      
      const validScreens = validScreensForRole[userRole] || [];
      
      // Only redirect if user is on an invalid screen
      if (!validScreens.includes(activeScreen)) {
        const defaultScreen = userRole === 'admin' ? 'adminDashboard' : 
                             userRole === 'hr' ? 'hrDashboard' : 
                             userRole === 'warden' ? 'dashboard' : 'settings';
        
        console.log(`🔄 Auto-routing from invalid screen ${activeScreen} to ${defaultScreen} for ${userRole}`);
        setActiveScreen(defaultScreen);
      }
    }
    
    // For users without roles, redirect them to login (they shouldn't be here)
    if (user && !userRole && !showSplash && !isLoading) {
      console.log('⚠️ User authenticated but no role detected, logging out');
      // Handle logout or redirect to role assignment
    }
    
    // Reset role splash flag when user logs out
    if (!user) {
      console.log('🚪 User logged out, resetting splash flags');
      setHasShownRoleSplash(false);
      setShowRoleSplash(false);
      setInitialScreenSet(false);
      setPendingRoleSplash(false);
    }
  }, [user, userRole, showSplash, isLoading, hasShownRoleSplash, activeScreen, initialScreenSet, pendingRoleSplash]);

  // If Firebase finishes loading while splash is showing, complete the splash
  useEffect(() => {
    if (showSplash && !isLoading) {
      // Firebase is ready, but splash timer might still be running
      // Let's wait a bit to ensure smooth transition
      setTimeout(() => {
        setShowSplash(false);
      }, 500); // Extra delay to ensure login screen is ready
    }
  }, [showSplash, isLoading]);

  const handleSplashComplete = () => {
    // Only complete splash if Firebase auth is also ready
    if (!isLoading) {
      setShowSplash(false);
    }
    // If Firebase is still loading, splash will stay visible
  };

  const handleLogin = (role: UserRole) => {
    // Firebase handles the actual login, this just triggers role splash
    setAuthScreen("login");
  };

  const handleRoleSplashComplete = () => {
    console.log('🎯 Role splash completed for role:', userRole);
    setShowRoleSplash(false);
    setHasShownRoleSplash(true);
    setPendingRoleSplash(false);
    
    // Route to appropriate dashboard based on role
    if (userRole === 'admin') {
      console.log('🔄 Routing admin to AdminDashboard');
      setActiveScreen('adminDashboard');
    } else if (userRole === 'hr') {
      console.log('🔄 Routing HR to HRDashboard');
      setActiveScreen('hrDashboard');
    } else if (userRole === 'warden') {
      console.log('🔄 Routing warden to Dashboard');
      setActiveScreen('dashboard');
    } else {
      console.log('⚠️ Unknown role, defaulting to settings');
      setActiveScreen('settings');
    }
  };

  const handleRegister = () => {
    setAuthScreen("login");
  };

  const handleLogout = async () => {
    console.log('🚪 Logout initiated by user');
    console.log('📊 Current user:', user?.email);
    console.log('📊 Current role:', userRole);
    console.log('📊 Current screen:', activeScreen);
    
    // Store user info for logout splash before clearing auth
    if (user && userRole) {
      setLogoutUserInfo({
        email: user.email || '',
        role: userRole
      });
    }
    
    // Show logout splash screen
    setShowLogoutSplash(true);
    console.log('✅ Logout splash screen shown');
  };

  const handleLogoutComplete = async () => {
    console.log('🔄 Logout splash complete, signing out...');
    console.log('📊 Current Firebase user before signOut:', auth.currentUser?.email);
    
    try {
      await signOut(auth);
      console.log('✅ Firebase signOut successful');
      
      // Clear all state
      setShowRoleSplash(false);
      setHasShownRoleSplash(false);
      setShowLogoutSplash(false);
      setLogoutUserInfo(null);
      setAuthScreen("login");
      setActiveScreen("dashboard");
      
      console.log('✅ Logout complete - all state cleared');
      console.log('📊 Redirected to login screen');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Type-safe error logging
      if (error instanceof Error) {
        console.error('❌ Error details:', {
          message: error.message,
          name: error.name
        });
      }
      
      // Even if logout fails, reset the UI state
      setShowLogoutSplash(false);
      setLogoutUserInfo(null);
      setAuthScreen("login");
      setActiveScreen("dashboard");
      
      console.log('⚠️ Forced logout due to error - UI reset to login');
    }
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    setActiveScreen("roomDetails");
  };

  const handleBackToDashboard = () => {
    // Return to appropriate dashboard based on user role
    if (userRole === 'admin') {
      setActiveScreen('adminDashboard');
    } else if (userRole === 'hr') {
      setActiveScreen('hrDashboard');
    } else {
      setActiveScreen('dashboard');
    }
    setSelectedRoomId(null);
  };

  const handleBackToSettings = () => {
    setActiveScreen("settings");
  };

  if (showSplash || isLoading || (user && isRoleLoading)) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show logout splash screen
  if (showLogoutSplash && logoutUserInfo) {
    return (
      <LogoutSplashScreen 
        userRole={logoutUserInfo.role}
        userEmail={logoutUserInfo.email}
        onComplete={handleLogoutComplete}
      />
    );
  }

  // Show role-specific splash screen after login
  if (showRoleSplash && userRole) {
    console.log('✅ Rendering role splash for role:', userRole);
    return <RoleSplashScreen role={userRole} onComplete={handleRoleSplashComplete} />;
  }

  // Handle authenticated users without roles - they need to be assigned a role
  if (user && !userRole && !isLoading && !isRoleLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Role Assignment Required</h2>
          <p className="text-gray-600 mb-4">Your account needs to be assigned a role by an administrator.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authScreen === "register") {
      return (
        <RegisterScreen 
          onRegister={handleRegister}
          onBackToLogin={() => setAuthScreen("login")}
        />
      );
    }
    
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onRegister={() => setAuthScreen("register")}
      />
    );
  }

  // Block all main content until role splash is complete
  if (user && userRole && !hasShownRoleSplash) {
    console.log('🔒 Blocking main app content - waiting for role splash to complete');
    return (
      <div className="size-full bg-background flex items-center justify-center">
        <div className="w-full max-w-[480px] h-full bg-card relative shadow-xl">
          {/* Empty - waiting for role splash */}
        </div>
      </div>
    );
  }

  return (
    <div className="size-full bg-background flex items-center justify-center">
      <div className="w-full max-w-[480px] h-full bg-card relative shadow-xl">
        {/* Screen Content */}
        <div className="w-full h-full overflow-y-auto">
          {activeScreen === "dashboard" && (
            <DashboardScreen 
              onRoomClick={handleRoomClick}
              onAlertClick={() => setActiveScreen("alerts")}
            />
          )}
          
          {activeScreen === "roomDetails" && selectedRoomId && (
            <RoomDetailsScreen 
              roomId={selectedRoomId}
              onBack={handleBackToDashboard}
            />
          )}
          
          {activeScreen === "adminDashboard" && (
            <AdminDashboard 
              onBack={() => setActiveScreen("dashboard")} 
              onLogout={handleLogout}
            />
          )}
          
          {activeScreen === "hrDashboard" && (
            <HRDashboard 
              onBack={() => setActiveScreen("dashboard")} 
              onLogout={handleLogout}
            />
          )}
          
          {activeScreen === "alerts" && (
            <AlertsScreen onBack={handleBackToDashboard} onRoomClick={handleRoomClick} />
          )}
          
          {activeScreen === "reports" && (
            <ReportsScreen onBack={handleBackToDashboard} />
          )}
          
          {activeScreen === "settings" && (
            <SettingsScreen 
              onEditProfile={() => setActiveScreen("editProfile")}
              onChangePassword={() => setActiveScreen("changePassword")}
              onLogout={handleLogout}
              onBack={handleBackToDashboard}
              onAdminDashboard={() => setActiveScreen("adminDashboard")}
              onHRDashboard={() => setActiveScreen("hrDashboard")}
            />
          )}
          
          {activeScreen === "editProfile" && (
            <EditProfileScreen onBack={handleBackToSettings} />
          )}
          
          {activeScreen === "changePassword" && (
            <ChangePasswordScreen onBack={handleBackToSettings} />
          )}
        </div>

        {/* Bottom Navigation - only show when logged in and not on specific screens */}
        {/* Don't show BottomNav for AdminDashboard or HRDashboard as they have their own navigation */}
        {user && 
         !["editProfile", "changePassword", "roomDetails", "adminDashboard", "hrDashboard"].includes(activeScreen) && (
          <BottomNav 
            activeScreen={activeScreen as "dashboard" | "alerts" | "reports" | "settings"}
            onNavigate={(screen) => {
              console.log('🧭 BottomNav clicked:', screen, 'Current role:', userRole);
              setActiveScreen(screen);
            }}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}