"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar";
import FileUpload from "../../components/FileUpload";
import CardManager from "../../components/CardManager";
import {
  Target,
  BarChart3,
  Wrench,
  Globe,
  Handshake,
  Users,
  Save,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Rocket,
  Image as ImageIcon,
  Film,
} from "lucide-react";

export default function HomeContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Hero Section
  const [heroMedia, setHeroMedia] = useState("");
  const [heroMediaType, setHeroMediaType] = useState("video");
  const [heroHeading, setHeroHeading] = useState("Limitless, Together");

  // Ecosystem Section
  const [ecosystemTitle, setEcosystemTitle] = useState("Enterprise Business Ecosystem Built for Scalable Growth");
  const [ecosystemDescription, setEcosystemDescription] = useState(
    "22+ business units across 6 core domains powered by innovation, AI, and strategic integration to drive a unified, high performance ecosystem.",
  );
  const [ecosystemMedia, setEcosystemMedia] = useState("");

  // Stats Section
  const [statsTitle, setStatsTitle] = useState("Intelligence at Scale.");
  const [statsDescription, setStatsDescription] = useState(
    "5,000+ Minds. 28 Enterprises. One Mission: Engineering the future of Bangladesh for the World.",
  );
  const [statsCards, setStatsCards] = useState([]);

  // Products Section
  const [productsTitle, setProductsTitle] = useState(
    "Asia's Leading AI Powerhouse.",
  );
  const [productsDescription, setProductsDescription] = useState(
    "We are not a conglomerate. We are a convergence. As Asia's rising AI Powerhouse, we fuse deep tech with essential industries...",
  );
  const [productsCards, setProductsCards] = useState([]);
  const [productsBgImage, setProductsBgImage] = useState("");

  // Global Reach Section
  const [globalTitle, setGlobalTitle] = useState(
    "From Bangladesh to the World",
  );
  const [globalDescription, setGlobalDescription] = useState(
    "We are the vanguard of Bangladesh's technological renaissance. We define what 'Made in Bangladesh' means for the 21st century: High Tech. High Value. High Impact.",
  );
  const [globalStats, setGlobalStats] = useState([]);
  const [globalMapVideo, setGlobalMapVideo] = useState("");

  // Experience Section
  const [experienceVideo, setExperienceVideo] = useState("");

  // Co-Architecting Section
  const [coarchTitle, setCoarchTitle] = useState(
    "Co-Architecting the Future Together",
  );
  const [coarchDescription, setCoarchDescription] = useState(
    "We don't just sign contracts; we forge strategic synergies. From Silicon Valley giants to European tech innovators...",
  );
  const [partnerCards, setPartnerCards] = useState([]);

  // Careers Section
  const [careersTitle, setCareersTitle] = useState(
    "Don't Just Work. Build. Grow",
  );
  const [careersDescription, setCareersDescription] = useState(
    "At Betopia, you are not an Employee ID. You are a pilot of the future. We offer more than a career; we offer a canvas.",
  );
  const [careersImages, setCareersImages] = useState([]);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("home");

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

          if (key === "hero_media") setHeroMedia(parsedValue);
          else if (key === "hero_mediaType") setHeroMediaType(parsedValue);
          else if (key === "hero_heading") setHeroHeading(parsedValue);
          else if (key === "ecosystem_title") setEcosystemTitle(parsedValue);
          else if (key === "ecosystem_description") setEcosystemDescription(parsedValue);
          else if (key === "ecosystem_media") setEcosystemMedia(parsedValue);
          else if (key === "stats_title") setStatsTitle(parsedValue);
          else if (key === "stats_description")
            setStatsDescription(parsedValue);
          else if (key === "stats_cards") setStatsCards(parsedValue);
          else if (key === "products_title") setProductsTitle(parsedValue);
          else if (key === "products_description")
            setProductsDescription(parsedValue);
          else if (key === "products_cards") setProductsCards(parsedValue);
          else if (key === "products_bg_image") setProductsBgImage(parsedValue);
          else if (key === "global_title") setGlobalTitle(parsedValue);
          else if (key === "global_description")
            setGlobalDescription(parsedValue);
          else if (key === "global_stats") setGlobalStats(parsedValue);
          else if (key === "global_map_video") setGlobalMapVideo(parsedValue);
          else if (key === "experience_video") setExperienceVideo(parsedValue);
          else if (key === "coarch_title") setCoarchTitle(parsedValue);
          else if (key === "coarch_description")
            setCoarchDescription(parsedValue);
          else if (key === "coarch_partners") setPartnerCards(parsedValue);
          else if (key === "careers_title") setCareersTitle(parsedValue);
          else if (key === "careers_description")
            setCareersDescription(parsedValue);
          else if (key === "careers_images") setCareersImages(parsedValue);
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
    try {
      await savePageData("home", data);
      Swal.fire({
        title: "Success!",
        text: `${section} saved successfully!`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to save.",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetPage = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Reset all saved content for Home page? This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reset it!",
    });

    if (!result.isConfirmed) return;

    setResetting(true);
    try {
      await deletePageData("home");
      Swal.fire({
        title: "Reset!",
        text: "Home page reset to defaults!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Reset failed",
        icon: "error",
      });
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 text-xl animate-pulse">
            Loading Home CMS...
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="mx-auto pb-10 px-4">
        {/* Header */}
        <div className="mb-4 py-6 flex justify-between items-center -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200/50">
          <div>
            <h1 className="text-4xl font-semibold text-gray-500 mb-2">
              Home Page Content
            </h1>
            <p className="text-xs text-gray-400">
              Manage the primary messaging and sections of the landing page
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
        </div>

        {/* Serial Content Layout */}
        <div className="mx-auto space-y-12">
          {/* 1. Hero Section */}
          <section
            id="hero"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Hero Section
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Landing
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={heroHeading}
                    onChange={(e) => setHeroHeading(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-4 p-8 rounded-xl border border-gray-100">
                  <div className="flex gap-4 p-1 bg-gray-100 rounded-xl w-fit">
                    <button
                      onClick={() => setHeroMediaType("video")}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
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
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
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
                    label={
                      heroMediaType === "video" ? "Hero Video" : "Hero Image"
                    }
                    value={heroMedia}
                    onChange={setHeroMedia}
                    folder="home"
                    type={heroMediaType}
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Hero Section", {
                      hero_media: heroMedia,
                      hero_mediaType: heroMediaType,
                      hero_heading: heroHeading,
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

          {/* 1.5 Ecosystem Section */}
          <section
            id="ecosystem"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Ecosystem Section
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Ecosystem
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Ecosystem Title
                  </label>
                  <input
                    type="text"
                    value={ecosystemTitle}
                    onChange={(e) => setEcosystemTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Ecosystem Description
                  </label>
                  <textarea
                    value={ecosystemDescription}
                    onChange={(e) => setEcosystemDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all resize-none shadow-xs"
                  />
                </div>
                <div className="pt-8 border-t border-gray-100">
                  <FileUpload
                    label="Ecosystem Video Upload"
                    value={ecosystemMedia}
                    onChange={setEcosystemMedia}
                    folder="home"
                    type="video"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Ecosystem Section", {
                      ecosystem_title: ecosystemTitle,
                      ecosystem_description: ecosystemDescription,
                      ecosystem_media: ecosystemMedia,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Ecosystem</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Intelligence Section */}
          <section
            id="stats"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Intelligence at Scale
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Stats
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm text-gray-400 mb-3 uppercase tracking-wider">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={statsTitle}
                    onChange={(e) => setStatsTitle(e.target.value)}
                    className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-xl text-gray-900 font-bold focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={statsDescription}
                    onChange={(e) => setStatsDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-orange-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={statsCards}
                  onChange={setStatsCards}
                  cardTemplate={{
                    id: Date.now(),
                    stat: "",
                    label: "",
                    description: "",
                    image: "",
                    link: "",
                    gradient: "from-blue-500/80 to-purple-500/80",
                  }}
                  title="Achievement Cards"
                  folder="home"
                />
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Stats Section", {
                      stats_title: statsTitle,
                      stats_description: statsDescription,
                      stats_cards: statsCards,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Section</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. AI Powerhouse */}
          <section
            id="products"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  AI Powerhouse
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Products
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Product Headline
                  </label>
                  <input
                    type="text"
                    value={productsTitle}
                    onChange={(e) => setProductsTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-purple-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={productsDescription}
                    onChange={(e) => setProductsDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-purple-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>
              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={productsCards}
                  onChange={setProductsCards}
                  cardTemplate={{
                    id: Date.now(),
                    title: "",
                    description: "",
                    category: "Products",
                    icon: "",
                    image: "",
                    bgColor: "",
                  }}
                  fieldOptions={{
                    category: ["Products", "Services", "Solutions"],
                  }}
                  title="Products & Services"
                  folder="products"
                />
                <div className="mt-8">
                  <FileUpload
                    label="Section Background Image"
                    value={productsBgImage}
                    onChange={setProductsBgImage}
                    folder="home"
                    type="image"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("AI Powerhouse", {
                      products_title: productsTitle,
                      products_description: productsDescription,
                      products_cards: productsCards,
                      products_bg_image: productsBgImage,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Products Intro</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4. Global Reach */}
          <section
            id="global"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Global Reach
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Global
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Global Title
                  </label>
                  <input
                    type="text"
                    value={globalTitle}
                    onChange={(e) => setGlobalTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-cyan-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Global Description
                  </label>
                  <textarea
                    value={globalDescription}
                    onChange={(e) => setGlobalDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-cyan-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={globalStats}
                  onChange={setGlobalStats}
                  cardTemplate={{ id: Date.now(), value: "", label: "" }}
                  title="Global Metrics"
                  folder="home"
                />
              </div>

              <div className="pt-8 border-t border-gray-100">
                <FileUpload
                  label="Upload Global Reach Video (Map Background)"
                  value={globalMapVideo}
                  onChange={setGlobalMapVideo}
                  folder="home"
                  type="video"
                />
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Global Reach", {
                      global_title: globalTitle,
                      global_description: globalDescription,
                      global_stats: globalStats,
                      global_map_video: globalMapVideo,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Global</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4.5 Experience Section */}
          <section
            id="experience"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Experience
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Experience
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="pt-8">
                <FileUpload
                  label="Experience Video"
                  value={experienceVideo}
                  onChange={setExperienceVideo}
                  folder="home"
                  type="video"
                />
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Experience", {
                      experience_video: experienceVideo,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Experience</span>
                </button>
              </div>
            </div>
          </section>

          {/* 5. Co-Architecting */}
          <section
            id="coarch"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Co-Architecting
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Partners
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Partners Title
                  </label>
                  <input
                    type="text"
                    value={coarchTitle}
                    onChange={(e) => setCoarchTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-emerald-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={coarchDescription}
                    onChange={(e) => setCoarchDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <CardManager
                  cards={partnerCards}
                  onChange={setPartnerCards}
                  cardTemplate={{
                    id: Date.now(),
                    name: "",
                    title: "",
                    companyLogo: "",
                    image: "",
                  }}
                  title="Partner Testimonials"
                  folder="partners"
                />
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Partners", {
                      coarch_title: coarchTitle,
                      coarch_description: coarchDescription,
                      coarch_partners: partnerCards,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Partners</span>
                </button>
              </div>
            </div>
          </section>

          {/* 6. Careers */}
          <section
            id="careers"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Careers Preview
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Careers
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Careers Title
                  </label>
                  <input
                    type="text"
                    value={careersTitle}
                    onChange={(e) => setCareersTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-rose-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Careers Description
                  </label>
                  <textarea
                    value={careersDescription}
                    onChange={(e) => setCareersDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-rose-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={careersImages}
                  onChange={setCareersImages}
                  cardTemplate={{ id: Date.now(), image: "" }}
                  title="Carousel Images"
                  folder="careers"
                />
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Careers", {
                      careers_title: careersTitle,
                      careers_description: careersDescription,
                      careers_images: careersImages,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Careers Preview</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
