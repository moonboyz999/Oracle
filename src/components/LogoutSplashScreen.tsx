import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, LogOut, Shield, Users, UserCheck } from "lucide-react";
import { useApp } from "../lib/AppContext";

interface LogoutSplashScreenProps {
  userRole?: 'admin' | 'hr' | 'warden' | null;
  userEmail?: string;
  onComplete: () => void;
}

export function LogoutSplashScreen({ userRole, userEmail, onComplete }: LogoutSplashScreenProps) {
  const { t } = useApp();
  const [isExiting, setIsExiting] = useState(false);

  console.log('👋 LogoutSplashScreen rendering for:', userEmail, 'role:', userRole);

  useEffect(() => {
    // Start exit animation after 2 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // Complete after exit animation finishes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const roleConfig = {
    admin: {
      icon: Shield,
      title: t('adminDashboard'),
      gradient: "from-[#08796B] via-[#065D52] to-[#054943]",
      iconColor: "text-[#B2DFB8]",
    },
    hr: {
      icon: Users,
      title: t('hrDashboard'),
      gradient: "from-[#08796B] via-[#0A8975] to-[#065D52]",
      iconColor: "text-[#B2DFB8]",
    },
    warden: {
      icon: UserCheck,
      title: t('wardenDashboard'),
      gradient: "from-[#08796B] via-[#0A8975] to-[#0C9B87]",
      iconColor: "text-[#B2DFB8]",
    },
  };

  const config = userRole ? roleConfig[userRole] : {
    icon: LogOut,
    title: t('dashboard'),
    gradient: "from-[#08796B] via-[#065D52] to-[#054943]",
    iconColor: "text-[#B2DFB8]",
  };

  const RoleIcon = config.icon;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${config.gradient}`}
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 0.95 : 1 
      }}
      transition={{ 
        duration: isExiting ? 1 : 0.5,
        ease: "easeInOut"
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/20 blur-xl" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white/15 blur-lg" />
        <div className="absolute bottom-32 left-16 w-28 h-28 rounded-full bg-white/20 blur-xl" />
        <div className="absolute bottom-20 right-12 w-20 h-20 rounded-full bg-white/15 blur-lg" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 1, rotate: 0 }}
          animate={{ 
            scale: isExiting ? 0.8 : 1,
            rotate: isExiting ? -5 : 0 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl" />
            <div className="relative w-24 h-24 rounded-3xl bg-white/10 p-4 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Role Icon and Logout Message */}
        <motion.div
          className="text-center mb-6"
          initial={{ y: 0, opacity: 1 }}
          animate={{ 
            y: isExiting ? -10 : 0,
            opacity: isExiting ? 0.7 : 1 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-4">
              <motion.div
                className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30"
                initial={{ scale: 1, rotate: 0 }}
                animate={{ 
                  scale: isExiting ? 1.1 : 1,
                  rotate: isExiting ? 360 : 0 
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <RoleIcon className={`w-8 h-8 ${config.iconColor}`} />
              </motion.div>
            </div>
            
            <motion.h2
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 1 }}
              animate={{ opacity: isExiting ? 0.8 : 1 }}
              transition={{ duration: 0.6 }}
            >
              {t('logout')}...
            </motion.h2>
            
            <motion.p
              className="text-white/80 text-lg"
              initial={{ opacity: 1 }}
              animate={{ opacity: isExiting ? 0.6 : 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {userEmail ? `See you soon, ${userEmail.split('@')[0]}` : 'See you soon'}
            </motion.p>
          </div>
        </motion.div>

        {/* Logout Animation */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 1, y: 0 }}
          animate={{ 
            opacity: isExiting ? 0.5 : 1,
            y: isExiting ? 10 : 0 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotate: isExiting ? 180 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <LogOut className="w-5 h-5 text-white/70" />
          </motion.div>
          <span className="text-white/70 text-sm">
            {isExiting ? 'Redirecting to login...' : 'Securing session...'}
          </span>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isExiting ? 0 : 1,
            y: isExiting ? 30 : 0 
          }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-white/60 text-sm">
            Thank you for using Smart Hostel
          </p>
        </motion.div>
      </div>

      {/* Animated Dots */}
      <motion.div
        className="absolute bottom-20 flex gap-2"
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: isExiting ? 0 : Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}