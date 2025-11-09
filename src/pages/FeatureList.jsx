import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "../sanity";
import { useTranslation } from "react-i18next";
import "./NewsList.css";

const FEATURE_QUERY_EN = `*[_type == "feature"] { _id, title_en, slug, image, publishedAt }`;
const FEATURE_QUERY_FR = `*[_type == "feature"] { _id, title_fr, slug, image, publishedAt }`;



function FeatureList() {
  const [Features, setFeatures] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {    
const fetchFeatures = async () => {
  try {
    const query = i18n.language === 'fr' ? SECURITY_QUERY_FR : SECURITY_QUERY_EN;
    const data = await client.fetch(query);
    console.log("Fetched posts:", data);
    setFeatures(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    setFeatures([]); 
  }
};
    fetchFeatures();
  }, [i18n.language]);

  return (
    <main>
      <h1>{t('news.news_title')}</h1>
      <ul className="news-list">
        {features.map((feature) => (
          <li key={feature._id}>
            <Link to={`/security/${feature.slug.current}`}>
              <h2>{i18n.language === 'fr' ? feature.title_fr : feature.title_en}</h2>
              <p>{new Date(feature.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default FeatureList;
