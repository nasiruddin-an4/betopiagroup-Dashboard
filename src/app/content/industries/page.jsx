"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import {
  Save,
  Building2,
  BarChart3,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import CardManager from "../../components/CardManager";

export default function IndustriesContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Hero Section
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");

  // Industries Grid Section
  const [industriesTitle, setIndustriesTitle] = useState("");
  const [industriesDescription, setIndustriesDescription] = useState("");
  const [industries, setIndustries] = useState([]);

  // Excellence Section
  const [excellenceTitle, setExcellenceTitle] = useState("");
  const [excellenceDescription, setExcellenceDescription] = useState("");
  const [excellenceFeatures, setExcellenceFeatures] = useState([]);

  const updateIndustry = (index, field, value) => {
    const newIndustries = [...industries];
    newIndustries[index][field] = value;
    setIndustries(newIndustries);
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...excellenceFeatures];
    newFeatures[index][field] = value;
    setExcellenceFeatures(newFeatures);
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("industries");

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

          if (key === "hero_title") setHeroTitle(parsedValue);
          else if (key === "hero_description") setHeroDescription(parsedValue);
          else if (key === "industries_title") setIndustriesTitle(parsedValue);
          else if (key === "industries_description")
            setIndustriesDescription(parsedValue);
          else if (key === "industries") setIndustries(parsedValue);
          else if (key === "excellence_title") setExcellenceTitle(parsedValue);
          else if (key === "excellence_description")
            setExcellenceDescription(parsedValue);
          else if (key === "excellence_features") setExcellenceFeatures(parsedValue);
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
      await savePageData("industries", data);
      setMessage({
        type: "success",
        text: `${section} saved successfully!`,
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to save. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetPage = async () => {
    if (!confirm("Reset all saved content for Industries? This cannot be undone."))
      return;
    setResetting(true);
    try {
      await deletePageData("industries");
      setMessage({ type: "success", text: "Industries reset to defaults!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      window.location.reload();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Reset failed" });
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 text-xl animate-pulse font-medium">
            Loading Industries...
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className=" mx-auto pb-20 px-4">
        {/* Sticky Header */}
        <div className="mb-8 sticky top-0 z-20 py-6 flex justify-between items-center -mx-4 px-4 sm:mx-0 sm:px-0">
          <div>
            <h1 className="text-3xl font-normal text-gray-500 mb-2">
              Industries Content
            </h1>
            <p className="text-gray-400 text-sm">
              Manage hero lines and industry vertical cards
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() =>
                saveSection("Industries Page", {
                  hero_title: heroTitle,
                  hero_description: heroDescription,
                  industries_title: industriesTitle,
                  industries_description: industriesDescription,
                  industries: industries,
                  excellence_title: excellenceTitle,
                  excellence_description: excellenceDescription,
                  excellence_features: excellenceFeatures,
                })
              }
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-normal shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={20} />
              <span>{saving ? "Updating..." : "Update All Changes"}</span>
            </button>
            <button
              onClick={resetPage}
              disabled={resetting}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>{resetting ? "Resetting..." : "Reset Defaults"}</span>
            </button>
          </div>

          {/* Toast Message */}
          {message.text && (
            <div
              className={`fixed top-24 right-8 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 ${
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
        <div className="mx-auto space-y-8">
          {/* 1. Hero Section */}
          <section
            id="hero"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-normal text-lg">
                  1
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="text-orange-500" size={22} />
                  Hero Section
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Introduction
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-2xl font-normal focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Hero Description
                  </label>
                  <textarea
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-orange-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Hero Section", {
                      hero_title: heroTitle,
                      hero_description: heroDescription,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Hero"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Industries Grid */}
          <section
            id="industries"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-normal text-lg">
                  2
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="text-blue-500" size={22} />
                  Industries Grid
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Domain Expertise
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={industriesTitle}
                    onChange={(e) => setIndustriesTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Section Description
                  </label>
                  <textarea
                    value={industriesDescription}
                    onChange={(e) => setIndustriesDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {industries.map((industry, index) => (
                  <div
                    key={industry.id || index}
                    className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-normal text-blue-600 uppercase tracking-widest">
                        Card {index + 1}
                      </label>
                      <span className="text-[10px] text-gray-400 font-normal bg-white px-2 py-1 rounded-lg shadow-xs">
                        {industry.icon}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={industry.title}
                      onChange={(e) =>
                        updateIndustry(index, "title", e.target.value)
                      }
                      placeholder="Title"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <textarea
                      value={industry.description}
                      onChange={(e) =>
                        updateIndustry(index, "description", e.target.value)
                      }
                      placeholder="Description"
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={industries}
                  onChange={setIndustries}
                  cardTemplate={{
                    id: Date.now(),
                    title: "",
                    description: "",
                    icon: "Building2",
                  }}
                  title="Industry Verticals"
                  folder="industries"
                />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Industries Grid", {
                      industries_title: industriesTitle,
                      industries_description: industriesDescription,
                      industries: industries,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Grid"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. Industry-Specific Excellence */}
          <section
            id="excellence"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-normal text-lg">
                  3
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="text-purple-500" size={22} />
                  Industry-Specific Excellence
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Value Proposition
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Excellence Title
                  </label>
                  <input
                    type="text"
                    value={excellenceTitle}
                    onChange={(e) => setExcellenceTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Excellence Description
                  </label>
                  <textarea
                    value={excellenceDescription}
                    onChange={(e) => setExcellenceDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {excellenceFeatures.map((feature, index) => (
                  <div
                    key={feature.id || index}
                    className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-normal text-purple-600 uppercase tracking-widest">
                        Feature {index + 1}
                      </label>
                      <span className="text-[10px] text-gray-400 font-normal bg-white px-2 py-1 rounded-lg shadow-xs">
                        {feature.icon || "Zap"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) =>
                        updateFeature(index, "title", e.target.value)
                      }
                      placeholder="Title"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <textarea
                      value={feature.description}
                      onChange={(e) =>
                        updateFeature(index, "description", e.target.value)
                      }
                      placeholder="Description"
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-all resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={excellenceFeatures}
                  onChange={setExcellenceFeatures}
                  cardTemplate={{
                    id: Date.now(),
                    title: "",
                    description: "",
                    icon: "Zap",
                  }}
                  title="Excellence Features"
                  folder="industries"
                />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Excellence Section", {
                      excellence_title: excellenceTitle,
                      excellence_description: excellenceDescription,
                      excellence_features: excellenceFeatures,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Excellence"}</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
