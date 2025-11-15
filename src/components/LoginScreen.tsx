import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useApp, UserRole } from "../lib/AppContext";
import { Language } from "../lib/translations";
import { Building2 } from "lucide-react";

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onRegister: () => void;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const { t, language, setLanguage } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const determineUserRole = (email: string): UserRole => {
    const emailLower = email.toLowerCase();
    let role: UserRole;
    
    if (emailLower.includes('@admin')) {
      role = 'admin';
    } else if (emailLower.includes('@hr')) {
      role = 'hr';
    } else if (emailLower.includes('@warden')) {
      role = 'warden';
    } else {
      // Default role if no specific domain matches
      role = 'warden';
    }
    
    console.log('🎯 Role determined for email:', email, '→', role);
    return role;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log('🚀 Starting login process for:', email);

    try {
      // Sign in with Firebase
      console.log('🔐 Attempting Firebase authentication...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase authentication successful for:', user.email);
      
      // Determine role based on email
      const role = determineUserRole(email);
      console.log('🎯 Role determined:', role);
      
      // Save/update user role in Firestore
      console.log('💾 Saving user role to Firestore:', { email: user.email, role });
      
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: role,
          lastLogin: new Date(),
          createdAt: new Date()
        }, { merge: true });
        
        console.log('✅ User role saved successfully to Firestore');
        console.log('📄 Document path: users/' + user.uid);
        
      } catch (firestoreError) {
        console.error('❌ Firestore save failed:', firestoreError);
        console.log('🔄 Role will be determined from email fallback');
      }

      // Firebase auth state change will automatically update the context
      console.log('📞 Calling onLogin with role:', role);
      onLogin(role);
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08796B] to-[#065D52] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-white rounded-3xl mb-6 shadow-lg p-6">
            <Building2 className="h-32 w-32 text-[#08796B]" />
          </div>
          <h1 className="text-white text-3xl mb-2">{t('appName')}</h1>
          <h2 className="text-white text-xl mb-3">{t('appSubtitle')}</h2>
          <p className="text-white/80">{t('tagline')}</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/95 border-white/30 h-12 rounded-xl"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/90">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/95 border-white/30 h-12 rounded-xl"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-[#08796B] hover:bg-white/90 h-12 text-base font-semibold shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : t('signIn')}
          </Button>
        </form>

        {/* Language Selection */}
        <div className="mt-8">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-6 py-2.5 rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-white text-[#08796B] shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ms')}
              className={`px-6 py-2.5 rounded-lg transition-all ${
                language === 'ms'
                  ? 'bg-white text-[#08796B] shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              BM
            </button>
            <button
              type="button"
              onClick={() => setLanguage('zh')}
              className={`px-6 py-2.5 rounded-lg transition-all ${
                language === 'zh'
                  ? 'bg-white text-[#08796B] shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              中文
            </button>
          </div>
        </div>

        {/* Decorative wave pattern */}
        <div className="mt-8 text-center">
          <svg className="w-full h-24 opacity-20" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path
              d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
