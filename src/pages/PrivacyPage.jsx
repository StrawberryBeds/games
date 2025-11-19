import { useTranslation } from 'react-i18next';
import enPrivacy from '../legal/en/privacy.json';
import frPrivacy from '../legal/fr/privacy.json';
import "./NewsItem.css";

export default function PrivacyPage() {
  const { i18n } = useTranslation();
  const privacy = i18n.language === 'fr' ? frPrivacy : enPrivacy;

  return (
    <main className="single-post">
      <h1>{privacy.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: privacy.content }} />
    </main>
  );
}
