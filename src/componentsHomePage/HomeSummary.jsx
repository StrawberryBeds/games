import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "../sanity";
import { useTranslation } from "react-i18next";
import "./HomeSummary.css";
import { useNavigate } from 'react-router-dom';
import CardSet from "../componentsPlayCardSet/CardSet";
import cardSets from "../data/cardSets";


const POSTS_QUERY_EN = `*[_type == "post"] { _id, title_en, slug, image, publishedAt }`;
const POSTS_QUERY_FR = `*[_type == "post"] { _id, title_fr, slug, image, publishedAt }`;
const SECURITY_QUERY_EN = `*[_type == "onlineSecurity"] { _id, title_en, slug, image, publishedAt }`;
const SECURITY_QUERY_FR = `*[_type == "onlineSecurity"] { _id, title_fr, slug, image, publishedAt }`;

function HomeSummary() {
  const [posts, setPosts] = useState([]);
  const [securityPosts, setSecurityPosts] = useState([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const id = cardSets;[0];
  const featuredCardSet = cardSets[3]; // Commedia dell'arte

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = i18n.language === 'fr' ? POSTS_QUERY_FR : POSTS_QUERY_EN;
        const data = await client.fetch(query);
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, [i18n.language]);

  useEffect(() => {
    const fetchSecurityPosts = async () => {
      try {
        const query = i18n.language === 'fr' ? SECURITY_QUERY_FR : SECURITY_QUERY_EN;
        const data = await client.fetch(query);
        console.log("Fetched security posts:", data);
        setSecurityPosts(data);
      } catch (error) {
        console.error("Error fetching security posts:", error);
        setSecurityPosts([]);
      }
    };
    fetchSecurityPosts();
  }, [i18n.language]);

  const handleCardClick = (id, name) => {
    navigate(`/auth/cardSet/${id}`), name;
  };

  return (
    <main>
      <div className="cta-content">
        <h3>{t('home.cta_message')}</h3>
        <div className="home-buttons">
          <button onClick={() => { navigate('/signup') }}>{t('home.cta_button')}</button>
        </div>
      </div>

      {/* New container for side-by-side featured content */}
      <div className="featured-content-container">
        <div className="featured-cardset">
          <h2>{t('home.featured_cardset')}</h2>
          <CardSet
            key={featuredCardSet.id}
            id={featuredCardSet.id}
            image={featuredCardSet.image}
            name={featuredCardSet.name}
            onClick={() => handleCardClick(featuredCardSet.id, featuredCardSet.name)}
          />
        </div>

        <div className="online-security-content">
          <ul>
            {securityPosts.map((securityPost) => (
              <li key={securityPost._id}>
                <Link to={`/security/${securityPost.slug.current}`}>
                  <h3>{i18n.language === 'fr' ? securityPost.title_fr : securityPost.title_en}</h3>
                  <p>{new Date(securityPost.publishedAt).toLocaleDateString()}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* <h2>{t('news.news_title')}</h2> */}
      <ul className="news-content">
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/news/${post.slug.current}`}>
              <h3>{i18n.language === 'fr' ? post.title_fr : post.title_en}</h3>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default HomeSummary;