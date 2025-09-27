import { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import SignOutButton from './SignOutButton.jsx';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-logo">Ludico</div>
      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>
      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        <button onClick={() => navigate('/')}>Play Games</button>
        <button onClick={() => navigate('/profile')}>Profile</button>
        <button onClick={() => navigate('/signup')}>Create Your Account</button>
        <button onClick={() => navigate('/signin')}>Sign In</button>
        <SignOutButton />
      </nav>
    </header>
  );
}

export default Header;
