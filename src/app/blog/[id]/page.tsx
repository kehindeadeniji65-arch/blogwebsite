// app/blog/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/layouts/navbar';

export default function BlogDetail() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/blogs/${params.id}`);
      const data = await res.json();
      setPost(data.blog || null);
    } catch (err) {
      console.error('Failed to fetch post', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;
  if (!post) return <p className="text-center py-20 text-gray-500">Post not found.</p>;

  return (
    <div>
      <Navbar/>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => router.back()} className="mb-6 text-purple-800 font-semibold hover:underline">
          ← Back
        </button>

        {post.image && (
          <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-lg mb-6" />
        )}

        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          By {post.author} · {post.createdAt && new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>
    </div>
  );
}