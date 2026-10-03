// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/layouts/LeftNavbar";
import BottomNav from "@/layouts/BottomNav";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("general");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return router.push('/login');
    fetchPosts();

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserName(payload.name || payload.email || '');
      setIsAdmin(payload.role === 'admin');
    } catch {
      setUserName('');
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://blog-backend-0ieo.onrender.com/api/blogs?mine=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : data.blogs || data.data || []);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setPosts([]);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAuthor("");
    setImageFile(null);
    setEditingId(null);
  };

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("category", category);
    if (imageFile) formData.append("image", imageFile);

    const url = editingId
      ? `https://blog-backend-0ieo.onrender.com/api/blogs/${editingId}`
      : "https://blog-backend-0ieo.onrender.com/api/blogs";

    try {
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        resetForm();
        setShowForm(false);
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to save post", err);
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditingId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setCategory(post.category || "general");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`https://blog-backend-0ieo.onrender.com/api/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchPosts();
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`https://blog-backend-0ieo.onrender.com/api/blogs/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchPosts();
  };

  const filteredPosts = posts.filter((post) => {
    const matchesName = post.author
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesDate = dateFilter
      ? new Date(post.createdAt).toISOString().slice(0, 10) === dateFilter
      : true;
    return matchesName && matchesDate;
  });

  const totalPosts = posts.length;
  const activeCount = posts.filter((p) => p.status === "active").length;
  const pendingCount = posts.filter(
    (p) => (p.status || "pending") === "pending",
  ).length;

  return (

<div className="flex flex-col md:flex-row min-h-screen bg-linear-to-r from-cyan-70 via-cyan-350 to-cyan-30">
      <DashboardSidebar />

      <main className="flex-1 overflow-x-auto p-4 bg-slate-800 sm:p-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500">
              Dashboard
            </h1>
            {userName && (
              <p className="text-sm text-cyan-650 mt-1">
                Welcome back, {userName}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) resetForm();
            }}
            className="bg-cyan-500 hover:bg-cyan-300 md:bg-cyan-500 md:hover:bg-cyan-800 text-white px-4 py-2.5 rounded-lg font-semibold w-full sm:w-auto"
          >
            {showForm ? "Close" : "+ New Post"}
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-slate-800/40 rounded-xl shadow-sm p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-600 flex items-center justify-center text-cyan-500">
              <i className="fa-solid fa-file-alt"></i>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Posts</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{totalPosts}</p>
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-xl shadow-sm p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-600 flex items-center justify-center text-cyan-500">
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Active</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{activeCount}</p>
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-xl shadow-sm p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-600 flex items-center justify-center text-cyan-500">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Pending</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Post form, toggled */}
        {showForm && (
          <form
            onSubmit={handlePost}
            className="bg-slate-400 rounded-xl shadow-sm p-5 flex flex-col gap-3 mb-6"
            autoComplete="off"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {editingId ? "Edit Post" : "New Post"}
            </h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 p-2 text-sm"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              required
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 p-2 text-sm"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              required
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 p-2 text-sm"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 p-2 text-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required={!editingId}
              className="text-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={posting}
                className="bg-purple-700 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white p-2 rounded-lg flex-1 font-semibold flex items-center justify-center gap-2"
              >
                {posting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    {editingId ? "Updating..." : "Posting..."}
                  </>
                ) : (
                  editingId ? "Update" : "Post"
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={posting}
                  className="border border-gray-300 p-2 rounded-lg disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* All Posts heading + search, shared across mobile/desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800">All Posts</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search posts..."
              className="border border-gray-200 rounded-lg outline-none focus:border-purple-400 px-3 py-2 text-sm w-full sm:w-56"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="hidden sm:block border border-gray-200 rounded-lg outline-none focus:border-purple-400 px-3 py-2 text-sm"
            />
            {(searchName || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchName("");
                  setDateFilter("");
                }}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile: card list */}
        <div className="flex flex-col gap-3 sm:hidden">
          {filteredPosts.map((post: any) => (
            <div key={post._id} className="bg-white rounded-xl shadow-sm p-3">
              <div className="flex gap-3 items-start">
                <img
                  src={post.image}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-800 truncate">{post.title}</h3>
                    {isAdmin ? (
                      <select
                        value={post.status || "pending"}
                        onChange={(e) => handleStatusChange(post._id, e.target.value)}
                        className={`rounded-full px-2 py-1 text-xs font-semibold border-0 outline-none shrink-0 ${
                          (post.status || "pending") === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                      </select>
                    ) : (
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold shrink-0 ${
                          (post.status || "pending") === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <i className="fa-solid fa-circle text-[6px]"></i>
                        {(post.status || "pending") === "active" ? "Active" : "Pending"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {post.author} ·{" "}
                    {post.createdAt &&
                      new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(post)}
                  className="flex-1 flex items-center justify-center gap-1 border border-orange-400 text-orange-500 font-semibold text-sm py-2 rounded-lg"
                >
                  <i className="fa-solid fa-pen"></i> Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="flex-1 flex items-center justify-center gap-1 border border-red-400 text-red-500 font-semibold text-sm py-2 rounded-lg"
                >
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-400 py-6">No posts found.</p>
          )}
        </div>

        {/* Desktop: table, unchanged */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm p-5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="p-2 font-medium">Image</th>
                  <th className="p-2 font-medium">Title</th>
                  <th className="p-2 font-medium">Author</th>
                  <th className="p-2 font-medium">Date</th>
                  <th className="p-2 font-medium">Status</th>
                  <th className="p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post: any) => (
                  <tr
                    key={post._id}
                    className="border-b border-gray-100 align-middle hover:bg-gray-50"
                  >
                    <td className="p-2">
                      <img
                        src={post.image}
                        width={50}
                        className="rounded-md object-cover h-10 w-10"
                      />
                    </td>
                    <td className="p-2 font-medium text-gray-800">
                      {post.title}
                    </td>
                    <td className="p-2 text-gray-600">{post.author}</td>
                    <td className="p-2 text-gray-600">
                      {post.createdAt &&
                        new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                    </td>
                    <td className="p-2">
                      {isAdmin ? (
                        <select
                          value={post.status || "pending"}
                          onChange={(e) =>
                            handleStatusChange(post._id, e.target.value)
                          }
                          className={`rounded-sm px-2 py-1 text-xs font-semibold border-0 outline-none ${
                            (post.status || "pending") === "active"
                              ? "bg-green-100 px-3 py-2 rounded-sm text-green-700"
                              : "bg-amber-100 px-3 py-2 rounded-sm text-amber-700"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                        </select>
                      ) : (
                        <span
                          className={`rounded-sm px-2 py-1 text-xs font-semibold ${
                            (post.status || "pending") === "active"
                              ? "bg-green-100 px-3 py-2 rounded-sm text-green-700"
                              : "bg-amber-100 px-3 py-2 rounded-sm text-amber-700"
                          }`}
                        >
                          {(post.status || "pending") === "active"
                            ? "Active"
                            : "Pending review"}
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="bg-blue-500 px-3 py-2 rounded-sm text-white hover:bg-blue-600 text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="bg-red-500 px-3 py-2 rounded-sm text-white hover:bg-red-600 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-400">
                      No posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}