import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { client } from "../sanity";
import imageUrlBuilder from "@sanity/image-url";
import { useTranslation } from "react-i18next";

const POST_QUERY_EN = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title_en,
  body_en,
  publishedAt,
  image
}`;

const POST_QUERY_FR = `*[_type == "post" && slug.current == $slug][0] {
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

export default function SinglePost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const query = i18n.language === 'fr' ? POST_QUERY_FR : POST_QUERY_EN;
        const data = await client.fetch(query, { slug });
        console.log("Fetched post:", data);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, i18n.language]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  const postImageUrl = post.image ? urlFor(post.image).width(550).height(310).url() : null;

  return (
    <main className="single-post">
      <Link to="/news" className="back-link">
        ← Back to posts
      </Link>
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={i18n.language === 'fr' ? post.title_fr : post.title_en}
          className="post-image"
          width="550"
          height="310"
        />
      )}
      <h2>{i18n.language === 'fr' ? post.title_fr : post.title_en}</h2>
      <div className="post-content">
        <p className="post-date">Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {i18n.language === 'fr' ? (
          post.body_fr && <PortableText value={post.body_fr} />
        ) : (
          post.body_en && <PortableText value={post.body_en} />
        )}
      </div>
    </main>
  );
}
