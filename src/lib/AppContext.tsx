import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Language, translations, TranslationKeys } from './translations';

export type UserRole = 'admin' | 'hr' | 'warden';

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
  user: User | null;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  isLoading: boolean;
  isRoleLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleLoading, setIsRoleLoading] = useState(false);

  useEffect(() => {
    // Apply or remove dark class on document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Firebase auth state changed:', user?.email || 'No user');
      setUser(user);
      setUserEmail(user?.email || '');
      
      if (user) {
        console.log('👤 User authenticated, fetching role from Firestore...');
        console.log('🆔 User UID:', user.uid);
        setIsRoleLoading(true); // Start role loading
        
        // Fetch user role from Firestore
        try {
          console.log('📖 Attempting to read from Firestore: users/' + user.uid);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('📄 Firestore document found:', userData);
            console.log('👑 User role from Firestore:', userData.role);
            setUserRole(userData.role || null);
          } else {
            console.log('❌ User document does not exist in Firestore');
            console.log('🔄 Determining role from email fallback...');
            
            // Fallback: determine role from email if no Firestore document
            const email = user.email?.toLowerCase() || '';
            let fallbackRole: UserRole;
            if (email.includes('@admin')) {
              fallbackRole = 'admin';
            } else if (email.includes('@hr')) {
              fallbackRole = 'hr';
            } else if (email.includes('@warden')) {
              fallbackRole = 'warden';
            } else {
              fallbackRole = 'warden'; // Default role
            }
            console.log('🎯 Fallback role determined from email:', email, '→', fallbackRole);
            setUserRole(fallbackRole);
          }
        } catch (error) {
          console.error('❌ Error fetching user role from Firestore:', error);
          console.log('🔄 Using email-based fallback due to error...');
          
          // Fallback: determine role from email if Firestore fails
          const email = user.email?.toLowerCase() || '';
          let fallbackRole: UserRole;
          if (email.includes('@admin')) {
            fallbackRole = 'admin';
          } else if (email.includes('@hr')) {
            fallbackRole = 'hr';
          } else if (email.includes('@warden')) {
            fallbackRole = 'warden';
          } else {
            fallbackRole = 'warden'; // Default role
          }
          console.log('🎯 Error fallback role determined from email:', email, '→', fallbackRole);
          setUserRole(fallbackRole);
        } finally {
          setIsRoleLoading(false); // End role loading
        }
      } else {
        console.log('🚪 User logged out, clearing role');
        setUserRole(null);
        setIsRoleLoading(false);
      }
      
      console.log('✅ Auth state processing complete, setting isLoading to false');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <AppContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      language, 
      setLanguage, 
      t,
      user,
      userRole,
      setUserRole,
      userEmail,
      setUserEmail,
      isLoading,
      isRoleLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
