import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { client } from "../sanity";
import imageUrlBuilder from "@sanity/image-url";
import { useTranslation } from "react-i18next";

const FEATURE_QUERY_EN = `*[_type == "feature" && slug.current == $slug][0] {
  _id,
  title_en,
  body_en,
  publishedAt,
  image
}`;

const FEATURE_QUERY_FR = `*[_type == "feature" && slug.current == $slug][0] {
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
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const query = i18n.language === 'fr' ? FEATURE_QUERY_FR : FEATURE_QUERY_EN;
        const data = await client.fetch(query, { slug });
        console.log("Fetched post:", data);
        setFeature(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeature();
  }, [slug, i18n.language]);

  if (loading) return <div>Loading...</div>;
  if (!feature) return <div>Post not found</div>;

  const postImageUrl = feature.image ? urlFor(feature.image).width(720).url() : null;

  return (
    <main className="single-post">
      <Link to="/feature" className="back-link">
        {t('news.back_link')}
      </Link>

      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={i18n.language === 'fr' ? feature.title_fr : feature.title_en}
          className="post-image"
        />
      )}
      <h2>{i18n.language === 'fr' ? feature.title_fr : feature.title_en}</h2>
      <div className="post-content">
        <p className="post-date">Published: {new Date(feature.publishedAt).toLocaleDateString()}</p>
        {i18n.language === 'fr' ? (
          feature.body_fr && <PortableText value={feature.body_fr} />
        ) : (
          feature.body_en && <PortableText value={feature.body_en} />
        )}
      </div>
    </main>
  );
}
