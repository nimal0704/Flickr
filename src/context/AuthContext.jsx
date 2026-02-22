import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// 🧠 createContext — creates a global state container
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 onAuthStateChanged — Firebase listener
  // fires whenever user signs in or out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup listener on unmount
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 🧠 custom hook to use auth anywhere
export const useAuth = () => useContext(AuthContext);