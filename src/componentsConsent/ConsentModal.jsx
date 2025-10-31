
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './ConsentModal.css';

function ConsentModal({ onConsent }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

const handleSubmit = (consent, language) => {
  if (!consent) {
    // Delete GA cookies
    document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = '_ga_54N3FQMT4E=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
  onConsent(consent, language);
  i18n.changeLanguage(language);
};


  const handlePrivacyLink = (e, language) => {
    e.preventDefault();
    navigate('/privacy');
    i18n.changeLanguage(language);
  };

  return (
    <div className="consent-modal">
      {/* Content: Split into two columns for text */}
      <div className="consent-content">
        <div className="consent-side fr">
          <h2>Bienvenue à Pantalone !</h2>
          <p>Ce site n'utilise pas des cookies. 
            <a href="/privacy" onClick={(e) => handlePrivacyLink(e, 'fr')}> Lisez notre Politique de confidentialité </a> 
            pour en savoir plus.
            {/* Ce site web utilise des cookies pour améliorer votre expérience. Veuillez donner votre consentement ou 
            <a href="/privacy" onClick={(e) => handlePrivacyLink(e, 'fr')}> lisez notre Politique de confidentialité </a> 
            pour en savoir plus. */}
          </p>
        </div>
        <div className="consent-side en">
          <h2>Welcome to Pantalone!</h2>
          <p>This site does not use cookies.
          <a href="/privacy" onClick={(e) => handlePrivacyLink(e, 'en')}> Read our Privacy Policy </a> 
            to learn more.
            {/* We use cookies to improve your experience. Please give your consent or 
            <a href="/privacy" onClick={(e) => handlePrivacyLink(e, 'en')}> read our Privacy Policy </a> 
            to learn more. */}
          </p>
        </div>
      </div>
      {/* Buttons: Only Accept/Decline and Accepter/Refuser */}
      <div className="modal-buttons">
        <button onClick={() => handleSubmit(true, 'fr')}>Français</button>
        {/* <button onClick={() => handleSubmit(false, 'fr')}>Refuser</button> */}
        <button onClick={() => handleSubmit(true, 'en')}>English</button>
        {/* <button onClick={() => handleSubmit(false, 'en')}>Decline</button> */}
      </div>
    </div>
  );
}

export default ConsentModal;

// PRIVACY POLICY TEXT IN CASE COOKIES ARE RESTORED

// <li><strong>Usage Data: </strong> Google Analytics tracks basic site interactions in an anonymous format (e.g., page visits, the countries visitors are located in) via cookies (<code>_ga</code>, <code>_ga_#</code>).</li>
// <li><strong>Opt-Out of Cookies:</strong> You can withdraw consent for Google Analytics cookies at any time by clearing your browser’s cookies and refreshing the page. You’ll be prompted to consent again. Select “Refuse”. Please consult your browser’s Help for full instructions about clearing your browser’s cookies.</li>
// <li><strong>Google Analytics:</strong> Anonymous usage data is retained for <strong>26 months</strong> (Google’s default).</li>

// <li><strong>Données d'utilisation :</strong> Google Analytics suit les interactions de base sur le site de manière anonyme (par exemple, les pages visitées, les pays dans lesquels se trouvent les visiteurs) via des cookies (<code>_ga</code>, <code>_ga_#</code>).</li>
// <li><strong>Désactivation des cookies :</strong> vous pouvez retirer votre consentement pour les cookies Google Analytics à tout moment en effaçant les cookies de votre navigateur et en actualisant la page. Vous serez invité à donner à nouveau votre consentement. Sélectionnez « Refuser ». Veuillez consulter l'aide de votre navigateur pour obtenir des instructions complètes sur la suppression des cookies de votre navigateur.</li>
// <li><strong>Google Analytics :</strong> les données d'utilisation anonymes sont conservées pendant <strong>26 mois</strong> (paramètre par défaut de Google).</li>
