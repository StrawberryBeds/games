import { useState } from 'react';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import SignOutButton from './SignOutButton.jsx';
import './Header.css';
import { auth, db } from '../firebase';


function Header() {
  const { currentUser } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <header className="header">
      <div className="header-logo">Ludico</div>
      <button className="hamburger" onClick={toggleNav}>☰</button>
      <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
        <button onClick={() => navigate('/games')}>Play Games</button>

        {currentUser ? (
          <>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={() => navigate('/player')}>Change Player</button>
            <SignOutButton />
          </>
        ) : (
          <>
            <button onClick={() => navigate('/signup')}>Create Your Account</button>
            <button onClick={() => navigate('/signin')}>Sign In</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;