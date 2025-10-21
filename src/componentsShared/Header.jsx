import { useState } from 'react';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import SignOutButton from './SignOutButton.jsx';
import { useTranslation } from 'react-i18next';
import './Header.css';


function Header() {
  const { currentUser } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeNav = () => setIsNavOpen(false);

  const { i18n, t } = useTranslation();

  return (
    <header className="header">
      <div className="header-logo">Ludico</div>
      <button className="hamburger" onClick={toggleNav}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
        <button onClick={() => { navigate('/games'); closeNav(); }}>{t('play_button')}</button>

        {currentUser ? (
          <>
            <button onClick={() => { navigate('/profile'); closeNav(); }}>{t('profile_button')}</button>
            <button onClick={() => { navigate('/player'); closeNav(); }}>{t('change_player_button')}</button>
            <SignOutButton onClick={closeNav} />
          </>

        ) : (
          <>
            <button onClick={() => { navigate('/signup'); closeNav(); }}>{t('create_account_button')}</button>
            <button onClick={() => { navigate('/signin'); closeNav(); }}>{t('sign_in_button')}</button>
          </>
        )}
        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
          className="language-toggle"
        >
          {i18n.language === 'en' ? 'FR' : 'EN'}
        </button>
      </nav>
    </header>
  );
}

export default Header;
