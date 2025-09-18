// import { useState } from 'react';

import './App.css'; // Correct
import './index.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Correct
import PlayCardSet from './pages/PlayCardSet'; // Correct
import SignUpPage from './pages/SignUpPage'; // Correct
import ProfilePage from './pages/ProfilePage'; // Correct
import Header from './components/Header'; // Correct
import Footer from './components/Footer'; // Correct




  function App() {
    // const [apiData, setApiData] = useState(null);

    return (
        <Router>
            <Header />
            {/* <GetData setApiData={setApiData} /> Ensure GetData is used here */}
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path="/cardSet/:id" element={<PlayCardSet/>} />
                <Route path="/signup" element={<SignUpPage/>} />
                <Route path="/profile" element={<ProfilePage/>} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
