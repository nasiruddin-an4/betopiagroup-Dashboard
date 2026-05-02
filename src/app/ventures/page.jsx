"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  Globe,
  Search,
  Building2,
  Filter,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import FileUpload from "../components/FileUpload";

export default function VenturesRegistryPage() {
  const [ventures, setVentures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Flagship Concerns",
    "Industrial Concerns",
    "Other Concerns",
    "General",
  ];

  useEffect(() => {
    fetchVentures();
  }, []);

  const fetchVentures = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ventures");
      if (!res.ok) {
        throw new Error(`Failed to load ventures (${res.status})`);
      }
      const data = await res.json();
      if (data.success) {
        setVentures(data.data);
      } else {
        throw new Error(data.error || "Failed to load ventures");
      }
    } catch (err) {
      console.error("Failed to fetch ventures:", err);
      showMessage("error", err.message || "Failed to load ventures");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleLogoSave = async (ventureId, logoUrl) => {
    try {
      const venture = ventures.find(
        (item) => item._id === ventureId || item.id === ventureId,
      );
      if (!venture) {
        throw new Error("Venture not found");
      }

      const body = {
        ...venture,
        logoUrl: logoUrl,
      };

      const res = await fetch("/api/ventures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        throw new Error(
          errorPayload.error || `Failed to update venture (${res.status})`,
        );
      }

      const data = await res.json().catch(() => ({}));
      if (!data.success) {
        throw new Error(data.error || "Failed to update venture");
      }

      setVentures((prev) =>
        prev.map((item) =>
          item._id === ventureId || item.id === ventureId
            ? { ...item, logoUrl: logoUrl }
            : item,
        ),
      );
      showMessage("success", `Logo saved for ${venture.name}`);
    } catch (err) {
      console.error("Failed to save logo:", err);
      showMessage("error", err.message || "Failed to save logo");
    }
  };

  const filteredVentures = ventures.filter((v) => {
    const matchesSearch = v.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminSidebar>
      <div className="mx-auto pb-10 px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              <Briefcase className="text-[#f79549]" />
              Venture Registry
            </h1>
            <p className="text-gray-500 text-sm font-normal">
              Manage the global portfolio of Betopia Group concerns and partners
            </p>
          </div>
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-400 rounded-xl font-bold transition-all shadow-lg cursor-not-allowed"
          >
            <Plus size={20} />
            Venture names are managed in the database
          </button>
        </div>

        {/* Status Messages */}
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
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Filters and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Portfolio Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">
                    {ventures.length}
                  </p>
                  <p className="text-xs text-gray-500">Total Ventures</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(ventures.map((v) => v.category)).size}
                  </p>
                  <p className="text-xs text-gray-500">Categories</p>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Filter size={14} />
                Filter by Group
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-[#f79549] text-white shadow-md"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === cat ? "bg-white/20" : "bg-gray-200 text-gray-500"}`}
                    >
                      {cat === "All"
                        ? ventures.length
                        : ventures.filter((v) => v.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Venture List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search ventures by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#f79549] focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
              />
            </div>

            {/* List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <Loader2 className="w-10 h-10 animate-spin text-[#f79549] mb-4" />
                <p className="text-gray-400 font-medium">
                  Synchronizing Portfolio...
                </p>
              </div>
            ) : filteredVentures.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No ventures found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="text-[#f79549] font-bold mt-2 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredVentures.map((venture) => (
                  <div
                    key={venture._id}
                    className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Left Side: Logo and Quick Info */}
                      <div className="w-full md:w-48 flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 group-hover:border-orange-100 transition-colors shadow-inner">
                          {venture.logoUrl ? (
                            <img
                              src={venture.logoUrl}
                              alt={venture.name}
                              className="w-full h-full object-contain p-4"
                            />
                          ) : (
                            <Building2 size={40} className="text-gray-200" />
                          )}
                        </div>
                        <FileUpload
                          label="Change Logo"
                          value={venture.logoUrl || ""}
                          onChange={(url) =>
                            handleLogoSave(venture._id || venture.id, url)
                          }
                          folder="ventures"
                          type="image"
                        />
                      </div>

                      {/* Right Side: Detailed Info */}
                      <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-1">
                              {venture.name}
                            </h4>
                            <div className="flex items-center gap-3">
                              <span className="inline-block px-3 py-1 bg-orange-50 text-[#f79549] text-[11px] font-bold rounded-lg uppercase tracking-wider">
                                {venture.category}
                              </span>
                              {venture.websiteUrl && (
                                <a
                                  href={venture.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs text-blue-500 hover:underline font-medium"
                                >
                                  <Globe size={14} />
                                  {new URL(venture.websiteUrl).hostname}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description and Metadata */}
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                              Description
                            </label>
                            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100/50 italic">
                              {venture.description || "No description provided."}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex gap-4">
                              <div className="text-[10px] text-gray-400">
                                <span className="font-bold">ID:</span> {venture._id.substring(0, 8)}...
                              </div>
                              <div className="text-[10px] text-gray-400">
                                <span className="font-bold">ORDER:</span> {venture.order ?? 0}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${venture.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                 {venture.isActive ? 'Active' : 'Inactive'}
                               </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
