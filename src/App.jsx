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
import PlayerHistory from './componentsProfilePage/PlayerHistory';

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
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const isGuestRoute = window.location.pathname.startsWith('/guest');

  useEffect(() => {
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

  // Guest routes: always show guest game
  // if (isGuestRoute) {
  //   return (
  //     <Routes>
  //       <Route path="/guest/cardSet/:id" element={<PlayCardSet isGuest={true} />} />
  //       <Route path="/signin" element={<SignInPage />} />
  //       <Route path="/signup" element={<SignUpPage />} />
  //       <Route path="/notfound" element={<NotFoundPage />} />
  //       <Route path="*" element={<Navigate to="/guest/cardSet/0" />} />
  //     </Routes>
  //   );
  // }

  // 1. If no user, redirect to guest game by default
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/guest/cardSet/:id" element={<PlayCardSet isGuest={true} />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/guest/cardSet/0" />} />
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
      <Route
        path="/playerhistory"
        element={!selectedPlayer ? <Navigate to="/notfound" /> : <PlayerHistory />}
      />
      <Route path="/parent-auth" element={<ParentAuthPage />} />
      <Route
        path="/manageprofiles"
        element={
          <ParentAuthGuard>
            <ManageProfilesPage />
          </ParentAuthGuard>
        }
      />
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
