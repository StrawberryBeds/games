import React from 'react';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { onSnapshot } from 'firebase/firestore';

import Home from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
import EmailVerificationPage from './pages/EmailVerificationPage';

import SignInPage from "./pages/SignInPage";
import ChoosePlayer from "./pages/ChoosePlayer";

import ProfilePage from "./pages/ProfilePage";
import ParentAuthPage from "./pages/ParentAuthPage";
import CreateProfilesPage from "./pages/CreatePlayerProfiles"
import ManageProfilesPage from './pages/ManagePlayerProfiles';

import PlayCardSet from "./pages/PlayCardSet";

import Header from "./componentsShared/Header";
import Footer from "./componentsShared/Footer";
import ParentAuthGuard from "./componentsGuards/parentAuthGuard";
import NotFoundPage from './pages/NotFoundPage';

import { AuthProvider } from "./context/authContext";
import { PlayerProvider } from "./context/playerContext";
import { useAuth } from "./context/authContext";
import { usePlayerSelection } from "./context/usePlayerSelection"
import ErrorBoundary from './componentsShared/ErrorBoundary';


// In AppRoutes function inside App.jsx
function AppRoutes() {
  const { currentUser } = useAuth();
  const { selectedPlayer } = usePlayerSelection();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

 useEffect(() => {
  // Always set loadingAuth to false once we know the auth state
  setLoadingAuth(false);

  if (!currentUser) {
    return;
  }
  if (!currentUser.emailVerified) {
    return;
  }
  const docRef = doc(db, "players", currentUser.uid);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      setProfileData(docSnap.data());
    } else {
      setProfileData(null);
    }
    setLoadingProfile(false);
  });
  return () => unsubscribe();
}, [currentUser]);


  // 1. If no user, show auth routes
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    );
  }

  // 2. If email is not verified, show verification prompt
  if (!currentUser.emailVerified) {
    return (
      <Routes>
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="*" element={<Navigate to="/verify-email" />} />
      </Routes>
    );
  }

  // 3. User but no profile.
  if (!profileData) {
    return (
      <Routes>
        <Route path="/createprofile" element={<CreateProfilesPage />} />
        <Route path="*" element={<Navigate to="/createprofile" />} />
      </Routes>
    );
  }


  // 4. Incomplete profile
  if (!profileData.setupComplete) {
    return (
      <Routes>
        <Route path="/createprofile" element={<CreateProfilesPage />} />
        <Route path="*" element={<Navigate to="/createprofile" />} />
      </Routes>
    );
  }

  // 5. Profile complete but no selected player.
  if (!selectedPlayer) {
    return (
      <Routes>
        {/* <Route path="/createprofiles" element={<CreateProfilesPage />} /> */}
        <Route path="/player" element={<ChoosePlayer />} />
        <Route path="*" element={<Navigate to="/player" />} />
      </Routes>
    );
  }

  // 6. If player is selected, show main app routes
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cardSet/:id" element={<PlayCardSet />} />
      <Route path="/player" element={<ChoosePlayer />} />
      <Route
        path="/profile"
        element={!selectedPlayer ? <Navigate to="/notfound" /> : <ProfilePage />}
      />



      {/* ParentAuth route - for password entry */}
      <Route path="/parent-auth" element={<ParentAuthPage />} />

      <Route
        path="/manageprofiles"
        element={
          <ParentAuthGuard>
            <ManageProfilesPage />
          </ParentAuthGuard>
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
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </React.Suspense>
          <Footer />
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
