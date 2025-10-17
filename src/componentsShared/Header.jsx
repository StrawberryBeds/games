import { useState } from 'react';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import SignOutButton from './SignOutButton.jsx';
import './Header.css';


function Header() {
  const { currentUser } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeNav = () => setIsNavOpen(false);

  return (
    <header className="header">
      <div className="header-logo">Ludico</div>
      <button className="hamburger" onClick={toggleNav}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
        <button onClick={() => { navigate('/games'); closeNav(); }}>Play Games</button>

        {currentUser ? (
          <>
            <button onClick={() => { navigate('/profile'); closeNav(); }}>Profile</button>
            <button onClick={() => { navigate('/player'); closeNav(); }}>Change Player</button>
            <SignOutButton onClick={closeNav} />
          </>
        ) : (
          <>
            <button onClick={() => { navigate('/signup'); closeNav(); }}>Create Your Account</button>
            <button onClick={() => { navigate('/signin'); closeNav(); }}>Sign In</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;