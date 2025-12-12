import './Footer.css';
import { useTranslation, Trans } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer className="footer">


      <Link to="/legal">
        {t('footer.copyright')}
      </Link>
      <Link to="/legal">
        {t('footer.legal')}
      </Link>

      <Link to="/contact">
        {t('footer.contact')}
      </Link>
    </footer>
  );
}

export default Footer;
