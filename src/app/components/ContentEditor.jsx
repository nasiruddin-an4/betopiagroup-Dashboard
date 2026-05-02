"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";

export default function ContentEditor({
  page,
  component,
  contentKey,
  label,
  initialValue = "",
  type = "text",
  multiline = false,
  rows = 3,
  onSave,
}) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' or 'error'

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          component,
          contentKey,
          value,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      setSaveStatus("success");
      if (onSave) onSave(value);

      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-black rounded-lg p-4 border border-gray-700">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={rows}
          className="w-full px-3 py-2 bg-[#414042] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f79549] focus:border-transparent resize-none font-['Outfit']"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 bg-[#414042] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f79549] focus:border-transparent font-['Outfit']"
        />
      )}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={handleSave}
          disabled={isSaving || value === initialValue}
          className="flex items-center gap-2 bg-[#f79549] hover:bg-[#ee2d46] text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save"}
        </button>

        {saveStatus === "success" && (
          <span className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            Saved successfully
          </span>
        )}
        {saveStatus === "error" && (
          <span className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            Failed to save
          </span>
        )}
      </div>
    </div>
  );
}
