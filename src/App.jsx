import React from 'react';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc } from 'firebase/firestore';
import { db } from './firebase'; 
import { onSnapshot } from 'firebase/firestore';
import Home from "./pages/Home";
import PlayCardSet from "./pages/PlayCardSet";
import SignUpPage from "./pages/SignUpPage";
import EmailVerificationPage from './pages/EmailVerificationPage';
import SignInPage from "./pages/SignInPage";
import CreateProfilesPage from "./pages/CreatePlayerProfiles"
import ManageProfilesPage from './pages/ManagePlayerProfiles';
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/authContext";
import ChoosePlayer from "./pages/ChoosePlayer";
import { PlayerProvider } from "./context/playerContext";
import ParentAuthGuard from "./componentsGuards/parentAuthGuard";
import ParentAuthPage from "./pages/ParentAuthPage";
import { useAuth } from "./context/authContext";
import { usePlayerSelection } from "./context/usePlayerSelection"

// In AppRoutes function inside App.jsx
function AppRoutes() {
  const { currentUser } = useAuth();
  const { currentPlayer } = usePlayerSelection();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Check if email is verified
    if (currentUser && !currentUser.emailVerified) {
      setLoading(false);
      return; // Don't proceed further if email isn't verified
    }

    const docRef = doc(db, "players", currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      } else {
        setProfileData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return null;
  }

  // If no user, show auth routes
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    );
  }

  // NEW: If email is not verified, show verification prompt
  if (!currentUser.emailVerified) {
    return (
      <Routes>
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="*" element={<Navigate to="/verify-email" />} />
      </Routes>
    );
  }

  // Rest of your existing routing logic...
  if (!profileData) {
    return (
      <Routes>
        <Route path="/createprofile" element={<CreateProfilesPage />} />
        <Route path="*" element={<Navigate to="/createprofile" />} />
      </Routes>
    );
  }


  // If profile exists but setup is incomplete, redirect to profile creation
  if (!profileData.setupComplete) {
    return (
      <Routes>
        <Route path="/createprofile" element={<CreateProfilesPage />} />
        <Route path="*" element={<Navigate to="/createprofile" />} />
      </Routes>
    );
  }

  // If user is signed in but no player selected, show player selection
  if (!currentPlayer) {
    return (
      <Routes>
        {/* <Route path="/createprofiles" element={<CreateProfilesPage />} /> */}
        <Route path="/player" element={<ChoosePlayer />} />
        <Route path="*" element={<Navigate to="/player" />} />
      </Routes>
    );
  }

  // If player is selected, show main app routes
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cardSet/:id" element={<PlayCardSet />} />
      <Route path="/player" element={<ChoosePlayer />} />

      {/* ParentAuth route - for password entry */}
      <Route path="/parent-auth" element={<ParentAuthPage />} />

      {/* Protected route - ProfilePage wrapped with ParentAuthGuard */}
      {/* TO DO : Update this so that it is Manage Profiles not Create Profiles */}
      <Route
        path="/manageprofiles"
        element={
          <ParentAuthGuard>
            <ManageProfilesPage />
          </ParentAuthGuard>
        }
      />
      <Route 
      path="/profile" 
      element={

      <ProfilePage />
    } 
    />

      {/* Catch-all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Header />
          <React.Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
          </React.Suspense>
          <Footer />
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
