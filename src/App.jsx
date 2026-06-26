import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from "./pages/HomePage";
import PlayCardSet from "./pages/PlayCardSet";
import SlidePage from "./pages/SlidePage";

import Header from "./componentsShared/Header";
import Footer from "./componentsShared/Footer";
import NotFoundPage from './pages/NotFoundPage';
import Privacy from "./pages/PrivacyPage";
import Terms from "./pages/TermsPage";
import ContactPage from './pages/ContactPage';
import ConsentModal from './componentsConsent/ConsentModal';
import LegalPage from './pages/LegalPage';

import News from "./pages/NewsList";
import NewsItem from "./pages/NewsItem";
import Security from "./pages/SecurityList";
import SecurityItem from "./pages/SecurityItem";
import Feature from "./pages/FeatureList";
import FeatureItem from "./pages/FeatureItem";

import ErrorBoundary from './componentsShared/ErrorBoundary';
import './i18n';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<NewsItem />} />
      <Route path="/security" element={<Security />} />
      <Route path="/security/:slug" element={<SecurityItem />} />
      <Route path="/feature" element={<Feature />} />
      <Route path="/feature/:slug" element={<FeatureItem />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/legal" element={<LegalPage />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cardset/:id" element={<PlayCardSet isGuest />} />
      <Route path="/slide/:id" element={<SlidePage isGuest />} />
      <Route path="/notfound" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

function App() {
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
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
  };

  return (
    <Suspense fallback="loading">
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
    </Suspense>
  );
}

export default App;
