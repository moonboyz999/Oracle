import { useEffect, useState } from "react";
import { motion } from "motion/react";
import logo from "figma:asset/319df5b2d19a5da3f80d1835660cd5b1915402d0.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Complete after exit animation finishes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3300);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-[#08796B] to-[#065D52] flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center">
        {/* Logo container with pulse and scale animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: isExiting ? 1.1 : 1,
            opacity: isExiting ? 0 : 1
          }}
          transition={{
            scale: {
              duration: 0.6,
              ease: "easeOut"
            },
            opacity: {
              duration: isExiting ? 0.5 : 0.6,
              ease: "easeInOut"
            }
          }}
          className="bg-white rounded-3xl p-8 shadow-2xl mb-6"
        >
          <motion.img
            src={logo}
            alt="Oracle Logo"
            className="h-40 w-auto object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              delay: 0.3,
              duration: 0.5
            }}
          />
        </motion.div>

        {/* App name with fade and slide up animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: isExiting ? -10 : 0,
            opacity: isExiting ? 0 : 1
          }}
          transition={{ 
            delay: 0.6,
            duration: 0.6,
            ease: "easeOut"
          }}
          className="text-center"
        >
          <h1 className="text-white text-3xl mb-2">Smart Hostel</h1>
          <p className="text-white/80">Power Monitoring System</p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ 
            delay: 1,
            duration: 0.5
          }}
          className="mt-8"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative wave pattern at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: isExiting ? 0 : 0.2,
          y: isExiting ? 50 : 0
        }}
        transition={{ 
          delay: 0.8,
          duration: 0.6
        }}
      >
        <svg className="w-full h-32" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path
            d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z"
            fill="white"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
