import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "../sanity";
import { useTranslation } from "react-i18next";
import "./NewsList.css";

const POSTS_QUERY_EN = `*[_type == "post"] { _id, title_en, slug, publishedAt }`;
const POSTS_QUERY_FR = `*[_type == "post"] { _id, title_fr, slug, publishedAt }`;


function NewsList() {
  const [posts, setPosts] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {    
const fetchPosts = async () => {
  try {
    const query = i18n.language === 'fr' ? POSTS_QUERY_FR : POSTS_QUERY_EN;
    const data = await client.fetch(query);
    console.log("Fetched posts:", data);
    setPosts(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    setPosts([]); // Reset to empty array on error
  }
};
    fetchPosts();
  }, [i18n.language]);

  return (
    <main>
      <h1>{t('news.news_title')}</h1>
      <ul className="news-list">
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/news/${post.slug.current}`}>
              <h2>{i18n.language === 'fr' ? post.title_fr : post.title_en}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default NewsList;
