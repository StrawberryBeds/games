import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "../sanity";
import { useTranslation } from "react-i18next";
import "./HomeSummary.css";
import { useNavigate } from 'react-router-dom';

const POSTS_QUERY_EN = `*[_type == "post"] { _id, title_en, slug, image, publishedAt }`;
const POSTS_QUERY_FR = `*[_type == "post"] { _id, title_fr, slug, image, publishedAt }`;

function HomeSummary() {
  const [posts, setPosts] = useState([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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

  return (
    <main>

      <div className="cta-content">
        <h3>{t('home.cta_message')}</h3>

        <div className="home-buttons">
          <button onClick={() => { navigate('/signup') }}>{t('home.cta_button')}</button>
        </div>
      </div>


      <h2>{t('news.news_title')}</h2>
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