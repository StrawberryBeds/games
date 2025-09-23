import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; 
import Home from "./pages/Home";
import PlayCardSet from "./pages/PlayCardSet";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import CreateProfilesPage from "./pages/CreatePlayerProfiles"
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/authContext";
import ChoosePlayer from "./pages/ChoosePlayer";
import { PlayerProvider, usePlayerSelection } from "./context/playerContext";
import ParentAuthGuard from "./componentsGuards/parentAuthGuard";
import ParentAuth from "./pages/ParentAuth";
import { useAuth } from "./context/authContext";

function AppRoutes() {
  const { currentUser } = useAuth();
  const { currentPlayer } = usePlayerSelection();
  const [profileExists, setProfileExists] = useState(null);
  const [loading, setLoading] = useState(true);

    // Check if user has a profile
  useEffect(() => {
    const checkProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "players", currentUser.uid);
          const docSnap = await getDoc(docRef);
          setProfileExists(docSnap.exists());
        } catch (error) {
          console.error("Error checking profile:", error);
          setProfileExists(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkProfile();
  }, [currentUser]);

  // If loading, show nothing or a loading spinner
  if (loading) {
    return null; // Or return a loading component
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

    // If user is signed in but has no profile, redirect to profile creation
  if (profileExists === false) {
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
      <Route path="/parent-auth" element={<ParentAuth />} />

      {/* Protected route - ProfilePage wrapped with ParentAuthGuard */}
      <Route
        path="/createprofiles"
        element={
          <ParentAuthGuard>
            <CreateProfilesPage />
          </ParentAuthGuard>
        }
      />
      {/* <Route path="/createprofiles" element={<CreateProfilesPage />} /> */}
      <Route path="/profile" element={<ProfilePage />} />

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
          <AppRoutes />
          <Footer />
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
