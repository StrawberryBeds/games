import React from 'react';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { onSnapshot } from 'firebase/firestore';

import Home from "./pages/HomePage";
import ChooseCardSet from "./pages/ChooseCardSet";
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
import PrivateRoute from "./componentsGuards/privateRoutesGuard";
import NotFoundPage from './pages/NotFoundPage';
import Privacy from "./pages/PrivacyPage";
import Terms from "./pages/TermsPage";
import ConsentModal from './componentsConsent/ConsentModal';

import News from "./pages/NewsList";
import NewsItem from "./pages/NewsItem";

import { AuthProvider } from "./context/authContext";
import { PlayerProvider } from "./context/playerContext";
import { useAuth } from "./context/authContext";
import { usePlayerSelection } from "./context/usePlayerSelection"
import ErrorBoundary from './componentsShared/ErrorBoundary';

import './i18n';
import { Suspense } from 'react';



// In AppRoutes function inside App.jsx
function AppRoutes() {
  const { currentUser } = useAuth();
  const { selectedPlayer } = usePlayerSelection();
  const [profileData, setProfileData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  // const currentWeekId = "2"; // Dynamic later

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

  // Static routes (always available)
  const staticRoutes = (
    <>
      <Route path="/home" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<NewsItem />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </>
  );

  // Public guest route (explicitly only for cardset/0)
  const guestRoutes = (
    <Route path="/cardset/0" element={<PlayCardSet isGuest={true} />} />
  );

  // Private routes (default for all other card sets)
  const privateRoutes = (
    <>
      <Route path="/auth/chooseset" element={<PrivateRoute><ChooseCardSet /></PrivateRoute>} />
      <Route path="/auth/cardset/:id" element={<PrivateRoute><PlayCardSet isGuest={false} /></PrivateRoute>} />
      <Route path="/auth/player" element={<PrivateRoute><ChoosePlayer /></PrivateRoute>} />
      <Route path="/auth/profile" element={<PrivateRoute>{!selectedPlayer ? <Navigate to="/notfound" /> : <ProfilePage />}</PrivateRoute>} />
      <Route path="/auth/playerhistory" element={<PrivateRoute>{!selectedPlayer ? <Navigate to="/notfound" /> : <PlayerHistory />}</PrivateRoute>} />
      <Route path="/auth/parent-auth" element={<PrivateRoute><ParentAuthPage /></PrivateRoute>} />
      <Route path="/auth/manageprofiles" element={<PrivateRoute><ParentAuthGuard><ManageProfilesPage /></ParentAuthGuard></PrivateRoute>} />
    </>
  );

  // 1. If no user, show guest routes and static routes
  if (!currentUser) {
    return (
      <Routes>
        {staticRoutes}
        {guestRoutes}
        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    );
  }

  // 2. If email is not verified, show verification prompt
  if (!currentUser.emailVerified) {
    return (
      <Routes>
        {staticRoutes}
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="*" element={<Navigate to="/verify-email" />} />
      </Routes>
    );
  }

  // 3. User but no profile
  if (!profileData) {
    return (
      <Routes>
        {staticRoutes}
        <Route path="/auth/createprofile" element={<CreateProfilesPage />} />
        <Route path="/auth/*" element={<Navigate to="/auth/createprofile" />} />
      </Routes>
    );
  }

  // 4. Incomplete profile
  if (!profileData.setupComplete) {
    return (
      <Routes>
        {staticRoutes}
        <Route path="/auth/createprofile" element={<CreateProfilesPage />} />
        <Route path="/auth/*" element={<Navigate to="/auth/createprofile" />} />
      </Routes>
    );
  }

  // 5. Profile complete but no selected player
  if (!selectedPlayer) {
    return (
      <Routes>
        {staticRoutes}
        <Route path="/auth/player" element={<ChoosePlayer />} />
        <Route path="/auth/*" element={<Navigate to="/auth/player" />} />
      </Routes>
    );
  }

  // 6. If player is selected, show main app routes
  return (
    <Routes>
      {staticRoutes}
      {privateRoutes}
      <Route path="/notfound" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/auth/" />} />
    </Routes>
  );
}


function App() {
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    // Check localStorage for existing consent/language
    const consentGiven = localStorage.getItem('cookieConsent');
    const languageSelected = localStorage.getItem('selectedLanguage');
    if (!consentGiven || !languageSelected) {
      setShowConsentModal(true);
    }
  }, []);

  const handleConsent = (consent, language) => {
    localStorage.setItem('cookieConsent', consent);
    localStorage.setItem('selectedLanguage', language);
    setShowConsentModal(false);
    // Optionally, reload or update app language here
  };


  return (
    <Suspense fallback="loading">
      <AuthProvider>
        <PlayerProvider>
          <Router>
            <Header />
            <React.Suspense fallback={<div>Loading...</div>}>
              <ErrorBoundary>
                {showConsentModal && (
                  <ConsentModal onConsent={handleConsent} />
                )}
                <AppRoutes />
              </ErrorBoundary>
            </React.Suspense>
            <Footer />
          </Router>
        </PlayerProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
