// import { useState } from 'react';

import './App.css'; // Correct
import './index.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Correct
import PlayCardSet from './pages/PlayCardSet'; // Correct
import SignUpPage from './pages/SignUpPage'; // Correct
import SignInPage from './pages/SignInPage'; // Correct
import ProfilePage from './pages/ProfilePage'; // Correct
import Header from './components/Header'; // Correct
import Footer from './components/Footer'; // Correct
import { AuthProvider } from './context/authContext'; // Correct




function App() {
    // const [apiData, setApiData] = useState(null);

    return (
        <AuthProvider>
            <Router>
                <Header />
                {/* <GetData setApiData={setApiData} /> Ensure GetData is used here */}
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path="/cardSet/:id" element={<PlayCardSet />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
