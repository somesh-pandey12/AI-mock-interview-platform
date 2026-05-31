import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api';

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Temporary user profile
  const currentDevUser = {
    id: "665a3b934fd2cb295c9a1234",
    name: "Somesh Pandey",
    pic: "https://api.dicebear.com/7.x/bottts/svg?seed=Somesh"
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await API.get('/api/forum');
      setPosts(response.data);
    } catch (error) {
      console.error("Error connecting to forum endpoints", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create thread
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    try {
      await API.post('/api/forum/create', {
        userId: currentDevUser.id,
        authorName: currentDevUser.name,
        authorPic: currentDevUser.pic,
        title,
        content,
        tags
      });

      setTitle("");
      setContent("");
      setTags("");

      fetchPosts();
    } catch (error) {
      console.error("Failed to post thread", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote thread
  const handleUpvote = async (postId) => {
    try {
      const response = await API.post(
        `/api/forum/${postId}/upvote`,
        {
          userId: currentDevUser.id
        }
      );

      setPosts(
        posts.map((p) =>
          p._id === postId ? response.data : p
        )
      );
    } catch (error) {
      console.error("Upvote error transaction", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <header className="mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Community Discussion Forum
          </h2>

          <p className="text-sm text-slate-500">
            Share LeetCode patterns, discuss complex system
            architecture edge cases, or review interview
            scoring guidelines.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-6">
            {posts.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-400 font-medium">
                No discussions started yet. Be the first to
                start a thread!
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex gap-4 items-start"
                >
                  {/* Upvote */}
                  <button
                    onClick={() => handleUpvote(post._id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      post.upvotes?.includes(
                        currentDevUser.id
                      )
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <span className="text-sm font-bold">
                      ▲
                    </span>

                    <span className="text-xs font-bold mt-1">
                      {post.upvotes?.length || 0}
                    </span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <img
                        src={
                          post.authorPic ||
                          "https://api.dicebear.com/7.x/bottts/svg"
                        }
                        alt="avatar"
                        className="w-5 h-5 rounded-full bg-slate-100"
                      />

                      <span className="font-semibold text-slate-600">
                        {post.authorName}
                      </span>

                      <span>•</span>

                      <span>
                        {new Date(
                          post.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-800">
                      {post.title}
                    </h4>

                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create Thread */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit space-y-4">
            <h3 className="font-bold text-slate-800 border-b pb-2 border-slate-100">
              Start a New Thread
            </h3>

            <form
              onSubmit={handlePostSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Topic Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g., C++ Vectors memory allocation query"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Discussion Content
                </label>

                <textarea
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder="Describe your question or share your experience here..."
                  rows={5}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Tags (comma separated)
                </label>

                <input
                  type="text"
                  value={tags}
                  onChange={(e) =>
                    setTags(e.target.value)
                  }
                  placeholder="e.g., cpp, leetcode, mern"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !title.trim() ||
                  !content.trim()
                }
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-all text-sm shadow flex items-center justify-center"
              >
                {isSubmitting
                  ? "Publishing thread..."
                  : "🚀 Publish Thread"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}