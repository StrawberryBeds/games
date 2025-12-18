import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "../sanity";
import { useTranslation } from "react-i18next";
import "./HomeSummary.css";
import { useNavigate } from 'react-router-dom';
import CardSet from "../componentsPlayCardSet/CardSet";
import cardSets from "../data/cardSets";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import GlobalLeaderboard from "./GlobalLeaderboard";

const POSTS_QUERY_EN = `*[_type == "post"] { _id, title_en, slug, image, publishedAt }`;
const POSTS_QUERY_FR = `*[_type == "post"] { _id, title_fr, slug, image, publishedAt }`;
const SECURITY_QUERY_EN = `*[_type == "securityPost"] { _id, title_en, slug, image, publishedAt }`;
const SECURITY_QUERY_FR = `*[_type == "securityPost"] { _id, title_fr, slug, image, publishedAt }`;
const FEATURE_QUERY_EN = `*[_type == "feature"] { _id, title_en, slug, image, publishedAt }`;
const FEATURE_QUERY_FR = `*[_type == "feature"] { _id, title_fr, slug, image, publishedAt }`;

function HomeSummary() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({});
  const [features, setFeatures] = useState([]);
  const [featurePosts, setFeaturePosts] = useState([]);
  const [featurePost, setFeaturePost] = useState({});
  const [securityPosts, setSecurityPosts] = useState([]);
  const [securityPost, setSecurityPost] = useState({});
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const id = cardSets[0];
  const builder = imageUrlBuilder(client);

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
        if (data.length > 0) {
          setSecurityPost(data[0]);
        }
      } catch (error) {
        console.error("Error fetching security posts:", error);
        setSecurityPosts([]);
      }
    };
    fetchSecurityPosts();
  }, [i18n.language]);

  useEffect(() => {
    const fetchFeaturePosts = async () => {
      try {
        const query = i18n.language === 'fr' ? FEATURE_QUERY_FR : FEATURE_QUERY_EN;
        const data = await client.fetch(query);
        console.log("Fetched features:", data);
        setFeaturePosts(data);
        if (data.length > 0) {
          setFeaturePost(data[0]);
        }
      } catch (error) {
        console.error("Error fetching features:", error);
        setFeaturePosts([]);
      }
    };
    fetchFeaturePosts();
  }, [i18n.language]);

  function urlFor(source) {
    return builder.image(source);
  }
  
  const featurePostImageUrl = featurePost.image ? urlFor(featurePost.image).width(720).url() : null;
  const securityPostImageUrl = securityPost.image ? urlFor(securityPost.image).width(720).url() : null;

  return (
    <main>
      {/* Replace CTA content with Global Leaderboard */}
      <GlobalLeaderboard />

      {/* New container for side-by-side featured content */}
      <div className="featured-content-container">
        <div className="featured-cardset">
          {featurePostImageUrl && (
            <img
              src={featurePostImageUrl}
              alt={i18n.language === 'fr' ? featurePost.title_fr : featurePost.title_en}
              className="post-image"
            />
          )}
          <ul>
            {featurePosts.map((featurePost) => (
              <li key={featurePost._id}>
                <Link to={`/feature/${featurePost.slug.current}`}>
                  <h3>{i18n.language === 'fr' ? featurePost.title_fr : featurePost.title_en}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="online-security-content">
          {securityPostImageUrl && (
            <img
              src={securityPostImageUrl}
              alt={i18n.language === 'fr' ? securityPost.title_fr : securityPost.title_en}
              className="post-image"
            />
          )}
          <ul>
            {securityPosts.map((securityPost) => (
              <li key={securityPost._id}>
                <Link to={`/security/${securityPost.slug.current}`}>
                  <h3>{i18n.language === 'fr' ? securityPost.title_fr : securityPost.title_en}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="news-content">
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/news/${post.slug.current}`}>
              <h3>{i18n.language === 'fr' ? post.title_fr : post.title_en}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default HomeSummary;