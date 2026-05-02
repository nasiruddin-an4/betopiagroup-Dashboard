"use client";

import { useState, useEffect } from "react";
import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import {
  Save,
  Building2,
  RotateCcw,
  Globe,
  Edit,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import FileUpload from "../../components/FileUpload";
import { showAlert, showConfirm } from "../../utils/alert";

export default function VenturesContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // 1. Hero Section State
  const [heroLineOne, setHeroLineOne] = useState("One Group");
  const [heroLineTwo, setHeroLineTwo] = useState("Multiple Engines of Growth");

  // 2. Global Ventures State
  const [ventures, setVentures] = useState([]);
  const [isEditingVenture, setIsEditingVenture] = useState(null); // ID of venture being edited
  const [isAddingVenture, setIsAddingVenture] = useState(false);
  const [newVenture, setNewVenture] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    category: "General",
    description: "",
    order: 0,
    isActive: true,
  });

  const categories = [
    "Flagship Concerns",
    "Industrial Concerns",
    "Other Concerns",
    "General",
  ];

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);

      // Load Page Data (Hero Lines)
      const flatData = await loadPageData("ventures");
      if (flatData) {
        if (flatData.hero_line_one) setHeroLineOne(flatData.hero_line_one);
        if (flatData.hero_line_two) setHeroLineTwo(flatData.hero_line_two);
      }

      // Load Master Ventures List
      const res = await fetch("/api/ventures");
      const data = await res.json();
      if (data.success) {
        setVentures(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load content:", error);
      showAlert("Load Error", "Failed to connect to database.", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveHeroSection = async () => {
    setSaving(true);
    try {
      await savePageData("ventures", {
        hero_line_one: heroLineOne,
        hero_line_two: heroLineTwo,
      });
      await showAlert("Saved", "Hero section updated successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      await showAlert("Save Failed", error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateVenture = async () => {
    if (!newVenture.name) {
      return showAlert("Missing Info", "Venture name is required", "warning");
    }

    setSaving(true);
    try {
      const res = await fetch("/api/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVenture),
      });

      if (!res.ok) throw new Error("Failed to create venture");

      const data = await res.json();
      if (data.success) {
        setVentures([data.data, ...ventures]);
        setIsAddingVenture(false);
        setNewVenture({
          name: "",
          logoUrl: "",
          websiteUrl: "",
          category: "General",
          description: "",
          order: 0,
          isActive: true,
        });
        await showAlert("Success", "New venture added to portfolio!");
      }
    } catch (error) {
      await showAlert("Error", error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateVenture = async (id, updates) => {
    setSaving(true);
    try {
      const res = await fetch("/api/ventures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...updates }),
      });

      if (!res.ok) throw new Error("Failed to update venture");

      setVentures((prev) =>
        prev.map((v) => (v._id === id ? { ...v, ...updates } : v)),
      );
      setIsEditingVenture(null);
      await showAlert("Updated", "Venture details saved.");
    } catch (error) {
      await showAlert("Error", error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVenture = async (id, name) => {
    const result = await showConfirm(
      "Delete Venture?",
      `Are you sure you want to remove ${name}? This cannot be undone.`,
    );
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/ventures?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete venture");
      setVentures((prev) => prev.filter((v) => v._id !== id));
      await showAlert("Deleted", `${name} has been removed.`);
    } catch (error) {
      await showAlert("Error", error.message, "error");
    }
  };

  const resetPage = async () => {
    const result = await showConfirm(
      "Reset Hero?",
      "Reset hero lines to defaults?",
    );
    if (!result.isConfirmed) return;

    setResetting(true);
    try {
      await deletePageData("ventures");
      window.location.reload();
    } catch (err) {
      await showAlert("Reset Failed", err.message, "error");
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 text-xl animate-pulse">
            Synchronizing Ventures...
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="mx-auto pb-10 px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              Ecosystem Manager
            </h1>
            <p className="text-gray-500 text-sm">
              Directly manage hero content and the master list of all group
              concerns.
            </p>
          </div>
          <button
            onClick={resetPage}
            className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="space-y-12">
          {/* 1. Hero Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-linear-to-r from-gray-50 to-white px-10 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit size={18} className="text-orange-500" />
                Hero Section
              </h2>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={heroLineOne}
                  onChange={(e) => setHeroLineOne(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Sub-Heading
                </label>
                <input
                  type="text"
                  value={heroLineTwo}
                  onChange={(e) => setHeroLineTwo(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  onClick={saveHeroSection}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Update Hero Content"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Master Ventures List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Ecosystem Registry
                </h2>
                <p className="text-sm text-gray-500">
                  Currently managing {ventures.length} entries
                </p>
              </div>
              <button
                onClick={loadAllContent}
                className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2"
                title="Refresh Registry"
              >
                <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
                <span className="text-xs font-bold uppercase tracking-tight">Sync Data</span>
              </button>
            </div>

            {/* Ventures Grid */}
            <div className="grid grid-cols-1 gap-6">
              {ventures.map((v) => (
                <div
                  key={v._id}
                  className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all group flex flex-col md:flex-row gap-8"
                >
                  <div className="w-full md:w-48 flex flex-col items-center gap-4">
                    <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
                      {v.logoUrl ? (
                        <img
                          src={v.logoUrl}
                          alt={v.name}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <Building2 size={40} className="text-gray-200" />
                      )}
                    </div>
                    {isEditingVenture === v._id ? (
                      <FileUpload
                        value={v.logoUrl}
                        onChange={(url) =>
                          setVentures((prev) =>
                            prev.map((item) =>
                              item._id === v._id
                                ? { ...item, logoUrl: url }
                                : item,
                            ),
                          )
                        }
                        folder="ventures"
                        type="image"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        Logo Attached
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    {isEditingVenture === v._id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">
                            Name
                          </label>
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) =>
                              setVentures((prev) =>
                                prev.map((item) =>
                                  item._id === v._id
                                    ? { ...item, name: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">
                            Category
                          </label>
                          <select
                            value={v.category}
                            onChange={(e) =>
                              setVentures((prev) =>
                                prev.map((item) =>
                                  item._id === v._id
                                    ? { ...item, category: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">
                            Website URL
                          </label>
                          <input
                            type="text"
                            value={v.websiteUrl}
                            onChange={(e) =>
                              setVentures((prev) =>
                                prev.map((item) =>
                                  item._id === v._id
                                    ? { ...item, websiteUrl: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">
                            Description
                          </label>
                          <textarea
                            value={v.description}
                            onChange={(e) =>
                              setVentures((prev) =>
                                prev.map((item) =>
                                  item._id === v._id
                                    ? { ...item, description: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm h-20"
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                          <button
                            onClick={() => setIsEditingVenture(null)}
                            className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateVenture(v._id, v)}
                            className="px-6 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/10"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {v.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded-md">
                                {v.category}
                              </span>
                              {v.websiteUrl && (
                                <span className="text-[9px] text-blue-500 flex items-center gap-1">
                                  <Globe size={10} />{" "}
                                  {v.websiteUrl.replace(/^https?:\/\//, "")}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsEditingVenture(v._id)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteVenture(v._id, v.name)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 italic">
                          {v.description || "No description provided."}
                        </p>
                        <div className="pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-4">
                            <span className="text-[9px] text-gray-400 font-medium">
                              ORDER: {v.order || 0}
                            </span>
                            <span className="text-[9px] text-gray-400 font-medium">
                              ID: {v._id.substring(0, 8)}
                            </span>
                            {v.publicId && (
                              <span className="text-[9px] text-gray-400 font-medium">
                                PUBLIC_ID: {v.publicId}
                              </span>
                            )}
                            {v.createdAt && (
                              <span className="text-[9px] text-gray-400 font-medium">
                                CREATED: {new Date(v.createdAt).toLocaleDateString()}
                              </span>
                            )}
                            {v.updatedAt && (
                              <span className="text-[9px] text-gray-400 font-medium">
                                UPDATED: {new Date(v.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${v.isActive ? "bg-emerald-500" : "bg-gray-300"}`}
                            ></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                              {v.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {ventures.length === 0 && !loading && (
                <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem]">
                  <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">
                    No ventures found in the database.
                  </p>
                  <button
                    onClick={() => setIsAddingVenture(true)}
                    className="mt-4 text-blue-600 font-bold hover:underline"
                  >
                    Add your first venture
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
