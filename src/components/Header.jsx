import { useState } from 'react';
import './Header.css';
import SignOutButton from './SignOutButton.jsx';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <div className="header-logo">Ludico</div>
      <button className="hamburger" onClick={toggleNav}>
        ☰ {/* Hamburger icon */}
      </button>
      <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
        <button>Play Games</button>
        <button>Profile</button>
        <button>Create Your Account</button>
        <button >Sign In</button>
        <SignOutButton />
      </nav>
    </header>
  );
}

export default Header;
