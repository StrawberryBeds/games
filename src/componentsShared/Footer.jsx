import './Footer.css';
import { useTranslation, Trans } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <p>{t('footer.copyright')}
        <Trans
          i18nKey="footer.card_images_attribution"
          components={{
            1: <a href="https://openmoji.org/" target="_blank" rel="noopener noreferrer" />
          }}
        />
      </p>
      <Link to="/terms">
        {t('footer.terms_of_service')}
      </Link>
      <Link to="/privacy">
        {t('footer.privacy_policy')}
      </Link>
    </footer>
  );
}

export default Footer;
