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
  Flag,
  Users2,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Rocket,
  Image as ImageIcon,
  Film,
  Zap,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import FileUpload from "../../components/FileUpload";
import CardManager from "../../components/CardManager";

export default function AboutUsContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Hero Section
  const [heroTitle, setHeroTitle] = useState("Asia's Largest AI Powerhouse");
  const [heroSubtitle, setHeroSubtitle] = useState("One Intelligent Ecosystem");
  const [heroVideo, setHeroVideo] = useState("");
  const [heroMediaType, setHeroMediaType] = useState("video");
  const [heroDescription, setHeroDescription] = useState(
    "We are the convergence of 5,000+ minds, 14+ years of innovation, and a global network spanning the USA, UK, UAE, Philippines, and Bangladesh.",
  );

  // 2. Industry Section
  const [industryTitle, setIndustryTitle] = useState(
    "Enterprise challenges.\nStructured solutions.\nProven delivery.",
  );
  const [industryDescription, setIndustryDescription] = useState(
    'We operate as a "Universal Solution Architect." Our 22+ Strategic Business Units do not operate in silos; they function as a connected hive mind.',
  );
  const [industryCard1Title, setIndustryCard1Title] = useState("We Build.");
  const [industryCard1Desc, setIndustryCard1Desc] = useState(
    "The Architecture of Innovation.",
  );
  const [industryCard2Title, setIndustryCard2Title] = useState("We Secure.");
  const [industryCard2Desc, setIndustryCard2Desc] = useState(
    "The Governance of Trust.",
  );
  const [industryCard3Title, setIndustryCard3Title] = useState("We Optimize.");
  const [industryCard3Desc, setIndustryCard3Desc] = useState(
    "The Intelligence of AI.",
  );

  // 3. What Drives Us Section
  const [drivesTitle, setDrivesTitle] = useState("What Drives Us");
  const [drivesDescription, setDrivesDescription] = useState(
    "In a world full of talent, we bridge the disconnect between ambition and achievement.",
  );
  const [drivesImage, setDrivesImage] = useState("");

  // 4. Cultural Code Section
  const [culturalTitle, setCulturalTitle] = useState("Our DNA Code");
  const [culturalSubtitle, setCulturalSubtitle] = useState(
    "5,000+ Minds. 22+ SBU. One Vision.",
  );
  const [culturalMedia, setCulturalMedia] = useState("");
  const [culturalMediaType, setCulturalMediaType] = useState("video");
  const [culturalCards, setCulturalCards] = useState([]);

  // 5. Leadership Section
  const [leadershipTitle, setLeadershipTitle] = useState(
    "Visionary Leadership",
  );
  const [leadershipDescription, setLeadershipDescription] = useState(
    "Great innovation requires steady hands and bold vision.",
  );
  const [leadershipCards, setLeadershipCards] = useState([]);

  // 6. Ecosystem Section
  const [ecosystemMedia, setEcosystemMedia] = useState("");

  // 7. Promise Section
  const [promiseImages, setPromiseImages] = useState([]);

  // 8. Transformation Section
  const [transformationIcon, setTransformationIcon] = useState("");
  const [transformationTitle, setTransformationTitle] = useState(
    "Let's Bridge the Gap Between Potential and Reality",
  );
  const [transformationDescription, setTransformationDescription] = useState(
    "We have the technology, the talent, and the vision. All we are missing is your challenge. Let's build the extraordinary together.",
  );

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("about-us");

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
          else if (key === "hero_subtitle") setHeroSubtitle(parsedValue);
          else if (key === "hero_video") setHeroVideo(parsedValue);
          else if (key === "hero_mediaType") setHeroMediaType(parsedValue);
          else if (key === "hero_description") setHeroDescription(parsedValue);
          else if (key === "industry_title") setIndustryTitle(parsedValue);
          else if (key === "industry_description")
            setIndustryDescription(parsedValue);
          else if (key === "industry_card1_title")
            setIndustryCard1Title(parsedValue);
          else if (key === "industry_card1_desc")
            setIndustryCard1Desc(parsedValue);
          else if (key === "industry_card2_title")
            setIndustryCard2Title(parsedValue);
          else if (key === "industry_card2_desc")
            setIndustryCard2Desc(parsedValue);
          else if (key === "industry_card3_title")
            setIndustryCard3Title(parsedValue);
          else if (key === "industry_card3_desc")
            setIndustryCard3Desc(parsedValue);
          else if (key === "drives_title") setDrivesTitle(parsedValue);
          else if (key === "drives_description")
            setDrivesDescription(parsedValue);
          else if (key === "drives_image") setDrivesImage(parsedValue);
          else if (key === "cultural_title") setCulturalTitle(parsedValue);
          else if (key === "cultural_subtitle")
            setCulturalSubtitle(parsedValue);
          else if (key === "cultural_media") setCulturalMedia(parsedValue);
          else if (key === "cultural_mediaType")
            setCulturalMediaType(parsedValue);
          else if (key === "cultural_cards") setCulturalCards(parsedValue);
          else if (key === "leadership_title") setLeadershipTitle(parsedValue);
          else if (key === "leadership_description")
            setLeadershipDescription(parsedValue);
          else if (key === "leadership_cards") setLeadershipCards(parsedValue);
          else if (key === "ecosystem_media") setEcosystemMedia(parsedValue);
          else if (key === "promise_images") setPromiseImages(parsedValue);
          else if (key === "transformation_icon")
            setTransformationIcon(parsedValue);
          else if (key === "transformation_title")
            setTransformationTitle(parsedValue);
          else if (key === "transformation_description")
            setTransformationDescription(parsedValue);
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
      await savePageData("about-us", data);
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
        "Reset all saved content for About Us page? This cannot be undone.",
      )
    )
      return;
    setResetting(true);
    try {
      await deletePageData("about-us");
      setMessage({ type: "success", text: "About Us page reset to defaults!" });
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
            Loading About Us CMS...
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
              About Us Content
            </h1>
            <p className="text-xs text-gray-400">
              Manage company story, values, and leadership snapshots
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Hero Section
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Landing
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Main Title
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
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                    />
                  </div>
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
                    label={heroMediaType === "video" ? "Hero Video" : "Hero Image"}
                    value={heroVideo}
                    onChange={setHeroVideo}
                    folder="about-us"
                    type={heroMediaType}
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Hero Section", {
                      hero_title: heroTitle,
                      hero_subtitle: heroSubtitle,
                      hero_description: heroDescription,
                      hero_video: heroVideo,
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

          {/* 2. Enterprise Solutions */}
          <section
            id="industry"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Enterprise Solutions
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Delivery
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Headline
                    </label>
                    <textarea
                      value={industryTitle}
                      onChange={(e) => setIndustryTitle(e.target.value)}
                      rows={3}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-orange-500 transition-all resize-none shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      value={industryDescription}
                      onChange={(e) => setIndustryDescription(e.target.value)}
                      rows={2}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-orange-500 transition-all resize-none shadow-xs"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    [
                      industryCard1Title,
                      setIndustryCard1Title,
                      industryCard1Desc,
                      setIndustryCard1Desc,
                      "Build",
                    ],
                    [
                      industryCard2Title,
                      setIndustryCard2Title,
                      industryCard2Desc,
                      setIndustryCard2Desc,
                      "Secure",
                    ],
                    [
                      industryCard3Title,
                      setIndustryCard3Title,
                      industryCard3Desc,
                      setIndustryCard3Desc,
                      "Optimize",
                    ],
                  ].map(([title, setTitle, desc, setDesc, label], i) => (
                    <div
                      key={i}
                      className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Zap size={18} className="text-orange-400" />
                        <span className="text-xs font-normal text-gray-400 uppercase tracking-widest">
                          Pillar {i + 1}: {label}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-normal focus:outline-none focus:border-orange-500 transition-all"
                      />
                      <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Description"
                        rows={2}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-normal focus:outline-none focus:border-orange-500 transition-all resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Enterprise Section", {
                      industry_title: industryTitle,
                      industry_description: industryDescription,
                      industry_card1_title: industryCard1Title,
                      industry_card1_desc: industryCard1Desc,
                      industry_card2_title: industryCard2Title,
                      industry_card2_desc: industryCard2Desc,
                      industry_card3_title: industryCard3Title,
                      industry_card3_desc: industryCard3Desc,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Solutions</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. What Drives Us */}
          <section
            id="drives"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  What Drives Us
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Purpose
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
                    value={drivesTitle}
                    onChange={(e) => setDrivesTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-emerald-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={drivesDescription}
                    onChange={(e) => setDrivesDescription(e.target.value)}
                    rows={4}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-xs"
                  />
                </div>

                <div className="space-y-4 p-8 rounded-xl border border-gray-100 bg-gray-50/30">
                  <FileUpload
                    label="Story Image"
                    value={drivesImage}
                    onChange={setDrivesImage}
                    folder="about-us"
                    type="image"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Purpose Section", {
                      drives_title: drivesTitle,
                      drives_description: drivesDescription,
                      drives_image: drivesImage,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Purpose</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4. DNA Code */}
          <section
            id="cultural"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Our DNA Code
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Values
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Title
                    </label>
                    <input
                      type="text"
                      value={culturalTitle}
                      onChange={(e) => setCulturalTitle(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-purple-500 transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={culturalSubtitle}
                      onChange={(e) => setCulturalSubtitle(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-purple-500 transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-8 rounded-xl border border-gray-100 bg-gray-50/30">
                  <div className="flex gap-4 p-1 bg-gray-100 rounded-xl w-fit">
                    <button
                      onClick={() => setCulturalMediaType("video")}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-normal transition-all ${
                        culturalMediaType === "video"
                          ? "bg-white text-purple-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Film size={18} />
                      Video
                    </button>
                    <button
                      onClick={() => setCulturalMediaType("image")}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-normal transition-all ${
                        culturalMediaType === "image"
                          ? "bg-white text-purple-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <ImageIcon size={18} />
                      Image
                    </button>
                  </div>
                  <FileUpload
                    label="Center Media"
                    value={culturalMedia}
                    onChange={setCulturalMedia}
                    folder="about-us"
                    type={culturalMediaType}
                  />
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <CardManager
                    cards={culturalCards}
                    onChange={setCulturalCards}
                    cardTemplate={{
                      id: Date.now(),
                      title: "",
                      description: "",
                      icon: "Target",
                    }}
                    title="DNA Pillars"
                    folder="about-us"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("DNA Section", {
                      cultural_title: culturalTitle,
                      cultural_subtitle: culturalSubtitle,
                      cultural_media: culturalMedia,
                      cultural_mediaType: culturalMediaType,
                      cultural_cards: culturalCards,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update DNA Code</span>
                </button>
              </div>
            </div>
          </section>

          {/* 5. Visionary Leadership */}
          <section
            id="leadership"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Visionary Leadership
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Team
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Leadership Title
                    </label>
                    <input
                      type="text"
                      value={leadershipTitle}
                      onChange={(e) => setLeadershipTitle(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-rose-500 transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      value={leadershipDescription}
                      onChange={(e) => setLeadershipDescription(e.target.value)}
                      rows={2}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-rose-500 transition-all resize-none shadow-xs"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <CardManager
                    cards={leadershipCards}
                    onChange={setLeadershipCards}
                    cardTemplate={{
                      id: Date.now(),
                      name: "",
                      title: "",
                      quote: "",
                      image: "",
                      link: "",
                    }}
                    title="Leadership Snapshot"
                    folder="leadership"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Leadership Section", {
                      leadership_title: leadershipTitle,
                      leadership_description: leadershipDescription,
                      leadership_cards: leadershipCards,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Leadership</span>
                </button>
              </div>
            </div>
          </section>

          {/* 6. Ecosystem Section */}
          <section
            id="ecosystem"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Ecosystem Section
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Business
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-4 p-8 rounded-xl border border-gray-100 bg-gray-50/30">
                <FileUpload
                  label="Ecosystem Video/Image"
                  value={ecosystemMedia}
                  onChange={setEcosystemMedia}
                  folder="about-us"
                  type="all"
                />
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Ecosystem Section", {
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

          {/* 7. Promise Section */}
          <section
            id="promise"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Promise Section
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Assets
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="pt-8">
                <CardManager
                  cards={promiseImages}
                  onChange={setPromiseImages}
                  cardTemplate={{
                    id: Date.now(),
                    image: "",
                  }}
                  title="Promise Section Images"
                  folder="about-us"
                />
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Promise Section", {
                      promise_images: promiseImages,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Promise Images</span>
                </button>
              </div>
            </div>
          </section>

          {/* 8. Transformation Section */}
          <section
            id="transformation"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Transformation Section
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Call to Action
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Title
                  </label>
                  <input
                    type="text"
                    value={transformationTitle}
                    onChange={(e) => setTransformationTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-amber-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={transformationDescription}
                    onChange={(e) => setTransformationDescription(e.target.value)}
                    rows={3}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-amber-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-4 p-8 rounded-xl border border-gray-100 bg-gray-50/30">
                <FileUpload
                  label="Transformation Illustration (Right Side)"
                  value={transformationIcon}
                  onChange={setTransformationIcon}
                  folder="about-us"
                  type="image"
                />
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Transformation Section", {
                      transformation_icon: transformationIcon,
                      transformation_title: transformationTitle,
                      transformation_description: transformationDescription,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Transformation Section</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
