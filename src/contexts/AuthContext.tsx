
import { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  session: null;
  isAdmin: boolean;
  isSeller: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [session] = useState<null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkUserRole = async (userId: string) => {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const snap = await getDoc(profileRef);
      const role = snap.exists() ? (snap.data() as any)?.role : null;
      setIsAdmin(role === 'admin');
      setIsSeller(role === 'vendeur' || role === 'seller');
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
      setIsSeller(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.uid) {
        checkUserRole(currentUser.uid);
      } else {
        setIsAdmin(false);
        setIsSeller(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const getRedirectUrl = () => {
    const isProduction = window.location.hostname !== 'localhost';
    return isProduction 
      ? 'https://www.achatons.com' 
      : `${window.location.protocol}//${window.location.host}`;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userId = cred.user.uid;
    await setDoc(doc(db, 'profiles', userId), {
      id: userId,
      email,
      full_name: fullName || null,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { merge: true });
    return cred;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email, { url: getRedirectUrl() });
    return { success: true };
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const u = cred.user;
    if (u?.uid) {
      const profileRef = doc(db, 'profiles', u.uid);
      const existing = await getDoc(profileRef);
      if (!existing.exists()) {
        await setDoc(profileRef, {
          id: u.uid,
          email: u.email || null,
          full_name: u.displayName || null,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { merge: true });
      }
    }
    return cred;
  };

  const value: AuthContextType = {
    user,
    session,
    isAdmin,
    isSeller,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
