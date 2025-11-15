import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, Shield, Users, UserCheck } from "lucide-react";
import { useApp } from "../lib/AppContext";

interface RoleSplashScreenProps {
  role: 'admin' | 'hr' | 'warden';
  onComplete: () => void;
}

export function RoleSplashScreen({ role, onComplete }: RoleSplashScreenProps) {
  const { t } = useApp();
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  console.log('🎭 RoleSplashScreen rendering with role:', role);

  useEffect(() => {
    // Show content immediately
    setShowContent(true);
    
    // Start exit animation after 3 seconds
    const exitTimer = setTimeout(() => {
      console.log('🚪 Starting role splash exit animation for role:', role);
      setIsExiting(true);
    }, 3000);

    // Complete after exit animation finishes
    const completeTimer = setTimeout(() => {
      console.log('✅ Role splash completed for role:', role);
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const roleConfig = {
    admin: {
      icon: Shield,
      title: t('adminDashboard'),
      subtitle: t('systemAdministrator'),
      gradient: "from-[#08796B] via-[#065D52] to-[#054943]",
      iconColor: "text-[#B2DFB8]",
      iconBg: "bg-white/20",
    },
    hr: {
      icon: Users,
      title: t('hrDashboard'),
      subtitle: t('humanResources'),
      gradient: "from-[#08796B] via-[#0A8975] to-[#065D52]",
      iconColor: "text-[#B2DFB8]",
      iconBg: "bg-white/20",
    },
    warden: {
      icon: UserCheck,
      title: t('wardenDashboard'),
      subtitle: t('hostelWarden'),
      gradient: "from-[#0A8975] via-[#08796B] to-[#065D52]",
      iconColor: "text-[#B2DFB8]",
      iconBg: "bg-white/20",
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <motion.div
      className={`fixed inset-0 bg-gradient-to-br ${config.gradient} flex items-center justify-center z-50`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Debug indicator */}
      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
        <span className="text-white text-sm font-medium">
          Role Splash: {role.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col items-center px-6">
        {/* Logo and role icon container */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, y: 50 }}
          animate={{ 
            scale: isExiting ? 1.2 : 1,
            opacity: isExiting ? 0 : 1,
            y: isExiting ? -20 : 0
          }}
          transition={{
            scale: {
              duration: 0.7,
              ease: [0.34, 1.56, 0.64, 1]
            },
            opacity: {
              duration: isExiting ? 0.4 : 0.6,
              ease: "easeInOut"
            },
            y: {
              duration: 0.6,
              ease: "easeOut"
            }
          }}
          className="relative mb-8"
        >
          {/* Main logo container */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl relative z-10">
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: 0.2,
                duration: 0.5
              }}
            >
              <Building2 className="h-32 w-32 text-[#08796B]" />
            </motion.div>
          </div>

          {/* Role icon badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: isExiting ? 0 : 1,
              rotate: isExiting ? 180 : 0
            }}
            transition={{
              delay: 0.4,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className={`absolute -bottom-4 -right-4 ${config.iconBg} backdrop-blur-sm rounded-2xl p-4 shadow-lg border-4 border-white/30 z-20`}
          >
            <Icon className={`w-10 h-10 ${config.iconColor}`} />
          </motion.div>
        </motion.div>

        {/* Welcome text with slide and fade */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ 
            y: isExiting ? -20 : 0,
            opacity: isExiting ? 0 : 1
          }}
          transition={{ 
            delay: 0.5,
            duration: 0.6,
            ease: "easeOut"
          }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ letterSpacing: "0.1em", opacity: 0 }}
            animate={{ 
              letterSpacing: "0em",
              opacity: 1
            }}
            transition={{ 
              delay: 0.6,
              duration: 0.5
            }}
          >
            <h2 className="text-white/70 text-sm uppercase tracking-wider mb-2">
              {t('welcomeTo')}
            </h2>
            <h1 className="text-white text-3xl mb-2">
              {config.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <div className="h-px w-8 bg-white/40"></div>
              <p className="text-sm">{config.subtitle}</p>
              <div className="h-px w-8 bg-white/40"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: isExiting ? 0 : 1, width: isExiting ? "0%" : "100%" }}
          transition={{ 
            opacity: { delay: 0.8, duration: 0.4 },
            width: { delay: 0.8, duration: 1.2, ease: "easeInOut" }
          }}
          className="mt-6 h-1 bg-white/30 rounded-full overflow-hidden"
          style={{ width: "200px" }}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ 
              delay: 0.8,
              duration: 1.2,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : [0, 1, 1, 0.7, 1] }}
          transition={{ 
            delay: 1,
            duration: 2,
            ease: "easeInOut",
            repeat: isExiting ? 0 : Infinity,
            repeatDelay: 0.5
          }}
          className="text-white/60 text-sm mt-4"
        >
          {t('loadingDashboard')}
        </motion.p>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isExiting ? 0 : 1,
          opacity: isExiting ? 0 : 1
        }}
        transition={{ 
          delay: 0.3,
          duration: 0.8,
          ease: "easeOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-16 w-32 h-32 rounded-full bg-white/5 backdrop-blur-sm"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isExiting ? 0 : 1,
          opacity: isExiting ? 0 : 1
        }}
        transition={{ 
          delay: 0.4,
          duration: 0.8,
          ease: "easeOut"
        }}
      />

      <motion.div
        className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isExiting ? 0 : 1,
          opacity: isExiting ? 0 : 1
        }}
        transition={{ 
          delay: 0.5,
          duration: 0.8,
          ease: "easeOut"
        }}
      />

      {/* Bottom wave pattern */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: isExiting ? 0 : 0.15,
          y: isExiting ? 100 : 0
        }}
        transition={{ 
          delay: 0.6,
          duration: 0.8,
          ease: "easeOut"
        }}
      >
        <svg className="w-full h-40" viewBox="0 0 400 100" preserveAspectRatio="none">
          <motion.path
            d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z"
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: 0.8,
              duration: 1,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
