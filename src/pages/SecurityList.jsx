import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "../sanity";
import { useTranslation } from "react-i18next";
import "./NewsList.css";

const SECURITY_QUERY_EN = `*[_type == "onlineSecurity"] { _id, title_en, slug, image, publishedAt }`;
const SECURITY_QUERY_FR = `*[_type == "onlineSecurity"] { _id, title_fr, slug, image, publishedAt }`;


function SecurityList() {
  const [securityPosts, setSecurityPosts] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {    
const fetchSecurityPosts = async () => {
  try {
    const query = i18n.language === 'fr' ? SECURITY_QUERY_FR : SECURITY_QUERY_EN;
    const data = await client.fetch(query);
    console.log("Fetched posts:", data);
    setSecurityPosts(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    setSecurityPosts([]); 
  }
};
    fetchSecurityPosts();
  }, [i18n.language]);

  return (
    <main>
      <h1>{t('news.news_title')}</h1>
      <ul className="news-list">
        {securityPosts.map((securityPost) => (
          <li key={securityPost._id}>
            <Link to={`/security/${securityPost.slug.current}`}>
              <h2>{i18n.language === 'fr' ? securityPost.title_fr : securityPost.title_en}</h2>
              <p>{new Date(securityPost.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default SecurityList;
