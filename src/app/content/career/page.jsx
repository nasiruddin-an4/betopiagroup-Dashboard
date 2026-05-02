"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import {
  Save,
  Briefcase,
  Users,
  Target,
  Rocket,
  Heart,
  Zap,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
  Film,
  Image as ImageIcon,
  Gift,
  Award,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import FileUpload from "../../components/FileUpload";
import CardManager from "../../components/CardManager";
import { showAlert, showConfirm } from "../../utils/alert";

export default function CareerContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Hero Section
  const [heroMediaType, setHeroMediaType] = useState("image");
  const [heroMedia, setHeroMedia] = useState("");
  const [heroLabel, setHeroLabel] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");

  // 2. Life at Betopia
  const [lifeTitle, setLifeTitle] = useState("");
  const [lifeDescription, setLifeDescription] = useState("");
  const [lifeImages, setLifeImages] = useState([]);

  // 3. Benefits
  const [benefitsTitle, setBenefitsTitle] = useState("");
  const [benefitsDescription, setBenefitsDescription] = useState("");
  const [benefitsCards, setBenefitsCards] = useState([]);

  // 4. Offers Meta
  const [offersTitle, setOffersTitle] = useState("");
  const [offersDescription, setOffersDescription] = useState("");

  // 5. Cultural Code
  const [cultureMediaType, setCultureMediaType] = useState("image");
  const [cultureMedia, setCultureMedia] = useState("");
  const [cultureTitle, setCultureTitle] = useState("");
  const [cultureDescription, setCultureDescription] = useState("");
  const [cultureCodes, setCultureCodes] = useState([]);

  // 6. Application Process
  const [easyTitle, setEasyTitle] = useState("");
  const [easyDescription, setEasyDescription] = useState("");
  const [easyImage, setEasyImage] = useState("");
  const [easySteps, setEasySteps] = useState([]);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("career");

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

          // Mapping logic with snake_case and legacy support
          if (key === "hero_media_type" || key === "hero_mediaType")
            setHeroMediaType(parsedValue);
          else if (key === "hero_media") setHeroMedia(parsedValue);
          else if (key === "hero_label") setHeroLabel(parsedValue);
          else if (key === "hero_title") setHeroTitle(parsedValue);
          else if (key === "hero_description") setHeroDescription(parsedValue);
          else if (key === "life_title") setLifeTitle(parsedValue);
          else if (key === "life_description") setLifeDescription(parsedValue);
          else if (key === "life_images") setLifeImages(parsedValue);
          else if (key === "benefits_title") setBenefitsTitle(parsedValue);
          else if (key === "benefits_description")
            setBenefitsDescription(parsedValue);
          else if (key === "benefits_cards" || key === "benefits")
            setBenefitsCards(parsedValue);
          else if (key === "offers_title") setOffersTitle(parsedValue);
          else if (key === "offers_description")
            setOffersDescription(parsedValue);
          else if (key === "culture_media_type" || key === "culture_mediaType")
            setCultureMediaType(parsedValue);
          else if (key === "culture_media") setCultureMedia(parsedValue);
          else if (key === "culture_title") setCultureTitle(parsedValue);
          else if (key === "culture_description")
            setCultureDescription(parsedValue);
          else if (key === "culture_codes") setCultureCodes(parsedValue);
          else if (key === "easy_title") setEasyTitle(parsedValue);
          else if (key === "easy_description") setEasyDescription(parsedValue);
          else if (key === "easy_image") setEasyImage(parsedValue);
          else if (key === "easy_steps") setEasySteps(parsedValue);
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
      await savePageData("career", data);
      await showAlert("Saved", `${section} saved successfully!`);
    } catch (error) {
      console.error("Save failed:", error);
      await showAlert(
        "Save Failed",
        error.message || "Failed to save. Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const resetPage = async () => {
    const result = await showConfirm(
      "Reset Career?",
      "Reset all saved content for Career? This cannot be undone.",
    );
    if (!result.isConfirmed) return;

    setResetting(true);
    try {
      await deletePageData("career");
      await showAlert("Reset Successful", "Career reset to defaults!");
      window.location.reload();
    } catch (err) {
      await showAlert("Reset Failed", err.message || "Reset failed", "error");
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 text-xl animate-pulse font-medium">
            Loading Career...
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className=" mx-auto pb-20 px-4">
        {/* Sticky Header */}
        <div className="mb-4 z-30 py-6 flex justify-between items-center -mx-4 px-4 sm:mx-0 sm:px-0">
          <div>
            <h1 className="text-3xl font-normal text-gray-500 mb-2">
              Career Content
            </h1>
            <p className="text-gray-400 text-sm">
              Manage hero, culture, and benefits for Betopia Group
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() =>
                saveSection("Career Page", {
                  hero_media_type: heroMediaType,
                  hero_media: heroMedia,
                  hero_label: heroLabel,
                  hero_title: heroTitle,
                  hero_description: heroDescription,
                  life_title: lifeTitle,
                  life_description: lifeDescription,
                  life_images: lifeImages,
                  benefits_title: benefitsTitle,
                  benefits_description: benefitsDescription,
                  benefits_cards: benefitsCards,
                  offers_title: offersTitle,
                  offers_description: offersDescription,
                  culture_media_type: cultureMediaType,
                  culture_media: cultureMedia,
                  culture_title: cultureTitle,
                  culture_description: cultureDescription,
                  culture_codes: cultureCodes,
                  easy_title: easyTitle,
                  easy_description: easyDescription,
                  easy_image: easyImage,
                  easy_steps: easySteps,
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

          {/* Removed legacy toast message - using SweetAlert2 instead */}
        </div>

        {/* Serial Content Layout */}
        <div className="mx-auto space-y-12">
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
                  <Briefcase className="text-orange-500" size={22} />
                  Hero Section
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Introduction
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Media Type
                    </label>
                    <div className="flex gap-4 p-1 bg-gray-100 rounded-xl w-fit">
                      <button
                        onClick={() => setHeroMediaType("image")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-normal transition-all ${
                          heroMediaType === "image"
                            ? "bg-white text-orange-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <ImageIcon size={16} />
                        Image
                      </button>
                      <button
                        onClick={() => setHeroMediaType("video")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-normal transition-all ${
                          heroMediaType === "video"
                            ? "bg-white text-orange-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Film size={16} />
                        Video
                      </button>
                    </div>
                  </div>
                  <FileUpload
                    label={
                      heroMediaType === "video" ? "Hero Video" : "Hero Image"
                    }
                    value={heroMedia}
                    onChange={setHeroMedia}
                    folder="career"
                    type={heroMediaType}
                  />
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Section Label
                    </label>
                    <input
                      type="text"
                      value={heroLabel}
                      onChange={(e) => setHeroLabel(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="e.g., Career at Betopia"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Main Title (use \n for breaks)
                    </label>
                    <textarea
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-2xl font-normal focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="We fuel ambitions."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Description
                    </label>
                    <textarea
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-orange-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Hero Section", {
                      hero_media_type: heroMediaType,
                      hero_media: heroMedia,
                      hero_label: heroLabel,
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

          {/* 2. Life at Betopia */}
          <section
            id="life"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-normal text-lg">
                  2
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="text-blue-500" size={22} />
                  Life at Betopia
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Culture
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={lifeTitle}
                    onChange={(e) => setLifeTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Section Description
                  </label>
                  <textarea
                    value={lifeDescription}
                    onChange={(e) => setLifeDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>

              <CardManager
                cards={lifeImages}
                onChange={setLifeImages}
                cardTemplate={{ id: Date.now(), imageUrl: "" }}
                title="Life Gallery Images"
                folder="career"
              />

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Life at Betopia", {
                      life_title: lifeTitle,
                      life_description: lifeDescription,
                      life_images: lifeImages,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Life"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. Benefits Section */}
          <section
            id="benefits"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-normal text-lg">
                  3
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Gift className="text-emerald-500" size={22} />
                  Facility Benefits
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Perks
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Benefits Title
                  </label>
                  <input
                    type="text"
                    value={benefitsTitle}
                    onChange={(e) => setBenefitsTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Benefits Description
                  </label>
                  <textarea
                    value={benefitsDescription}
                    onChange={(e) => setBenefitsDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
              </div>

              <CardManager
                cards={benefitsCards}
                onChange={setBenefitsCards}
                cardTemplate={{
                  id: Date.now(),
                  title: "",
                  description: "",
                  image: "",
                }}
                title="Benefits Grid"
                folder="career"
              />

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Benefits Section", {
                      benefits_title: benefitsTitle,
                      benefits_description: benefitsDescription,
                      benefits_cards: benefitsCards,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Benefits"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4. Offers Meta */}
          <section
            id="offers"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-normal text-lg">
                  4
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="text-amber-500" size={22} />
                  Corporate Offers
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Partnerships
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Offers Section Title
                  </label>
                  <input
                    type="text"
                    value={offersTitle}
                    onChange={(e) => setOffersTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Offers Description
                  </label>
                  <textarea
                    value={offersDescription}
                    onChange={(e) => setOffersDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-amber-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-sm text-amber-800 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center shrink-0">
                  <Plus size={16} />
                </div>
                <p>
                  Offer cards (images + brands) are managed through the{" "}
                  <strong className="text-amber-900">Career Offers</strong>{" "}
                  collection — add or edit them in the backend admin. Only the
                  section heading text is editable here.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Offers Section", {
                      offers_title: offersTitle,
                      offers_description: offersDescription,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Offers"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 5. Cultural Code Section */}
          <section
            id="culture"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-normal text-lg">
                  5
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="text-purple-500" size={22} />
                  Cultural Code
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Values
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Media Type
                    </label>
                    <div className="flex gap-4 p-1 bg-gray-100 rounded-xl w-fit">
                      <button
                        onClick={() => setCultureMediaType("image")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-normal transition-all ${
                          cultureMediaType === "image"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <ImageIcon size={16} />
                        Image
                      </button>
                      <button
                        onClick={() => setCultureMediaType("video")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-normal transition-all ${
                          cultureMediaType === "video"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Film size={16} />
                        Video
                      </button>
                    </div>
                  </div>
                  <FileUpload
                    label={
                      cultureMediaType === "video"
                        ? "Culture Video"
                        : "Culture Image"
                    }
                    value={cultureMedia}
                    onChange={setCultureMedia}
                    folder="career"
                    type={cultureMediaType}
                  />
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={cultureTitle}
                      onChange={(e) => setCultureTitle(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Culture Description
                  </label>
                  <textarea
                    value={cultureDescription}
                    onChange={(e) => setCultureDescription(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  />
                </div>
              </div>

              <CardManager
                cards={cultureCodes}
                onChange={setCultureCodes}
                cardTemplate={{
                  id: Date.now(),
                  icon: "Users",
                  title: "",
                  description: "",
                }}
                title="Cultural Pillars"
                folder="career"
              />

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Cultural Code", {
                      culture_media_type: cultureMediaType,
                      culture_media: cultureMedia,
                      culture_title: cultureTitle,
                      culture_description: cultureDescription,
                      culture_codes: cultureCodes,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Culture"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 6. Easy Ways Section */}
          <section
            id="easy"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-normal text-lg">
                  6
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Rocket className="text-rose-500" size={22} />
                  Application Steps
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Process
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={easyTitle}
                      onChange={(e) => setEasyTitle(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                  <FileUpload
                    label="Process Section Image"
                    value={easyImage}
                    onChange={setEasyImage}
                    folder="career"
                    type="image"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-tight">
                    Section Description
                  </label>
                  <textarea
                    value={easyDescription}
                    onChange={(e) => setEasyDescription(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-rose-500 transition-all resize-none"
                  />
                </div>
              </div>

              <CardManager
                cards={easySteps}
                onChange={setEasySteps}
                cardTemplate={{
                  id: Date.now(),
                  number: "01",
                  title: "",
                  description: "",
                }}
                title="Launch Steps"
                folder="career"
              />

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Application Process", {
                      easy_title: easyTitle,
                      easy_description: easyDescription,
                      easy_image: easyImage,
                      easy_steps: easySteps,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Process"}</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
