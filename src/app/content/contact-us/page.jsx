"use client";

import {
  loadPageData,
  savePageData,
  deletePageData,
} from "../../utils/pageDataApi";
import { useState, useEffect } from "react";
import {
  Save,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
  Phone,
  Globe,
  Building2,
  Rocket,
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import FileUpload from "../../components/FileUpload";
import CardManager from "../../components/CardManager";

export default function ContactUsContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Hero Section
  const [heroTitle, setHeroTitle] = useState("Let's Build Tomorrow Together.");
  const [heroDescription, setHeroDescription] = useState(
    "Whether you're looking for enterprise solutions, partnership opportunities, or just want to say hello, we're here to help.",
  );
  const [heroEmail, setHeroEmail] = useState("hello@betopiagroup.com");
  const [heroContact, setHeroContact] = useState("Global Operations 24/7");

  // 2. Contact Form Section
  const [formTitle, setFormTitle] = useState("Send us a message.");
  const [formDescription, setFormDescription] = useState(
    "Our global team of experts is ready to assist you. Fill out the form and we'll get back to you within 24 hours.",
  );

  // 3. Global Headquarters Section
  const [headquartersTitle, setHeadquartersTitle] = useState(
    "Global Headquarters.",
  );
  const [headquartersDescription, setHeadquartersDescription] = useState(
    "Strategy meets execution across our regional hubs.",
  );
  const [officeHubs, setOfficeHubs] = useState([]);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const flatData = await loadPageData("contact-us");

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
          else if (key === "hero_email") setHeroEmail(parsedValue);
          else if (key === "hero_contact") setHeroContact(parsedValue);
          else if (key === "form_title") setFormTitle(parsedValue);
          else if (key === "form_description") setFormDescription(parsedValue);
          else if (key === "headquarters_title")
            setHeadquartersTitle(parsedValue);
          else if (key === "headquarters_description")
            setHeadquartersDescription(parsedValue);
          else if (key === "office_hubs") setOfficeHubs(parsedValue);
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
      await savePageData("contact-us", data);
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
        "Reset all saved content for Contact Us page? This cannot be undone.",
      )
    )
      return;
    setResetting(true);
    try {
      await deletePageData("contact-us");
      setMessage({
        type: "success",
        text: "Contact Us page reset to defaults!",
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
            Loading Contact CMS...
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
              Contact Us Content
            </h1>
            <p className="text-xs text-gray-400">
              Manage global office locations and contact messaging
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
                Contact
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Hero Title
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
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                      Support Channels
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <Mail size={20} className="text-blue-400" />
                        <input
                          type="text"
                          value={heroEmail}
                          onChange={(e) => setHeroEmail(e.target.value)}
                          placeholder="Email Address"
                          className="bg-transparent border-none focus:ring-0 w-full font-normal text-gray-700"
                        />
                      </div>
                      <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <Globe size={20} className="text-blue-400" />
                        <input
                          type="text"
                          value={heroContact}
                          onChange={(e) => setHeroContact(e.target.value)}
                          placeholder="Operating Hours"
                          className="bg-transparent border-none focus:ring-0 w-full font-normal text-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Hero Section", {
                      hero_title: heroTitle,
                      hero_description: heroDescription,
                      hero_email: heroEmail,
                      hero_contact: heroContact,
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

          {/* 2. Message Form Section */}
          <section
            id="form"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Message Form
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Form
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Form Headline
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Form Subtext
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-orange-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("Form Section", {
                      form_title: formTitle,
                      form_description: formDescription,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Form Info</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. Global Headquarters */}
          <section
            id="hq"
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-50 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Global Headquarters
                </h2>
              </div>
              <span className="text-xs font-normal text-gray-300 uppercase tracking-[0.2em]">
                Offices
              </span>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    HQ Title
                  </label>
                  <input
                    type="text"
                    value={headquartersTitle}
                    onChange={(e) => setHeadquartersTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-emerald-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-400 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={headquartersDescription}
                    onChange={(e) => setHeadquartersDescription(e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-normal focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <CardManager
                  cards={officeHubs}
                  onChange={setOfficeHubs}
                  cardTemplate={{
                    id: Date.now(),
                    country: "",
                    city: "",
                    address: "",
                    phone: "",
                    email: "",
                    image: "",
                  }}
                  title="Global Office Hubs"
                  folder="contact-us"
                />
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-start">
                <button
                  onClick={() =>
                    saveSection("HQ Section", {
                      headquarters_title: headquartersTitle,
                      headquarters_description: headquartersDescription,
                      office_hubs: officeHubs,
                    })
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                >
                  <Save size={18} />
                  <span>Update Offices</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminSidebar>
  );
}
