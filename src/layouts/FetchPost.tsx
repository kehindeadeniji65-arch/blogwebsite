// app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/layouts/navbar';
import Footer from '@/layouts/Footer';

export default function FetchPost() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/blogs?status=active");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.blogs || [];
      setPosts(list.slice(0, 4));
    } catch (err) {
      console.error('Failed to fetch posts', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Lifestyle", icon: "fa-solid fa-leaf" },
    { name: "Travel", icon: "fa-solid fa-compass" },
    { name: "Education", icon: "fa-solid fa-graduation-cap" },
    { name: "Culture", icon: "fa-solid fa-landmark" },
    { name: "Inspiration", icon: "fa-solid fa-sparkles" },
  ];

  return (
    <div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
       
      </div>

      {/* Latest Posts */}
      <div id="latest-posts" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">Latest Posts</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No blogs posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {posts.map((post: any) => (
              <Link
                href={`/blog/${post._id}`}
                key={post._id}
                className="flex flex-row sm:flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-28 h-24 sm:w-full sm:h-48 object-cover shrink-0"
                  />
                )}
                <div className="p-3 sm:p-4 flex-1 border-l-4 sm:border-l-0 sm:border-t-4 border-black">
                  <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-800">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    by <span className="text-orange-700 font-medium">{post.author}</span> ·{' '}
                    {post.createdAt && new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{post.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Explore by category */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Explore by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-700"
            >
              <i className={`${cat.icon} text-orange-600`}></i>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Why Creativiy Blog */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="bg-purple-50 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Why Creativiy BLOG?</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              We share thoughtful stories, fresh perspectives, and creative ideas that spark{' '}
              <span className="text-orange-700 font-semibold">inspiration</span>, encourage{' '}
              <span className="text-orange-700 font-semibold">growth</span>, and connect curious minds.
            </p>
          </div>
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-orange-200/60 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-seedling text-5xl text-orange-600"></i>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-6xl mx-auto px-4 pb-14">
        <div className="border border-orange-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 bg-white">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-envelope text-orange-700"></i>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-lg text-gray-800">Stay Inspired</h3>
            <p className="text-sm text-gray-500">Get the best stories delivered to your inbox every week.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-orange-400 w-full sm:w-64"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-800 text-white font-semibold px-5 py-2 rounded-lg text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}