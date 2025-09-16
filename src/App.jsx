// import { useState } from 'react';

import './App.css'; // Correct
import './index.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Correct
import PlayCardSet from './pages/PlayCardSet'; // Correct
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
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
