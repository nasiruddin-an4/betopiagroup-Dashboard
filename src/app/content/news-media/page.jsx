"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import {
  Save,
  FileText,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  Calendar,
  Tag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Rocket,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const ITEMS_PER_PAGE = 4;

export default function NewsMediaContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Newsroom Hero Section
  const [newsroomTitle, setNewsroomTitle] = useState("The Newsroom.");
  const [newsroomDescription, setNewsroomDescription] = useState(
    "Stay updated with the latest breakthroughs, global milestones, and the visionary narrative of Betopia Group.",
  );

  // 2. News from DB (Read-Only)
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAllContent();
    fetchNewsFromDB();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("news-media");

      if (flatData && Object.keys(flatData).length > 0) {
        Object.entries(flatData).forEach(([key, value]) => {
          let parsedValue = value;
          try {
            if (
              typeof value === "string" &&
              (value.startsWith("{") || value.startsWith("["))
            ) {
              parsedValue = JSON.parse(value);
            }
          } catch (e) {
            console.warn(`Failed to parse ${key}:`, e);
          }

          if (key === "newsroom_title") setNewsroomTitle(parsedValue);
          else if (key === "newsroom_description")
            setNewsroomDescription(parsedValue);
        });
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsFromDB = async () => {
    setArticlesLoading(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(`${origin}/api/news-db`);
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.data)) {
        setArticles(data.data);
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setArticles([]);
    } finally {
      setArticlesLoading(false);
    }
  };

  const saveSection = async (section, data) => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await savePageData("news-media", data);
      setMessage({ type: "success", text: `${section} saved successfully!` });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setMessage({ type: "error", text: error.message || "Failed to save." });
    } finally {
      setSaving(false);
    }
  };

  const resetPage = async () => {
    if (
      !confirm(
        "Reset all saved content for News & Media page? This cannot be undone.",
      )
    )
      return;
    setResetting(true);
    try {
      await deletePageData("news-media");
      setMessage({
        type: "success",
        text: "News & Media page reset to defaults!",
      });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
        window.location.reload();
      }, 2000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Reset failed" });
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 text-xl animate-pulse">
            Loading Newsroom CMS...
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="mx-auto pb-10 px-4">
        {/* Header */}
        <div className="mb-5 flex justify-between items-center -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200/50">
          <div>
            <h1 className="text-3xl font-semibold text-gray-500 mb-2">
              News & Media Content
            </h1>
            <p className="text-xs text-gray-400">
              Manage newsroom messaging and view latest database records
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={resetPage}
              disabled={resetting}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-normal transition-all disabled:opacity-50"
            >
              <RotateCcw size={16} />
              <span>{resetting ? "Resetting..." : "Reset Defaults"}</span>
            </button>
          </div>

          {/* Toast Message */}
          {message.text && (
            <div
              className={`fixed top-24 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 ${
                message.type === "success"
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-normal">{message.text}</span>
            </div>
          )}
        </div>

        {/* Serial Content Layout */}
        <div className="mx-auto space-y-12">
          {/* 1. Newsroom Hero */}
          <section
            id="hero"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Newsroom Hero
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Intro
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={newsroomTitle}
                    onChange={(e) => setNewsroomTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-2xl font-normal focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={newsroomDescription}
                    onChange={(e) => setNewsroomDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Newsroom Hero", {
                      newsroom_title: newsroomTitle,
                      newsroom_description: newsroomDescription,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Newsroom Hero</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Article Feed (Read Only Snapshot) */}
          <section
            id="feed"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Article Feed
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-2 rounded-full uppercase tracking-widest">
                  Read Only Snapshot
                </span>
              </div>
            </div>

            <div className="p-10">
              <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100 mb-8 flex items-start gap-4">
                <Loader2 className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
                <div>
                  <p className="text-orange-800 font-bold text-sm">
                    Synchronized with Database
                  </p>
                  <p className="text-orange-600 text-xs mt-1">
                    These articles are pulled directly from the core NewsDB. To
                    manage individual articles, please use the{" "}
                    <strong className="underline">Manage News</strong> section.
                  </p>
                </div>
              </div>

              {articlesLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                  <p className="text-gray-400 font-medium">
                    Fetching newsroom records...
                  </p>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                  <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">
                    No articles found in database
                  </p>
                </div>
              ) : (
                (() => {
                  const totalPages = Math.ceil(
                    articles.length / ITEMS_PER_PAGE,
                  );
                  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                  const paginatedArticles = articles.slice(
                    startIndex,
                    startIndex + ITEMS_PER_PAGE,
                  );

                  return (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 gap-8">
                        {paginatedArticles.map((article) => (
                          <div
                            key={article._id}
                            className="group bg-gray-50/50 border border-gray-100 rounded-3xl overflow-hidden hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col"
                          >
                            {article.image ? (
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={article.image}
                                  alt=""
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              </div>
                            ) : (
                              <div className="h-48 bg-gray-100 flex items-center justify-center">
                                <FileText className="w-12 h-12 text-gray-300" />
                              </div>
                            )}
                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <Tag size={12} className="text-orange-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {article.category || "General"}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors">
                                {article.title}
                              </h3>
                              <p className="text-gray-500 text-xs line-clamp-3 mb-4 flex-1">
                                {article.summary}
                              </p>
                              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                  {article.date}
                                </span>
                                {article.externalLink && (
                                  <a
                                    href={article.externalLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-white rounded-xl shadow-sm border border-gray-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentPage === 1}
                              className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1),
                                )
                              }
                              disabled={currentPage === totalPages}
                              className="p-3 rounded-2xl bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
