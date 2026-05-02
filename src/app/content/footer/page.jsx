"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import {
  Save,
  MapPin,
  Link as LinkIcon,
  Image as ImageIcon,
  Share2,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Copyright,
  Type,
  Rocket,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import CardManager from "../../components/CardManager";
import FileUpload from "../../components/FileUpload";

export default function FooterContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Locations Section
  const [locationsCards, setLocationsCards] = useState([]);

  // 2. Brand Section
  const [brandLogo, setBrandLogo] = useState("");
  const [brandDescription, setBrandDescription] = useState(
    "Asia's Largest AI Powerhouse. We fuse deep tech with essential industries providing the code behind the crop and the intelligence powering the grid.",
  );
  const [giantBackgroundImage, setGiantBackgroundImage] = useState("");
  const [copyrightText, setCopyrightText] = useState(
    "Betopia Group, All Rights Reserved.",
  );

  // 3. Navigation Links Section
  const [companyTitle, setCompanyTitle] = useState("Company");
  const [resourcesTitle, setResourcesTitle] = useState("Resources");
  const [connectTitle, setConnectTitle] = useState("Connect");
  const [companyLinks, setCompanyLinks] = useState([]);
  const [resourcesLinks, setResourcesLinks] = useState([]);
  const [connectLinks, setConnectLinks] = useState([]);

  // 4. Social Section
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("footer");

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

          if (key === "locations_cards") setLocationsCards(parsedValue);
          else if (key === "brand_logo") setBrandLogo(parsedValue);
          else if (key === "brand_description")
            setBrandDescription(parsedValue);
          else if (key === "giant_background_image")
            setGiantBackgroundImage(parsedValue);
          else if (key === "copyright_text") setCopyrightText(parsedValue);
          else if (key === "company_title") setCompanyTitle(parsedValue);
          else if (key === "resources_title") setResourcesTitle(parsedValue);
          else if (key === "connect_title") setConnectTitle(parsedValue);
          else if (key === "company_links") setCompanyLinks(parsedValue);
          else if (key === "resources_links") setResourcesLinks(parsedValue);
          else if (key === "connect_links") setConnectLinks(parsedValue);
          else if (key === "social_facebook") setSocialFacebook(parsedValue);
          else if (key === "social_twitter") setSocialTwitter(parsedValue);
          else if (key === "social_linkedin") setSocialLinkedin(parsedValue);
          else if (key === "social_youtube") setSocialYoutube(parsedValue);
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
      await savePageData("footer", data);
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
        "Reset all saved content for Footer page? This cannot be undone.",
      )
    )
      return;
    setResetting(true);
    try {
      await deletePageData("footer");
      setMessage({
        type: "success",
        text: "Footer content reset to defaults!",
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
            Loading Footer CMS...
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="mx-auto pb-10 px-4">
        {/* Header */}
        <div className="mb-8 py-6 flex justify-between items-center -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200/50">
          <div>
            <h1 className="text-4xl font-semibold text-gray-500 mb-2">
              Footer Content
            </h1>
            <p className="text-xs text-gray-400">
              Manage global office addresses, branding, and social presence
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
              <span className="font-normal">{message.text}</span>
            </div>
          )}
        </div>

        {/* Serial Content Layout */}
        <div className="mx-auto space-y-12">
          {/* 1. Global Locations */}
          <section
            id="locations"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Global Locations
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Offices
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="pt-8">
                <CardManager
                  cards={locationsCards}
                  onChange={setLocationsCards}
                  cardTemplate={{
                    id: Date.now(),
                    country: "",
                    icon: "",
                    address: "",
                    phone: "",
                  }}
                  title="Location Cards"
                  folder="locationIcon"
                />
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Locations", {
                      locations_cards: locationsCards,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Locations</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Brand & Identity */}
          <section
            id="brand"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Brand & Identity
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Identity
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div className="space-y-8">
                  <FileUpload
                    label="Footer Logo (White)"
                    value={brandLogo}
                    onChange={setBrandLogo}
                    folder="footer"
                    type="image"
                  />
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Footer Intro
                    </label>
                    <textarea
                      value={brandDescription}
                      onChange={(e) => setBrandDescription(e.target.value)}
                      rows={2}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-orange-500 transition-all resize-none shadow-xs"
                    />
                  </div>
                </div>
                <div className="space-y-8">
                  <FileUpload
                    label="Background Pattern"
                    value={giantBackgroundImage}
                    onChange={setGiantBackgroundImage}
                    folder="footer"
                    type="image"
                  />
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Copyright Label
                    </label>
                    <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      <Copyright size={20} className="text-orange-400" />
                      <input
                        type="text"
                        value={copyrightText}
                        onChange={(e) => setCopyrightText(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 w-full font-normal text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Brand Section", {
                      brand_logo: brandLogo,
                      brand_description: brandDescription,
                      giant_background_image: giantBackgroundImage,
                      copyright_text: copyrightText,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Brand</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. Navigation Links */}
          <section
            id="navigation"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Navigation Links
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Sitemap
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-12">
                {/* Column 1 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Type size={16} className="text-emerald-400" />
                    <input
                      type="text"
                      value={companyTitle}
                      onChange={(e) => setCompanyTitle(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 font-bold text-gray-900 uppercase tracking-widest text-sm"
                    />
                  </div>
                  <CardManager
                    cards={companyLinks}
                    onChange={setCompanyLinks}
                    cardTemplate={{ id: Date.now(), label: "", href: "" }}
                    title="Company Links"
                    folder="footer"
                  />
                </div>
                {/* Column 2 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Type size={16} className="text-emerald-400" />
                    <input
                      type="text"
                      value={resourcesTitle}
                      onChange={(e) => setResourcesTitle(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 font-bold text-gray-900 uppercase tracking-widest text-sm"
                    />
                  </div>
                  <CardManager
                    cards={resourcesLinks}
                    onChange={setResourcesLinks}
                    cardTemplate={{ id: Date.now(), label: "", href: "" }}
                    title="Resources Links"
                    folder="footer"
                  />
                </div>
                {/* Column 3 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Type size={16} className="text-emerald-400" />
                    <input
                      type="text"
                      value={connectTitle}
                      onChange={(e) => setConnectTitle(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 font-bold text-gray-900 uppercase tracking-widest text-sm"
                    />
                  </div>
                  <CardManager
                    cards={connectLinks}
                    onChange={setConnectLinks}
                    cardTemplate={{ id: Date.now(), label: "", href: "" }}
                    title="Connect Links"
                    folder="footer"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Navigation", {
                      company_title: companyTitle,
                      resources_title: resourcesTitle,
                      connect_title: connectTitle,
                      company_links: companyLinks,
                      resources_links: resourcesLinks,
                      connect_links: connectLinks,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Sitemap</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4. Social Presence */}
          <section
            id="social"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Social Presence
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Social
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-6">
                {[
                  {
                    label: "Facebook",
                    value: socialFacebook,
                    setter: setSocialFacebook,
                    icon: Facebook,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Twitter / X",
                    value: socialTwitter,
                    setter: setSocialTwitter,
                    icon: Twitter,
                    color: "text-sky-500",
                    bg: "bg-sky-50",
                  },
                  {
                    label: "LinkedIn",
                    value: socialLinkedin,
                    setter: setSocialLinkedin,
                    icon: Linkedin,
                    color: "text-blue-700",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "YouTube",
                    value: socialYoutube,
                    setter: setSocialYoutube,
                    icon: Youtube,
                    color: "text-red-600",
                    bg: "bg-red-50",
                  },
                ].map((social) => (
                  <div
                    key={social.label}
                    className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${social.bg} flex items-center justify-center shrink-0`}
                    >
                      <social.icon size={22} className={social.color} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-1">
                        {social.label}
                      </label>
                      <input
                        type="text"
                        value={social.value}
                        onChange={(e) => social.setter(e.target.value)}
                        placeholder={`https://www.${social.label.toLowerCase().split(" ")[0]}.com/...`}
                        className="bg-transparent border-none focus:ring-0 w-full font-normal text-gray-700 p-0 h-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Social Presence", {
                      social_facebook: socialFacebook,
                      social_twitter: socialTwitter,
                      social_linkedin: socialLinkedin,
                      social_youtube: socialYoutube,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Socials</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
