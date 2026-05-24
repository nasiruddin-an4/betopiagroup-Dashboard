"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Tag,
  Gift,
  FolderOpen,
  MapPin,
  Globe,
  Phone,
  Users,
  FileText,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import FileUpload from "../components/FileUpload";
import { getImageUrl } from "../utils/s3";
import { showAlert, showConfirm } from "../utils/alert";

const ITEMS_PER_PAGE = 8;

export default function CorporateOffersPage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [message, setMessage] = useState({ type: "", text: "" });
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [categorySaving, setCategorySaving] = useState(false);

  // Offers state
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [offerForm, setOfferForm] = useState({
    title: "",
    description: "",
    partner: "",
    category: "",
    location: "",
    applicability: "",
    website: "",
    hotline: "",
    image: "",
    logo: "",
    tnc: [""],
  });
  const [offerSaving, setOfferSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  // Pagination
  const [categoryPage, setCategoryPage] = useState(1);
  const [offerPage, setOfferPage] = useState(1);

  useEffect(() => {
    fetchCategories();
    fetchOffers();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ─── Categories API ─────────────────────────────────────────────
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch("/api/corporate-offers/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim()) {
      await showAlert("Validation Error", "Category name is required", "warning");
      return;
    }
    setCategorySaving(true);
    try {
      const isEditing = !!editingCategory;
      const res = await fetch("/api/corporate-offers/categories", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing
            ? { _id: editingCategory._id, ...categoryForm }
            : categoryForm,
        ),
      });
      const data = await res.json();
      if (data.success) {
        await showAlert("Success", `Category ${isEditing ? "updated" : "created"} successfully!`, "success");
        resetCategoryForm();
        fetchCategories();
      } else {
        await showAlert("Error", data.error || "Failed to save category", "error");
      }
    } catch (err) {
      console.error("Failed to save category:", err);
      await showAlert("Error", "A server error occurred while saving category", "error");
    } finally {
      setCategorySaving(false);
    }
  };

  const deleteCategory = async (id, name) => {
    const result = await showConfirm(
      "Delete Category?",
      `Are you sure you want to delete "${name}"? All offers in this category will become uncategorized. This cannot be undone.`
    );
    if (!result.isConfirmed) return;
    
    try {
      const res = await fetch(
        `/api/corporate-offers/categories?id=${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (data.success) {
        await showAlert("Deleted", "Category deleted successfully!", "success");
        fetchCategories();
      } else {
        await showAlert("Error", data.error || "Failed to delete category", "error");
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
      await showAlert("Error", "Failed to delete category", "error");
    }
  };

  const startEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      description: cat.description || "",
      image: cat.image || "",
    });
    setShowCategoryForm(true);
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "", image: "" });
    setShowCategoryForm(false);
  };

  // ─── Offers API ─────────────────────────────────────────────────
  const fetchOffers = async () => {
    setOffersLoading(true);
    try {
      const res = await fetch("/api/corporate-offers");
      const data = await res.json();
      if (data.success) setOffers(data.data);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    } finally {
      setOffersLoading(false);
    }
  };

  const saveOffer = async () => {
    if (!offerForm.title.trim()) {
      await showAlert("Validation Error", "Offer title is required", "warning");
      return;
    }
    setOfferSaving(true);
    try {
      const isEditing = !!editingOffer;
      const payload = {
        ...offerForm,
        tnc: offerForm.tnc.filter((t) => t.trim() !== ""),
      };
      const res = await fetch("/api/corporate-offers", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing ? { _id: editingOffer._id, ...payload } : payload,
        ),
      });
      const data = await res.json();
      if (data.success) {
        await showAlert("Success", `Offer ${isEditing ? "updated" : "created"} successfully!`, "success");
        resetOfferForm();
        fetchOffers();
      } else {
        await showAlert("Error", data.error || "Failed to save offer", "error");
      }
    } catch (err) {
      console.error("Failed to save offer:", err);
      await showAlert("Error", "A server error occurred while saving offer", "error");
    } finally {
      setOfferSaving(false);
    }
  };

  const deleteOffer = async (id, title) => {
    const result = await showConfirm(
      "Delete Offer?",
      `Are you sure you want to delete "${title}"? This cannot be undone.`
    );
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/corporate-offers?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await showAlert("Deleted", "Offer deleted successfully!", "success");
        fetchOffers();
      } else {
        await showAlert("Error", data.error || "Failed to delete offer", "error");
      }
    } catch (err) {
      console.error("Failed to delete offer:", err);
      await showAlert("Error", "Failed to delete offer", "error");
    }
  };

  const startEditOffer = (offer) => {
    setEditingOffer(offer);
    setOfferForm({
      title: offer.title || "",
      description: offer.description || "",
      partner: offer.partner || "",
      category: offer.category || "",
      location: offer.location || "",
      applicability: offer.applicability || "",
      website: offer.website || "",
      hotline: offer.hotline || "",
      image: offer.image || "",
      logo: offer.logo || "",
      tnc: offer.tnc && offer.tnc.length > 0 ? offer.tnc : [""],
    });
    setShowOfferForm(true);
  };

  const resetOfferForm = () => {
    setEditingOffer(null);
    setOfferForm({
      title: "",
      description: "",
      partner: "",
      category: "",
      location: "",
      applicability: "",
      website: "",
      hotline: "",
      image: "",
      logo: "",
      tnc: [""],
    });
    setShowOfferForm(false);
  };

  // ─── Filtered & Paginated Data ─────────────────────────────────
  const filteredOffers = filterCategory
    ? offers.filter((o) => o.category === filterCategory)
    : offers;

  const totalCategoryPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * ITEMS_PER_PAGE,
    categoryPage * ITEMS_PER_PAGE,
  );

  const totalOfferPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);
  const paginatedOffers = filteredOffers.slice(
    (offerPage - 1) * ITEMS_PER_PAGE,
    offerPage * ITEMS_PER_PAGE,
  );

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f79549] focus:ring-1 focus:ring-[#f79549] transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <AdminSidebar>
      <div className="container mx-auto pb-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-semibold text-gray-500 mb-2">
              Corporate Offers
            </h1>
            <p className="text-gray-400 text-sm">
              Manage offer categories and active corporate offers
            </p>
          </div>
          {message.text && (
            <div
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm ${
                message.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-200 p-1 rounded-xl mb-6 max-w-md">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FolderOpen size={16} />
            Categories
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {categories.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === "offers"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Gift size={16} />
            Active Offers
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {offers.length}
            </span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            CATEGORIES TAB
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Add Category Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  resetCategoryForm();
                  setShowCategoryForm(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f79549] hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm cursor-pointer text-sm font-medium"
              >
                <Plus size={18} />
                Add Category
              </button>
            </div>

            {/* Category Form Modal */}
            {showCategoryForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl my-8">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingCategory ? "Edit Category" : "New Category"}
                  </h3>
                  <button
                    onClick={resetCategoryForm}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Category Name *</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. Hotel & Resort"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Brief description of this category..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <FileUpload
                    label="Category Image"
                    value={categoryForm.image}
                    onChange={(url) =>
                      setCategoryForm({ ...categoryForm, image: url })
                    }
                    folder="categories"
                    type="image"
                  />
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveCategory}
                      disabled={categorySaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#f79549] hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm cursor-pointer text-sm font-medium"
                    >
                      <Save size={16} />
                      {categorySaving
                        ? "Saving..."
                        : editingCategory
                          ? "Update Category"
                          : "Create Category"}
                    </button>
                    <button
                      onClick={resetCategoryForm}
                      className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              </div>
            )}

            {/* Categories Grid */}
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-[#f79549]" />
                <span className="ml-3 text-gray-400">
                  Loading categories...
                </span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
                <FolderOpen size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No categories found. Add your first category above.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedCategories.map((cat) => (
                    <div
                      key={cat._id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col"
                    >
                      {cat.image ? (
                        <div className="w-full h-40 overflow-hidden relative">
                          <img
                            src={getImageUrl(cat.image)}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#f79549] px-2.5 py-1 rounded-full">
                            {cat.offerCount || 0} Offers
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                          <FolderOpen size={40} className="text-gray-300" />
                          <div className="absolute top-2 right-2 bg-white/90 text-xs font-semibold text-[#f79549] px-2.5 py-1 rounded-full">
                            {cat.offerCount || 0} Offers
                          </div>
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-gray-500 text-xs line-clamp-2 flex-1">
                            {cat.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => startEditCategory(cat)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 hover:text-[#f79549] hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit3 size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(cat._id, cat.name)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Pagination */}
                {totalCategoryPages > 1 && (
                  <Pagination
                    currentPage={categoryPage}
                    totalPages={totalCategoryPages}
                    total={categories.length}
                    perPage={ITEMS_PER_PAGE}
                    onPageChange={setCategoryPage}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            OFFERS TAB
            ═══════════════════════════════════════════════════════════ */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Filter:</label>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setOfferPage(1);
                  }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[#f79549] cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  resetOfferForm();
                  setShowOfferForm(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f79549] hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm cursor-pointer text-sm font-medium"
              >
                <Plus size={18} />
                Add Offer
              </button>
            </div>

            {/* Offer Form Modal */}
            {showOfferForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingOffer ? "Edit Offer" : "New Offer"}
                    </h3>
                    <button
                      onClick={resetOfferForm}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30 custom-scrollbar">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>Title *</label>
                          <input
                            type="text"
                            value={offerForm.title}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, title: e.target.value })
                            }
                            placeholder="e.g. Foodpanda"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Partner</label>
                          <input
                            type="text"
                            value={offerForm.partner}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, partner: e.target.value })
                            }
                            placeholder="e.g. Foodpanda"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                          value={offerForm.description}
                          onChange={(e) =>
                            setOfferForm({ ...offerForm, description: e.target.value })
                          }
                          rows={3}
                          placeholder="Describe the offer..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className={labelClass}>
                            <span className="flex items-center gap-1.5">
                              <Tag size={13} className="text-gray-400" />
                              Category
                            </span>
                          </label>
                          <select
                            value={offerForm.category}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, category: e.target.value })
                            }
                            className={`${inputClass} cursor-pointer`}
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={13} className="text-gray-400" />
                              Location
                            </span>
                          </label>
                          <input
                            type="text"
                            value={offerForm.location}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, location: e.target.value })
                            }
                            placeholder="e.g. Bangladesh"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            <span className="flex items-center gap-1.5">
                              <Users size={13} className="text-gray-400" />
                              Applicability
                            </span>
                          </label>
                          <input
                            type="text"
                            value={offerForm.applicability}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, applicability: e.target.value })
                            }
                            placeholder="e.g. Betopian Employees"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>
                            <span className="flex items-center gap-1.5">
                              <Globe size={13} className="text-gray-400" />
                              Website
                            </span>
                          </label>
                          <input
                            type="text"
                            value={offerForm.website}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, website: e.target.value })
                            }
                            placeholder="https://..."
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            <span className="flex items-center gap-1.5">
                              <Phone size={13} className="text-gray-400" />
                              Hotline
                            </span>
                          </label>
                          <input
                            type="text"
                            value={offerForm.hotline}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, hotline: e.target.value })
                            }
                            placeholder="+880 ..."
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <FileUpload
                            label="Offer Image"
                            value={offerForm.image}
                            onChange={(url) => setOfferForm({ ...offerForm, image: url })}
                            folder="offers/images"
                            type="image"
                          />
                        </div>
                        <div>
                          <FileUpload
                            label="Offer Logo"
                            value={offerForm.logo}
                            onChange={(url) => setOfferForm({ ...offerForm, logo: url })}
                            folder="offers/logos"
                            type="image"
                          />
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-900 mb-4">
                          <span className="flex items-center gap-2">
                            <FileText size={16} className="text-[#f79549]" />
                            Offer Benefits / T&C
                          </span>
                        </label>
                        <div className="space-y-3">
                          {offerForm.tnc.map((term, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="mt-3 w-1.5 h-1.5 rounded-full bg-[#f79549] shrink-0" />
                              <input
                                type="text"
                                value={term}
                                onChange={(e) => {
                                  const updated = [...offerForm.tnc];
                                  updated[i] = e.target.value;
                                  setOfferForm({ ...offerForm, tnc: updated });
                                }}
                                placeholder={`Benefit or Term ${i + 1}`}
                                className={inputClass}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = offerForm.tnc.filter((_, idx) => idx !== i);
                                  setOfferForm({
                                    ...offerForm,
                                    tnc: updated.length === 0 ? [""] : updated,
                                  });
                                }}
                                className="mt-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setOfferForm({ ...offerForm, tnc: [...offerForm.tnc, ""] })}
                          className="mt-4 text-sm text-[#f79549] hover:text-orange-600 font-semibold cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus size={16} />
                          Add another benefit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-white shrink-0">
                    <button
                      onClick={resetOfferForm}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveOffer}
                      disabled={offerSaving}
                      className="flex items-center gap-2 px-8 py-2.5 bg-[#f79549] hover:bg-orange-600 text-white rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer text-sm font-medium"
                    >
                      <Save size={18} />
                      {offerSaving ? "Saving..." : editingOffer ? "Update Offer" : "Create Offer"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Offers Grid */}
            {offersLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-[#f79549]" />
                <span className="ml-3 text-gray-400">Loading offers...</span>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
                <Gift size={48} className="mx-auto mb-3 text-gray-300" />
                <p>
                  {filterCategory
                    ? `No offers found in "${filterCategory}".`
                    : "No offers found. Add your first offer above."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedOffers.map((offer) => (
                    <div
                      key={offer._id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col"
                    >
                      {/* Image */}
                      {offer.image ? (
                        <div className="w-full h-40 overflow-hidden relative">
                          <img
                            src={getImageUrl(offer.image)}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {offer.logo && (
                            <img
                              src={getImageUrl(offer.logo)}
                              alt="logo"
                              className="absolute bottom-2 left-2 w-8 h-8 rounded-md bg-white p-0.5 shadow-sm object-contain"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Gift size={40} className="text-gray-300" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1">
                        {offer.category && (
                          <span className="self-start text-xs bg-orange-50 text-[#f79549] px-2 py-0.5 rounded-full font-medium mb-2 flex items-center gap-1">
                            <Tag size={10} />
                            {offer.category}
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {offer.title}
                        </h3>
                        {offer.description && (
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2 flex-1">
                            {offer.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {offer.location && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                              <MapPin size={10} />
                              {offer.location}
                            </span>
                          )}
                          {offer.partner && (
                            <span className="text-xs text-gray-400">
                              • {offer.partner}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => startEditOffer(offer)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 hover:text-[#f79549] hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit3 size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteOffer(offer._id, offer.title)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Offer Pagination */}
                {totalOfferPages > 1 && (
                  <Pagination
                    currentPage={offerPage}
                    totalPages={totalOfferPages}
                    total={filteredOffers.length}
                    perPage={ITEMS_PER_PAGE}
                    onPageChange={setOfferPage}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}

// ─── Pagination Component ─────────────────────────────────────────
function Pagination({ currentPage, totalPages, total, perPage, onPageChange }) {
  const startIndex = (currentPage - 1) * perPage;
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-700">
          {startIndex + 1}–{Math.min(startIndex + perPage, total)}
        </span>{" "}
        of <span className="font-semibold text-gray-700">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-[#f79549] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
