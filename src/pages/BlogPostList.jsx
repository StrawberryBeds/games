import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // or use <a> tags if not using react-router
import { client } from "../sanity"; // Adjust the import path as needed

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

export default function BlogPostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await client.fetch(POSTS_QUERY);
      console.log("Fetched posts:", data);
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link to={`/news/${post.slug.current}`}>
            {console.log(`/news/${post.slug.current}`)}

              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
