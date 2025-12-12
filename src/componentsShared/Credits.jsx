import { useTranslation } from 'react-i18next';
import enCredits from '../legal/en/credits.json';
import frCredits from '../legal/fr/credits.json';
import "../pages/NewsItem.css";

export default function Credits() {
  const { i18n } = useTranslation();
  const credits = i18n.language === 'fr' ? frCredits : enCredits;

  return (
    <main className="single-post">
      <h1>{credits.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: credits.content }} />
    </main>
  );
}