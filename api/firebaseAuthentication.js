    // Example for sign-up
    import { auth } from './firebase';
    import { createUserWithEmailAndPassword } from 'firebase/auth';

    const handleSignUp = async (email, password) => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // User signed up successfully
      } catch (error) {
        // Handle errors
        console.error("Error signing up:", error.message);
      }
    };

        // Example useAuth hook (simplified)
    import React, { createContext, useContext, useEffect, useState } from 'react';
    import { auth } from './firebase';
    import { onAuthStateChanged } from 'firebase/auth';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
      const [currentUser, setCurrentUser] = useState(null);

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
        });
        return unsubscribe;
      }, []);

      return (
        <AuthContext.Provider value={{ currentUser }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => useContext(AuthContext);