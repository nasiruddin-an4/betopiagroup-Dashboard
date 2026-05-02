"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import {
  Save,
  Target,
  Building2,
  Users,
  TrendingUp,
  Rocket,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import FileUpload from "../../components/FileUpload";
import CardManager from "../../components/CardManager";

export default function Vision2030ContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Hero Section
  const [heroTitle, setHeroTitle] = useState("Vision 2030: The Next Horizon");
  const [heroDescription, setHeroDescription] = useState(
    "We are not just predicting the future...",
  );
  const [heroMedia, setHeroMedia] = useState("");
  const [heroMediaType, setHeroMediaType] = useState("image");

  // Tech City Section
  const [techCityTitle, setTechCityTitle] = useState("Betopia Tech City");
  const [techCityMedia, setTechCityMedia] = useState("");
  const [techCityMediaType, setTechCityMediaType] = useState("video");
  const [techCityDescription, setTechCityDescription] = useState(
    "Imagine a workspace that breathes...",
  );

  // 30,000 Minds Section
  const [mindsTitle, setMindsTitle] = useState("30,000 Minds. One Mission.");
  const [mindsDescription, setMindsDescription] = useState(
    "To service the largest economies in Asia...",
  );
  const [mindsImage, setMindsImage] = useState("");

  // Innovators/Workforce Section
  const [innovatorsTitle, setInnovatorsTitle] = useState("Innovators by 2030");
  const [innovatorsSubtitle, setInnovatorsSubtitle] = useState(
    "Building the Workforce of the Future",
  );
  const [workforceCards, setWorkforceCards] = useState([
    {
      id: 1,
      title: "A Global Nexus of Innovators",
      description: "A borderless metropolis designed for collaboration. The One-Liner: We are constructing residential and collaborative smart-zones engineered to attract, connect, and house the world's most brilliant tech minds in one physical ecosystem.",
      image: "/future!.webp"
    },
    {
      id: 2,
      title: "The Integrated Knowledge Grid",
      description: "The city itself is a campus. By embedding world-class R&D labs and continuous-learning academies directly into the urban layout, the city becomes a living engine for daily upskilling and discovery.",
      image: "/10011.jpg"
    },
    {
      id: 3,
      title: "Infrastructure for Empowerment",
      description: "An inclusive city built for everyone. The One-Liner: From culturally rich community spaces to universally accessible design, we are building an inclusive urban environment that champions diverse leadership and total well-being.",
      image: "/10010.jpg"
    }
  ]);

  // CTA Section
  const [ctaTitle, setCtaTitle] = useState(
    "Be part of the history we are writing.",
  );
  const [ctaButtonText, setCtaButtonText] = useState(
    "Join the Journey to 2030",
  );

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("vision-2030");

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
          else if (key === "hero_media") setHeroMedia(parsedValue);
          else if (key === "hero_mediaType") setHeroMediaType(parsedValue);
          else if (key === "techcity_title") setTechCityTitle(parsedValue);
          else if (key === "techcity_media") setTechCityMedia(parsedValue);
          else if (key === "techcity_mediaType")
            setTechCityMediaType(parsedValue);
          else if (key === "techcity_description")
            setTechCityDescription(parsedValue);
          else if (key === "minds_title") setMindsTitle(parsedValue);
          else if (key === "minds_description")
            setMindsDescription(parsedValue);
          else if (key === "minds_image") setMindsImage(parsedValue);
          else if (key === "innovators_title") setInnovatorsTitle(parsedValue);
          else if (key === "innovators_subtitle")
            setInnovatorsSubtitle(parsedValue);
          else if (key === "workforce_cards") setWorkforceCards(parsedValue);
          else if (key === "cta_title") setCtaTitle(parsedValue);
          else if (key === "cta_buttonText") setCtaButtonText(parsedValue);
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
      await savePageData("vision-2030", data);
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
        "Reset all saved content for Vision 2030 page? This cannot be undone.",
      )
    )
      return;
    setResetting(true);
    try {
      await deletePageData("vision-2030");
      setMessage({
        type: "success",
        text: "Vision 2030 page reset to defaults!",
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
            Loading Vision 2030 CMS...
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
              Vision 2030 Content
            </h1>
            <p className="text-xs text-gray-400">
              Manage Tech City, Innovators, and the 2030 Roadmap
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
        <div className="mx-auto space-y-12">
          {/* 1. Hero Section */}
          <section
            id="hero"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Hero Section
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">
                Strategy
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Main Heading
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all resize-none shadow-xs"
                  />
                </div>
                <div className="space-y-4 p-8 rounded-xl border border-gray-100 bg-gray-50/30">
                  <div className="flex gap-4 p-1 bg-gray-100 rounded-xl w-fit">
                    <button
                      onClick={() => setHeroMediaType("video")}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-normal transition-all ${
                        heroMediaType === "video"
                          ? "bg-white text-blue-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Film size={18} />
                      Video
                    </button>
                    <button
                      onClick={() => setHeroMediaType("image")}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-normal transition-all ${
                        heroMediaType === "image"
                          ? "bg-white text-blue-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <ImageIcon size={18} />
                      Image
                    </button>
                  </div>
                  <FileUpload
                    label="Hero Background Media"
                    value={heroMedia}
                    onChange={setHeroMedia}
                    folder="vision2030"
                    type={heroMediaType}
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Hero Section", {
                      hero_title: heroTitle,
                      hero_description: heroDescription,
                      hero_media: heroMedia,
                      hero_mediaType: heroMediaType,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Hero Section</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Tech City Section */}
          <section
            id="techcity"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Betopia Tech City
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Infrastructure
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Title
                  </label>
                  <input
                    type="text"
                    value={techCityTitle}
                    onChange={(e) => setTechCityTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={techCityDescription}
                    onChange={(e) => setTechCityDescription(e.target.value)}
                    rows={4}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-orange-500 transition-all resize-none shadow-xs"
                  />
                </div>

                <div className="space-y-4 p-8 rounded-xl border border-gray-100 bg-gray-50/30">
                  <div className="flex gap-4 p-1 bg-gray-100 rounded-2xl w-fit">
                    <button
                      onClick={() => setTechCityMediaType("video")}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-normal transition-all ${
                        techCityMediaType === "video"
                          ? "bg-white text-orange-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Film size={18} />
                      Video
                    </button>
                    <button
                      onClick={() => setTechCityMediaType("image")}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-normal transition-all ${
                        techCityMediaType === "image"
                          ? "bg-white text-orange-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <ImageIcon size={18} />
                      Image
                    </button>
                  </div>
                  <FileUpload
                    label="Tech City Media"
                    value={techCityMedia}
                    onChange={setTechCityMedia}
                    folder="vision2030"
                    type={techCityMediaType}
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Tech City Section", {
                      techcity_title: techCityTitle,
                      techcity_description: techCityDescription,
                      techcity_media: techCityMedia,
                      techcity_mediaType: techCityMediaType,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Tech City</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. 30,000 Minds */}
          <section
            id="minds"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  30,000 Minds
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Mission
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={mindsTitle}
                    onChange={(e) => setMindsTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-emerald-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Mission Description
                  </label>
                  <textarea
                    value={mindsDescription}
                    onChange={(e) => setMindsDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-xs"
                  />
                </div>
                <div className="mt-8">
                  <FileUpload
                    label="Background Image"
                    value={mindsImage}
                    onChange={setMindsImage}
                    folder="vision2030"
                    type="image"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Minds Section", {
                      minds_title: mindsTitle,
                      minds_description: mindsDescription,
                      minds_image: mindsImage,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Minds</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4. Innovators / Workforce */}
          <section
            id="innovators"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Innovators by 2030
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Workforce
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={innovatorsTitle}
                    onChange={(e) => setInnovatorsTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-purple-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={innovatorsSubtitle}
                    onChange={(e) => setInnovatorsSubtitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-purple-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={workforceCards}
                  onChange={setWorkforceCards}
                  cardTemplate={{
                    id: Date.now(),
                    title: "",
                    description: "",
                    image: "",
                  }}
                  title="Workforce Cards"
                  folder="vision2030"
                />
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Innovators Section", {
                      innovators_title: innovatorsTitle,
                      innovators_subtitle: innovatorsSubtitle,
                      workforce_cards: workforceCards,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Innovators</span>
                </button>
              </div>
            </div>
          </section>

          {/* 5. CTA Section */}
          <section
            id="cta"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Call to Action
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                History
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    CTA Title
                  </label>
                  <input
                    type="text"
                    value={ctaTitle}
                    onChange={(e) => setCtaTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-rose-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaButtonText}
                    onChange={(e) => setCtaButtonText(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-rose-500 transition-all shadow-xs"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("CTA Section", {
                      cta_title: ctaTitle,
                      cta_buttonText: ctaButtonText,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update CTA</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
