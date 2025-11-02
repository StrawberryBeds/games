import { useTranslation } from 'react-i18next';
import enPrivacy from '../legal/en/privacy.json';
import frPrivacy from '../legal/fr/privacy.json';

export default function PrivacyPage() {
  const { i18n } = useTranslation();
  const privacy = i18n.language === 'fr' ? frPrivacy : enPrivacy;

  return (
    <div className="privacy-policy">
      <h1>{privacy.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: privacy.content }} />
    </div>
  );
}
