import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "../sanity";
import { useTranslation } from "react-i18next";
import "./NewsList.css";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

function NewsList() {
  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await client.fetch(POSTS_QUERY);
      console.log("Fetched posts:", data);
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <main>
      <h1>{t('news.news_title')}</h1>
      <ul className="news-list">
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/news/${post.slug.current}`}>
              {console.log(`/news/${post.slug.current}`)}
              <h2>{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default NewsList;
