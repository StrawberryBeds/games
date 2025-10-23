import './Footer.css';
import { useTranslation, Trans } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

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
      <p>{t('footer.disclaimer')}</p>
    </footer>
  );
}

export default Footer;
