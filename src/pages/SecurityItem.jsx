import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { client } from "../sanity";
import imageUrlBuilder from "@sanity/image-url";
import { useTranslation } from "react-i18next";

const SECURITY_POST_QUERY_EN = `*[_type == "onlineSecuity" && slug.current == $slug][0] {
  _id,
  title_en,
  body_en,
  publishedAt,
  image
}`;

const SECURITY_POST_QUERY_FR = `*[_type == "onlineSecurity" && slug.current == $slug][0] {
  _id,
  title_fr,
  body_fr,
  publishedAt,
  image
}`;

const builder = imageUrlBuilder(client);


function urlFor(source) {
  return builder.image(source);
}

export default function SingleSecurityPost() {
  const { slug } = useParams();
  const [securityPost, setSecurityPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const fetchSecurityPost = async () => {
      try {
        const query = i18n.language === 'fr' ? SECURITY_POST_QUERY_FR : SECURITY_POST_QUERY_EN;
        const data = await client.fetch(query, { slug });
        console.log("Fetched post:", data);
        setSecurityPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSecurityPost();
  }, [slug, i18n.language]);

  if (loading) return <div>Loading...</div>;
  if (!securityPost) return <div>Post not found</div>;

  const postImageUrl = securityPost.image ? urlFor(securityPost.image).width(720).url() : null;

  return (
    <main className="single-post">
      <Link to="/news" className="back-link">
        {t('news.back_link')}
      </Link>

      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={i18n.language === 'fr' ? securityPost.title_fr : securityPost.title_en}
          className="post-image"
        />
      )}
      <h2>{i18n.language === 'fr' ? securityPost.title_fr : securityPost.title_en}</h2>
      <div className="post-content">
        <p className="post-date">Published: {new Date(securityPost.publishedAt).toLocaleDateString()}</p>
        {i18n.language === 'fr' ? (
          securityPost.body_fr && <PortableText value={securityPost.body_fr} />
        ) : (
          securityPost.body_en && <PortableText value={securityPost.body_en} />
        )}
      </div>
    </main>
  );
}
