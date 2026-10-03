// app/dashboard/settings/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/layouts/LeftNavbar';
import BottomNav from '@/layouts/BottomNav';

export default function Settings() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return router.push('/login');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setName(payload.name || '');
      setEmail(payload.email || '');
      setRole(payload.role || '');
    } catch {
      router.push('/login');
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch("https://blog-backend-0ieo.onrender.com/api/profile", {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Update failed");
        return;
      }

      localStorage.setItem('token', data.token);
      setCurrentPassword('');
      setNewPassword('');
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      const res = await fetch("https://blog-backend-0ieo.onrender.com/api/profile", {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        localStorage.removeItem('token');
        router.push('/');
      }
    } catch (err) {
      setError("Failed to delete account");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-800">
      <DashboardSidebar />

      <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6">Settings</h1>

        <div className="bg-slate-600/60 rounded-xl shadow-sm p-5 mb-6">
          <p className="text-sm text-gray-500 mb-1">Role</p>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {role}
          </span>
        </div>

        <form onSubmit={handleUpdate} className="bg-slate-600/60 rounded-xl shadow-sm p-5 flex flex-col gap-3">
          <h2 className="text-lg font-bold text-cyan-400 mb-1">Profile</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 p-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 p-2 text-sm"
            />
          </div>

          <hr className="my-2" />

          <h2 className="text-lg font-bold text-cyan-400 mb-1">Change Password</h2>
          <p className="text-xs text-gray-400 -mt-2 mb-1">Leave blank if you don't want to change it.</p>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 p-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 p-2 text-sm"
            />
          </div>

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="bg-cyan-500 hover:bg-purple-800 text-white p-2 rounded-lg font-semibold mt-2">
            Save Changes
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-sm p-5 mt-6 border border-red-100">
          <h2 className="text-lg font-bold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-300 mb-3">Deleting your account is permanent and cannot be undone.</p>
          <button
            onClick={handleDeleteAccount}
            className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Delete My Account
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}