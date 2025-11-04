import { useTranslation } from 'react-i18next';
import enTerms from '../legal/en/terms_of_service.json';
import frTerms from '../legal/fr/terms_of_service.json';
import "./NewsItem.css";

export default function TermsPage() {
  const { i18n } = useTranslation();
  const terms = i18n.language === 'fr' ? frTerms : enTerms;

  return (
    <div className="single-post">
      <h1>{terms.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: terms.content }} />
    </div>
  );
}