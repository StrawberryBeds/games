import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeNav = () => setIsNavOpen(false);

  const { i18n, t } = useTranslation();

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/home">
          <div className="header-logo">Pantalone</div>
        </Link>
      </div>
      <button className="hamburger" onClick={toggleNav}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
        {/* <button onClick={() => { navigate('/news'); closeNav(); }}>{t('news_button')}</button> */}
        <button onClick={() => { navigate('/cardset/0'); closeNav(); }}>{t('play_match_button')}</button>
        {/* <button onClick={() => { navigate('/slide/0'); closeNav(); }}>{t('play_slide_button')}</button> */}
        {/* <button onClick={() => { navigate('/cardset/1'); closeNav(); }}>{t('play_slide_button')}</button> */}
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
