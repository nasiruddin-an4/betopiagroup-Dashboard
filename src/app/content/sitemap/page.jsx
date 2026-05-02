"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import {
  Save,
  Map,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Link as LinkIcon,
  Rocket,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import CardManager from "../../components/CardManager";

export default function SitemapContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Sitemap Sections
  const [sitemapTitle, setSitemapTitle] = useState("Sitemap.");
  const [sitemapDescription, setSitemapDescription] = useState(
    "Navigate through the architectural blueprint of Betopia's digital ecosystem.",
  );
  const [mainLinks, setMainLinks] = useState([]);
  const [legalLinks, setLegalLinks] = useState([]);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("sitemap");

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

          if (key === "sitemap_title") setSitemapTitle(parsedValue);
          else if (key === "sitemap_description")
            setSitemapDescription(parsedValue);
          else if (key === "main_links") setMainLinks(parsedValue);
          else if (key === "legal_links") setLegalLinks(parsedValue);
        });
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (section, data) => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await savePageData("sitemap", data);
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
        "Reset all saved content for Sitemap page? This cannot be undone.",
      )
    )
      return;
    setResetting(true);
    try {
      await deletePageData("sitemap");
      setMessage({ type: "success", text: "Sitemap page reset to defaults!" });
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
            Loading Sitemap CMS...
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
              Sitemap Content
            </h1>
            <p className="text-xs text-gray-400">
              Manage SEO indexing and structural navigation links
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
              <span className="font-semibold">{message.text}</span>
            </div>
          )}
        </div>

        {/* Serial Content Layout */}
        <div className="mx-auto space-y-12">
          {/* 1. Sitemap Hero */}
          <section
            id="hero"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sitemap Intro
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Blueprint
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
                    value={sitemapTitle}
                    onChange={(e) => setSitemapTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={sitemapDescription}
                    onChange={(e) => setSitemapDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Sitemap Intro", {
                      sitemap_title: sitemapTitle,
                      sitemap_description: sitemapDescription,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Header</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Structural Links */}
          <section
            id="links"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Structural Links
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Navigation
              </span>
            </div>

            <div className="p-10 space-y-12">
              <div className="space-y-12">
                <div className="space-y-6">
                  <CardManager
                    cards={mainLinks}
                    onChange={setMainLinks}
                    cardTemplate={{ id: Date.now(), label: "", href: "" }}
                    title="Main Navigation"
                    folder="sitemap"
                  />
                </div>
                <div className="space-y-6">
                  <CardManager
                    cards={legalLinks}
                    onChange={setLegalLinks}
                    cardTemplate={{ id: Date.now(), label: "", href: "" }}
                    title="Legal & Footer"
                    folder="sitemap"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Structural Links", {
                      main_links: mainLinks,
                      legal_links: legalLinks,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Links</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
