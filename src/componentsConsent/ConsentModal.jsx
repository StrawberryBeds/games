
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
          <p>
            Ce site web utilise des cookies pour améliorer votre expérience. Veuillez donner votre consentement ou 
            <a href="/privacy" onClick={(e) => handlePrivacyLink(e, 'fr')}> lisez notre Politique de confidentialité </a> 
            pour en savoir plus.
          </p>
        </div>
        <div className="consent-side en">
          <p>
            We use cookies to improve your experience. Please give your consent or 
            <a href="/privacy" onClick={(e) => handlePrivacyLink(e, 'en')}> read our Privacy Policy </a> 
            to learn more.
          </p>
        </div>
      </div>
      {/* Buttons: Only Accept/Decline and Accepter/Refuser */}
      <div className="modal-buttons">
        <button onClick={() => handleSubmit(true, 'fr')}>Accepter</button>
        <button onClick={() => handleSubmit(false, 'fr')}>Refuser</button>
        <button onClick={() => handleSubmit(true, 'en')}>Accept</button>
        <button onClick={() => handleSubmit(false, 'en')}>Decline</button>
      </div>
    </div>
  );
}

export default ConsentModal;
