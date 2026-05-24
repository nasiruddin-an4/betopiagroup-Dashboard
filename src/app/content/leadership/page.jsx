"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import {
  Save,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  Heart,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Globe,
  Award,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import FileUpload from "../../components/FileUpload";
import CardManager from "../../components/CardManager";
import { showAlert, showConfirm } from "../../utils/alert";

export default function LeadershipContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Hero Section
  const [heroImage, setHeroImage] = useState("/LeaderImg.png");
  const [heroLabel, setHeroLabel] = useState("Our Leadership");
  const [heroTitle, setHeroTitle] = useState(
    "Visionaries Shaping\nthe Digital Future",
  );
  const [heroDescription, setHeroDescription] = useState(
    "Our leadership team combines decades of industry expertise with a passion for innovation.",
  );

  // 2. Philosophy Section
  const [philTitle, setPhilTitle] = useState(
    "Leadership That Inspires Excellence",
  );
  const [philDescription, setPhilDescription] = useState(
    "Our leadership philosophy is built on four core pillars that drive organizational success",
  );
  const [philPillars, setPhilPillars] = useState([]);

  // 3. Custodians Header
  const [custodiansTitle, setCustodiansTitle] = useState(
    "Custodians of the Future",
  );
  const [custodiansDescription, setCustodiansDescription] = useState(
    "Our leadership structure combines visionary foresight with operational excellence",
  );

  // 4. CEO Profile
  const [ceoName, setCeoName] = useState("Muhammad Monir Hossain");
  const [ceoTitle, setCeoTitle] = useState("Founder & CEO, Betopia Group");
  const [ceoBio, setCeoBio] = useState("Founder of 22+ worldwide ventures...");
  const [ceoImage, setCeoImage] = useState("/ceo.webp");
  const [ceoLink, setCeoLink] = useState("https://muhammadmonirhossain.com");

  // 5. Chairperson Profile
  const [chairName, setChairName] = useState("Sabina Akter");
  const [chairTitle, setChairTitle] = useState("Chairperson, Betopia Group");
  const [chairBio, setChairBio] = useState(
    "Sabina Akter represents the new era of leadership...",
  );
  const [chairImage, setChairImage] = useState("/chairman.webp");
  const [chairLink, setChairLink] = useState("https://sabinaakter.com/");

  // 6. Executive Management
  const [executives, setExecutives] = useState([]);
  
  // 7. Departmental Leadership
  const [departmental, setDepartmental] = useState([]);

  // 8. Vice Presidents
  const [vps, setVps] = useState([]);

  const applyDefaults = () => {
    setHeroImage("/LeaderImg.png");
    setHeroLabel("Our Leadership");
    setHeroTitle("Visionaries Shaping\nthe Digital Future");
    setHeroDescription(
      "Our leadership team combines decades of industry expertise with a passion for innovation.",
    );
    setPhilTitle("Leadership That Inspires Excellence");
    setPhilDescription(
      "Our leadership philosophy is built on four core pillars that drive organizational success",
    );
    setPhilPillars([]);
    setCustodiansTitle("Custodians of the Future");
    setCustodiansDescription(
      "Our leadership structure combines visionary foresight with operational excellence",
    );
    setCeoName("Muhammad Monir Hossain");
    setCeoTitle("Founder & CEO, Betopia Group");
    setCeoBio("Founder of 22+ worldwide ventures...");
    setCeoImage("/ceo.webp");
    setCeoLink("https://muhammadmonirhossain.com");
    setChairName("Sabina Akter");
    setChairTitle("Chairperson, Betopia Group");
    setChairBio("Sabina Akter represents the new era of leadership...");
    setChairImage("/chairman.webp");
    setChairLink("https://sabinaakter.com/");
    setExecutives([]);
    setDepartmental([]);
    setVps([]);
  };

  const updatePillar = (index, field, value) => {
    const newPillars = [...philPillars];
    newPillars[index][field] = value;
    setPhilPillars(newPillars);
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      applyDefaults();
      const flatData = await loadPageData("leadership");

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

          if (key === "hero_image") setHeroImage(parsedValue);
          else if (key === "hero_label") setHeroLabel(parsedValue);
          else if (key === "hero_title") setHeroTitle(parsedValue);
          else if (key === "hero_description") setHeroDescription(parsedValue);
          else if (key === "phil_title") setPhilTitle(parsedValue);
          else if (key === "phil_description") setPhilDescription(parsedValue);
          else if (key === "phil_pillars") setPhilPillars(parsedValue);
          else if (key === "custodians_title") setCustodiansTitle(parsedValue);
          else if (key === "custodians_description")
            setCustodiansDescription(parsedValue);
          else if (key === "ceo_name") setCeoName(parsedValue);
          else if (key === "ceo_title") setCeoTitle(parsedValue);
          else if (key === "ceo_bio") setCeoBio(parsedValue);
          else if (key === "ceo_image") setCeoImage(parsedValue);
          else if (key === "ceo_link") setCeoLink(parsedValue);
          else if (key === "chair_name") setChairName(parsedValue);
          else if (key === "chair_title") setChairTitle(parsedValue);
          else if (key === "chair_bio") setChairBio(parsedValue);
          else if (key === "chair_image") setChairImage(parsedValue);
          else if (key === "chair_link") setChairLink(parsedValue);
          else if (key === "executives") setExecutives(parsedValue);
          else if (key === "departmental") setDepartmental(parsedValue);
          else if (key === "vps") setVps(parsedValue);
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
      await savePageData("leadership", data);
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
      "Reset Leadership?",
      "Reset all saved content for Leadership? This cannot be undone.",
    );
    if (!result.isConfirmed) return;

    setResetting(true);
    try {
      await deletePageData("leadership");
      await showAlert("Reset Successful", "Leadership reset to defaults!");
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
            Loading Leadership...
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className=" mx-auto pb-20 px-4">
        {/* Sticky Header */}
        <div className="mb-8 sticky top-0 z-20  py-6 flex justify-between items-center -mx-4 px-4 sm:mx-0 sm:px-0">
          <div>
            <h1 className="text-3xl font-normal text-gray-500 mb-2">
              Leadership Content
            </h1>
            <p className="text-gray-400 text-sm">
              Manage the visionaries and philosophy behind Betopia Group
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() =>
                saveSection("Leadership Page", {
                  hero_image: heroImage,
                  hero_label: heroLabel,
                  hero_title: heroTitle,
                  hero_description: heroDescription,
                  phil_title: philTitle,
                  phil_description: philDescription,
                  phil_pillars: philPillars,
                  custodians_title: custodiansTitle,
                  custodians_description: custodiansDescription,
                  ceo_name: ceoName,
                  ceo_title: ceoTitle,
                  ceo_bio: ceoBio,
                  ceo_image: ceoImage,
                  ceo_link: ceoLink,
                  chair_name: chairName,
                  chair_title: chairTitle,
                  chair_bio: chairBio,
                  chair_image: chairImage,
                  chair_link: chairLink,
                  executives,
                  departmental,
                  vps,
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
                  <Users className="text-orange-500" size={22} />
                  Hero Section
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Introduction
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Section Label
                    </label>
                    <input
                      type="text"
                      value={heroLabel}
                      onChange={(e) => setHeroLabel(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Main Headline (use \n for line break)
                    </label>
                    <textarea
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-2xl font-normal focus:outline-none focus:border-orange-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <FileUpload
                    label="Hero Background Image"
                    value={heroImage}
                    onChange={setHeroImage}
                    folder="leadership"
                    type="image"
                  />
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Description
                    </label>
                    <textarea
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-orange-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Hero Section", {
                      hero_image: heroImage,
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

          {/* 2. Leadership Philosophy */}
          <section
            id="philosophy"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-normal text-lg">
                  2
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="text-blue-500" size={22} />
                  Leadership Philosophy
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Core Pillars
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Philosophy Title
                  </label>
                  <input
                    type="text"
                    value={philTitle}
                    onChange={(e) => setPhilTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Philosophy Description
                  </label>
                  <textarea
                    value={philDescription}
                    onChange={(e) => setPhilDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {philPillars.map((pillar, index) => (
                  <div
                    key={pillar.id || index}
                    className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-normal text-blue-600 uppercase tracking-widest">
                        Pillar {index + 1}
                      </label>
                      <span className="text-[10px] text-gray-400 font-normal bg-white px-2 py-1 rounded-lg shadow-xs">
                        {pillar.icon || "Award"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) =>
                        updatePillar(index, "title", e.target.value)
                      }
                      placeholder="Title"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-normal focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <textarea
                      value={pillar.description}
                      onChange={(e) =>
                        updatePillar(index, "description", e.target.value)
                      }
                      placeholder="Description"
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={philPillars}
                  onChange={setPhilPillars}
                  cardTemplate={{
                    id: Date.now(),
                    title: "",
                    description: "",
                    icon: "Award",
                  }}
                  title="Leadership Pillars"
                  folder="leadership"
                />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Philosophy Section", {
                      phil_title: philTitle,
                      phil_description: philDescription,
                      phil_pillars: philPillars,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Philosophy"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. Custodians Header */}
          <section
            id="custodians"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-normal text-lg">
                  3
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="text-purple-500" size={22} />
                  Custodians Header
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Team Intro
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Header Title
                  </label>
                  <input
                    type="text"
                    value={custodiansTitle}
                    onChange={(e) => setCustodiansTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                    Header Description
                  </label>
                  <textarea
                    value={custodiansDescription}
                    onChange={(e) => setCustodiansDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Custodians Header", {
                      custodians_title: custodiansTitle,
                      custodians_description: custodiansDescription,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Header"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4. CEO Profile */}
          <section
            id="ceo"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-normal text-lg">
                  4
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" size={22} />
                  CEO Profile
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Leadership
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={ceoName}
                        onChange={(e) => setCeoName(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                        Role
                      </label>
                      <input
                        type="text"
                        value={ceoTitle}
                        onChange={(e) => setCeoTitle(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Detailed Bio
                    </label>
                    <textarea
                      value={ceoBio}
                      onChange={(e) => setCeoBio(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Official Website Link
                    </label>
                    <input
                      type="url"
                      value={ceoLink}
                      onChange={(e) => setCeoLink(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-emerald-500 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <FileUpload
                    label="CEO Professional Portrait"
                    value={ceoImage}
                    onChange={setCeoImage}
                    folder="leadership"
                    type="image"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("CEO Profile", {
                      ceo_name: ceoName,
                      ceo_title: ceoTitle,
                      ceo_bio: ceoBio,
                      ceo_link: ceoLink,
                      ceo_image: ceoImage,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save CEO"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 5. Chairperson Profile */}
          <section
            id="chair"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 font-normal text-lg">
                  5
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="text-pink-500" size={22} />
                  Chairperson Profile
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Governance
              </span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={chairName}
                        onChange={(e) => setChairName(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-pink-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                        Role
                      </label>
                      <input
                        type="text"
                        value={chairTitle}
                        onChange={(e) => setChairTitle(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-normal focus:outline-none focus:border-pink-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Detailed Bio
                    </label>
                    <textarea
                      value={chairBio}
                      onChange={(e) => setChairBio(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-pink-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-3 uppercase tracking-tight">
                      Official Website Link
                    </label>
                    <input
                      type="url"
                      value={chairLink}
                      onChange={(e) => setChairLink(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-pink-500 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <FileUpload
                    label="Chairperson Professional Portrait"
                    value={chairImage}
                    onChange={setChairImage}
                    folder="leadership"
                    type="image"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Chairperson Profile", {
                      chair_name: chairName,
                      chair_title: chairTitle,
                      chair_bio: chairBio,
                      chair_link: chairLink,
                      chair_image: chairImage,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Chairperson"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 6. Executive Management */}
          <section
            id="executives"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 font-normal text-lg">
                  6
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="text-teal-500" size={22} />
                  Executive Management
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Leadership
              </span>
            </div>

            <div className="p-8 space-y-8">
              <CardManager
                cards={executives}
                onChange={setExecutives}
                cardTemplate={{
                  id: Date.now(),
                  name: "",
                  title: "",
                  image: "",
                }}
                title="Executives"
                folder="leadership"
              />
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Executive Management", {
                      executives,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Executives"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 7. Departmental Leadership */}
          <section
            id="departmental"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-normal text-lg">
                  7
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="text-indigo-500" size={22} />
                  Departmental Leadership
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Leadership
              </span>
            </div>

            <div className="p-8 space-y-8">
              <CardManager
                cards={departmental}
                onChange={setDepartmental}
                cardTemplate={{
                  id: Date.now(),
                  name: "",
                  title: "",
                  image: "",
                }}
                title="Departmental Leaders"
                folder="leadership"
              />
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Departmental Leadership", {
                      departmental,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save Departmental"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 8. Vice Presidents */}
          <section
            id="vps"
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 font-normal text-lg">
                  8
                </div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="text-fuchsia-500" size={22} />
                  Vice Presidents
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Leadership
              </span>
            </div>

            <div className="p-8 space-y-8">
              <CardManager
                cards={vps}
                onChange={setVps}
                cardTemplate={{
                  id: Date.now(),
                  name: "",
                  title: "",
                  image: "",
                }}
                title="Vice Presidents"
                folder="leadership"
              />
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() =>
                    saveSection("Vice Presidents", {
                      vps,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-normal transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save VPs"}</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
