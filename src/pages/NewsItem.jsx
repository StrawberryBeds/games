import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { client } from "../sanity";
import imageUrlBuilder from "@sanity/image-url";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export default function SinglePost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await client.fetch(POST_QUERY, { slug });
        console.log("Fetched post:", data);
        console.log("Slug from URL:", slug);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

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
          alt={post.title}
          className="post-image"
          width="550"
          height="310"
        />
      )}
      <h1 className="post-title">{post.title}</h1>
      <div className="post-content">
        <p className="post-date">Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {post.body && <PortableText value={post.body} />}
      </div>
    </main>
  );
}
