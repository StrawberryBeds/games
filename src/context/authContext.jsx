// context/authContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // db
import { onAuthStateChanged } from 'firebase/auth';
// import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch the user's emailVerified status
        const userData = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        };
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
