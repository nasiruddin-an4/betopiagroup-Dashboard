"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Newspaper,
  ExternalLink,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import FileUpload from "../../components/FileUpload";
import AdminSidebar from "../../components/AdminSidebar";
import { showAlert, showConfirm } from "../../utils/alert";

const EMPTY_FORM = {
  title: "",
  summary: "",
  image: "",
  date: new Date().toISOString().split("T")[0],
  category: "General",
  externalLink: "",
};

const CATEGORIES = [
  "General",
  "Technology",
  "Business",
  "Innovation",
  "Events",
  "Press Release",
  "Awards",
  "Partnerships",
];

export default function ManageNewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal / form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null = create
  const [form, setForm] = useState(EMPTY_FORM);

  const getArticleId = (item) => {
    if (!item) return "";
    const idVal = item._id || item.id;
    if (!idVal) return "";

    const processValue = (v) => {
      if (typeof v === "string") {
        if (v === "[object Object]" || v.includes("[object")) return null;
        return v;
      }
      if (v && typeof v === "object") {
        if (v.$oid) return String(v.$oid);
        if (v.toHexString) return v.toHexString();

        const findHexInObj = (obj, depth = 0) => {
          if (depth > 3) return null;
          for (const k in obj) {
            const val = obj[k];
            if (typeof val === "string" && /^[0-9a-fA-F]{24}$/.test(val))
              return val;
            if (val && typeof val === "object") {
              const found = findHexInObj(val, depth + 1);
              if (found) return found;
            }
          }
          return null;
        };

        const foundHex = findHexInObj(v);
        if (foundHex) return foundHex;

        if (v.toString && typeof v.toString === "function") {
          const s = v.toString();
          if (s && s !== "[object Object]" && !s.includes("[object")) return s;
        }
      }
      return null;
    };

    const finalId =
      processValue(idVal) ||
      processValue(item.id) ||
      processValue(item.articleId) ||
      "";
    return String(finalId);
  };

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch all news ──────────────────────────────────────────────────────────
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setArticles([]);
        return;
      }
      if (data && Array.isArray(data)) setArticles(data);
      else if (data && data.success && Array.isArray(data.data))
        setArticles(data.data);
      else setArticles([]);
    } catch (err) {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ── Open modal ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (article) => {
    setEditId(getArticleId(article));
    setForm({
      title: article.title || "",
      summary: article.summary || "",
      image: article.image || "",
      date: article.date || new Date().toISOString().split("T")[0],
      category: article.category || "General",
      externalLink: article.externalLink || "",
    });
    setError("");
    setModalOpen(true);
  };

  // ── Save (create or update) ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = editId ? `/api/admin/news/${editId}` : "/api/admin/news";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      await showAlert(
        "Success",
        `Article ${editId ? "updated" : "created"} successfully!`,
      );
      setModalOpen(false);
      await fetchNews();
    } catch (err) {
      await showAlert("Error", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteClick = async (id) => {
    const result = await showConfirm(
      "Delete Article?",
      "This action cannot be undone. This article will be permanently removed.",
    );
    if (!result.isConfirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      await showAlert("Deleted", "Article deleted successfully!");
      await fetchNews();
    } catch (err) {
      await showAlert("Error", err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <AdminSidebar>
      <div className="mx-auto pb-10 px-4">
        {/* Header */}
        <div className="mb-8 py-6 flex justify-between items-center  backdrop-blur-md -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200/50">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Manage News
            </h1>
            <p className="text-xs text-gray-400">
              Create, edit and delete news articles
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-normal shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>New Article</span>
          </button>
        </div>

        {/* Global error */}
        {error && !modalOpen && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Article list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">
              No news articles yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article, index) => {
              const articleId = getArticleId(article);
              return (
                <div
                  key={articleId || `article-${index}`}
                  className="bg-white border border-gray-100 rounded-xl p-6 flex gap-6 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center border border-gray-100">
                      <Newspaper className="w-10 h-10 text-gray-300" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-bold text-gray-900 truncate">
                        {article.title}
                      </h3>
                      <span className="shrink-0 text-xs font-normal bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">
                        {article.category}
                      </span>
                    </div>
                    {article.summary && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{article.date}</span>
                      {article.author && <span>By {article.author}</span>}
                      {article.externalLink && (
                        <a
                          href={article.externalLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Link
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (!articleId) {
                          setError(
                            "This article has an invalid ID. Refresh and try again.",
                          );
                          return;
                        }
                        openEdit(article);
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(articleId)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-100 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editId ? "Edit Article" : "New Article"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-6 py-4 text-sm font-normal flex items-center gap-3">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-normal text-gray-400 mb-2 uppercase tracking-wider">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="Article title"
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-normal text-base shadow-xs"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-xs font-normal text-gray-400 mb-2 uppercase tracking-wider">
                    Summary
                  </label>
                  <textarea
                    value={form.summary}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, summary: e.target.value }))
                    }
                    rows={3}
                    placeholder="Short description of the article"
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none font-normal text-base shadow-xs"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-xs font-normal text-gray-400 mb-2 uppercase tracking-wider">
                    Cover Image
                  </label>
                  <FileUpload
                    value={form.image}
                    onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                    folder="news"
                    accept="image/*"
                    type="image"
                    label="Upload Cover Image"
                  />
                </div>

                {/* Date + Category row */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-normal text-gray-400 mb-2 uppercase tracking-wider">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date: e.target.value }))
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-normal text-base shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-400 mb-2 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-normal text-base shadow-xs"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* External link */}
                <div>
                  <label className="block text-xs font-normal text-gray-400 mb-2 uppercase tracking-wider">
                    External Link (optional)
                  </label>
                  <input
                    type="url"
                    value={form.externalLink}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, externalLink: e.target.value }))
                    }
                    placeholder="https://example.com/article"
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-normal text-base shadow-xs"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-50 ">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 font-normal transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-normal shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>
                    {saving
                      ? "Saving..."
                      : editId
                        ? "Update Article"
                        : "Create Article"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal removed - using SweetAlert2 instead */}
      </div>
    </AdminSidebar>
  );
}
