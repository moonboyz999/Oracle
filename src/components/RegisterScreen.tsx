import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Building2 } from "lucide-react";
import { useApp } from "../lib/AppContext";

interface RegisterScreenProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export function RegisterScreen({ onRegister, onBackToLogin }: RegisterScreenProps) {
  const { t } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to determine user role from email
  const determineUserRole = (email: string): 'admin' | 'hr' | 'warden' => {
    console.log('🔍 Determining role for email:', email);
    
    if (email.includes('@admin')) {
      return 'admin';
    } else if (email.includes('@hr')) {
      return 'hr';
    } else {
      return 'warden'; // Default role
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 Starting user registration for:', email);
      
      // Create Firebase user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase user created successfully:', user.email);

      // Determine user role based on email
      const userRole = determineUserRole(email);
      console.log('🎭 Assigned role:', userRole, 'to user:', email);

      // Save user data to Firestore
      const userDocData = {
        email: user.email,
        displayName: fullName,
        role: userRole,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      console.log('💾 Saving user document to Firestore...');
      await setDoc(doc(db, 'users', user.uid), userDocData);
      console.log('✅ User document saved successfully');

      console.log('🎉 Registration completed successfully!');
      
      // Call onRegister to trigger any parent component logic
      onRegister();
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08796B] to-[#065D52] flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button 
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('signIn')}</span>
        </button>

        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white rounded-3xl mb-4 shadow-lg p-6">
            <Building2 className="h-28 w-28 text-[#08796B]" />
          </div>
          <h1 className="text-white text-3xl mb-2">{t('createAccount')}</h1>
          <p className="text-white/80">{t('tagline')}</p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white/90">{t('fullName')}</Label>
            <Input
              id="fullName"
              type="text"
              placeholder={t('fullNamePlaceholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white/95 border-white/30 h-12 rounded-xl"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="Use @admin, @hr, or @warden for role assignment"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/95 border-white/30 h-12 rounded-xl"
              disabled={isLoading}
              required
            />
            <p className="text-white/60 text-xs">
              💡 Use @admin, @hr, or @warden in your email to get the appropriate role
            </p>
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
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white/90">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/95 border-white/30 h-12 rounded-xl"
              disabled={isLoading}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-white text-[#08796B] hover:bg-white/90 rounded-xl mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : t('register')}
          </Button>

          <div className="text-center pt-4">
            <p className="text-white/80 text-sm">
              {t('alreadyHaveAccount')}{' '}
              <button 
                type="button"
                onClick={onBackToLogin}
                className="text-white underline hover:text-white/90"
              >
                {t('signIn')}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
