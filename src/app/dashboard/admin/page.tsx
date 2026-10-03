'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LeftNavbar from '@/layouts/LeftNavbar';
import BottomNav from '@/layouts/BottomNav';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [tab, setTab] = useState<'users' | 'posts'>('users');
  const [checkedAdmin, setCheckedAdmin] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return router.push('/login');

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    } catch {
      router.push('/login');
      return;
    }

    setCheckedAdmin(true);
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://blog-backend-0ieo.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setUsers([]);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://blog-backend-0ieo.onrender.com/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : data.blogs || []);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      setPosts([]);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    const res = await fetch(`https://blog-backend-0ieo.onrender.com/api/delete/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchUsers();
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`https://blog-backend-0ieo.onrender.com/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchPosts();
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`https://blog-backend-0ieo.onrender.com/api/blogs/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchPosts();
  };

  if (!checkedAdmin) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <LeftNavbar/>

      <main className="flex-1 bg-slate-700 overflow-x-auto p-4 pb-24 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-600/60 rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-200">Total Users</p>
            <p className="text-2xl font-bold text-gray-100">{users.length}</p>
          </div>
          <div className="bg-slate-600/60 rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-200">Total Posts</p>
            <p className="text-2xl font-bold text-gray-100">{posts.length}</p>
          </div>
          <div className="bg-slate-600/60 rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-200">Pending Review</p>
            <p className="text-2xl font-bold text-gray-100">
              {posts.filter(p => (p.status || 'pending') === 'pending').length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'users' ? 'bg-cyan-400 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Users
          </button>
          <button
            onClick={() => setTab('posts')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'posts' ? 'bg-cyan-400 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Posts
          </button>
        </div>

        {tab === 'users' && (
          <div className="bg-slate-600/60 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-cyan-200 text-left text-white">
                    <th className="p-2 font-medium">Name</th>
                    <th className="p-2 font-medium">Email</th>
                    <th className="p-2 font-medium">Role</th>
                    <th className="p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-800">{u.name}</td>
                      <td className="p-2 text-white">{u.email}</td>
                      <td className="p-2">
                        <span className={`rounded-sm px-2 py-1 text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 px-3 py-2' : 'bg-gray-100 text-gray-600 px-3 py-2'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-2">
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u._id)} className="bg-red-500 px-3 py-2 rounded-sm text-white hover:bg-red-600 text-xs font-semibold">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={4} className="p-6 text-center text-white">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'posts' && (
          <div className="bg-slate-600/60 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">All Posts</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-cyan-200 text-left text-gray-200">
                    <th className="p-2 font-medium">Image</th>
                    <th className="p-2 font-medium">Title</th>
                    <th className="p-2 font-medium">Author</th>
                    <th className="p-2 font-medium">Posted By</th>
                    <th className="p-2 font-medium">Status</th>
                    <th className="p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post: any) => (
                    <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2"><img src={post.image} width={50} className="rounded-md object-cover h-10 w-10" /></td>
                      <td className="p-2 font-medium text-gray-200">{post.title}</td>
                      <td className="p-2 text-gray-200">{post.author}</td>
                      <td className="p-2 text-gray-200">{post.createdBy?.name || post.createdBy?.email || '—'}</td>
                      <td className="p-2">
                        <select
                          value={post.status || 'pending'}
                          onChange={e => handleStatusChange(post._id, e.target.value)}
                          className={`rounded-full px-2 py-1 text-xs font-semibold border-0 outline-none ${
                            (post.status || 'pending') === 'active' ? 'bg-green-100 text-green-700 px-3 py-2 rounded-sm' : 'bg-amber-100 text-amber-700 px-3 py-2'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <button onClick={() => handleDeletePost(post._id)} className="bg-red-500 px-3 py-2 rounded-sm text-white hover:bg-red-600 text-xs font-semibold">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-gray-400">No posts found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <BottomNav/>
    </div>
  );
}