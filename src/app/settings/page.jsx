"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import {
  Save,
  AlertCircle,
  CheckCircle,
  Lock,
  Mail,
  User,
  RotateCcw,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
      }));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500 text-xl animate-pulse">Loading...</div>
        </div>
      </AdminSidebar>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      return;
    }

    if (
      (formData.newPassword || formData.newEmail) &&
      !formData.currentPassword
    ) {
      setMessage({
        type: "error",
        text: "Current password required to make changes",
      });
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/admin/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          newEmail: formData.newEmail || undefined,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      if (formData.name || formData.newEmail) {
        const updatedUser = { ...user };
        if (formData.name) updatedUser.name = formData.name;
        if (formData.newEmail) updatedUser.email = formData.newEmail;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetWebsite = async () => {
    const confirmed = window.confirm(
      "This will reset all dashboard-managed website content to hardcoded defaults. Continue?",
    );

    if (!confirmed) return;

    setMessage({ type: "", text: "" });
    setIsResetting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/admin/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset website");
      }

      setMessage({
        type: "success",
        text: "Website reset completed. Frontend now uses hardcoded defaults until new content is published.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsResetting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f79549] focus:ring-1 focus:ring-[#f79549] transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <AdminSidebar>
      <div className="container mx-auto pb-10">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-semibold text-gray-500 mb-2">
              Settings
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your profile, security, and website settings
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* ─── Left Column: Profile + Security ─── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <User className="text-[#f79549]" size={22} />
                  Profile Information
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        Full Name
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" />
                        Current Email
                      </span>
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm">
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" />
                        New Email
                        <span className="text-xs text-gray-400 font-normal">
                          (optional)
                        </span>
                      </span>
                    </label>
                    <input
                      type="email"
                      name="newEmail"
                      value={formData.newEmail}
                      onChange={handleChange}
                      placeholder="Enter new email address"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Lock className="text-[#f79549]" size={22} />
                  Security Settings
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5">
                        <KeyRound size={14} className="text-gray-400" />
                        Current Password
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        aria-label={
                          showPasswords.current
                            ? "Hide current password"
                            : "Show current password"
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Required to update email or password
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-1.5">
                          <Lock size={14} className="text-gray-400" />
                          New Password
                          <span className="text-xs text-gray-400 font-normal">
                            (optional)
                          </span>
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.next ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="Min 8 characters"
                          className={`${inputClass} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("next")}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                          aria-label={
                            showPasswords.next
                              ? "Hide new password"
                              : "Show new password"
                          }
                        >
                          {showPasswords.next ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-1.5">
                          <Lock size={14} className="text-gray-400" />
                          Confirm New Password
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm new password"
                          className={`${inputClass} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                          aria-label={
                            showPasswords.confirm
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showPasswords.confirm ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#f79549] hover:bg-orange-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Save size={20} />
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>

            {/* ─── Right Sidebar ─── */}
            <div className="space-y-6">
              {/* User Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#f79549] to-orange-600 flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "?"}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {user?.name || "Admin"}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Admin
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#f79549]" />
                  Security Tips
                </h3>
                <ul className="space-y-3">
                  {[
                    "Use a strong password with at least 8 characters",
                    "Include uppercase, lowercase, numbers & symbols",
                    "Never share your credentials with anyone",
                    "Log out when using shared devices",
                    "All changes are logged for security auditing",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-gray-600"
                    >
                      <CheckCircle
                        size={15}
                        className="text-emerald-500 mt-0.5 shrink-0"
                      />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" />
                  Danger Zone
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Reset all dashboard-managed content and news to return the
                  website to hardcoded defaults.
                </p>
                <button
                  type="button"
                  onClick={handleResetWebsite}
                  disabled={isResetting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RotateCcw size={16} />
                  {isResetting ? "Resetting Website..." : "Reset Website"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminSidebar>
  );
}
