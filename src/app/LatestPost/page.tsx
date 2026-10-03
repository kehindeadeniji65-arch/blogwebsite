// app/blog/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/layouts/navbar';
import Footer from '@/layouts/Footer';

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://blog-backend-0ieo.onrender.com/api/blogs?status=active");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : data.blogs || []);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar/>

      <div className="max-w-6xl mx-auto px-4 py-10 bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">All Posts</h1>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title or author"
            className="border text-gray-400 border-cyan-200 rounded-lg outline-none focus:border-cyan-400 px-4 py-2 text-sm w-full sm:w-72"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {filteredPosts.map((post: any) => (
              <Link
                href={`/blog/${post._id}`}
                key={post._id}
                className="flex flex-row sm:flex-col bg-slate-900/60 border border-cyan-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-28 h-24 sm:w-full sm:h-48 object-cover shrink-0"
                  />
                )}
                <div className="p-3 sm:p-4 flex-1 border-l-4 sm:border-l-0 sm:border-t-4 border-black">
                  <h3 className="font-bold text-base sm:text-lg mb-1 text-white">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">
                    by <span className="text-cyan-500 font-medium">{post.author}</span> ·{' '}
                    {post.createdAt && new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs sm:text-sm text-white line-clamp-2">{post.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer/>
    </div>
  );
}