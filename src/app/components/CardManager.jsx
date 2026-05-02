"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, GripVertical, Save, X } from "lucide-react";
import FileUpload from "./FileUpload";
import { showConfirm } from "../utils/alert";

export default function CardManager({
  cards,
  onChange,
  cardTemplate,
  title = "Cards",
  folder = "general",
  layout = "list", // "list" or "grid"
  fieldOptions = {}, // Support for dropdowns, e.g., { category: ["A", "B"] }
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  const handleAdd = () => {
    const newCard = { ...cardTemplate, id: Date.now() };
    setEditingCard(newCard);
    setEditingIndex(cards.length);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingCard({ ...cards[index] });
  };

  const handleSave = () => {
    const newCards = [...cards];
    if (editingIndex >= cards.length) {
      newCards.push(editingCard);
    } else {
      newCards[editingIndex] = editingCard;
    }
    onChange(newCards);
    setEditingIndex(null);
    setEditingCard(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingCard(null);
  };

  const handleDelete = async (index) => {
    const result = await showConfirm(
      "Delete Card?",
      "Are you sure you want to delete this card?"
    );
    if (result.isConfirmed) {
      const newCards = cards.filter((_, i) => i !== index);
      onChange(newCards);
    }
  };

  const handleMove = (index, direction) => {
    const newCards = [...cards];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    [newCards[index], newCards[targetIndex]] = [
      newCards[targetIndex],
      newCards[index],
    ];
    onChange(newCards);
  };

  const updateEditingCard = (field, value) => {
    setEditingCard({ ...editingCard, [field]: value });
  };

  const renderField = (key, value) => {
    // Check if it's an image or video field
    const isMediaField =
      key.toLowerCase().includes("image") ||
      key.toLowerCase().includes("icon") ||
      key.toLowerCase().includes("logo") ||
      key.toLowerCase().includes("video");

    if (isMediaField) {
      return (
        <FileUpload
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value || ""}
          onChange={(url) => updateEditingCard(key, url)}
          folder={folder}
          type={key.toLowerCase().includes("video") ? "video" : "image"}
        />
      );
    }

    if (fieldOptions[key]) {
      return (
        <div>
          <label className="block text-sm font-normal text-gray-500 mb-2 uppercase tracking-wider">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <select
            value={value || ""}
            onChange={(e) => updateEditingCard(key, e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-normal focus:outline-none focus:border-[#f79549] focus:ring-4 focus:ring-[#f79549]/5 transition-all shadow-xs"
          >
            <option value="" disabled>Select {key}</option>
            {fieldOptions[key].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    const isLongText = typeof value === "string" && value.length > 100;

    return (
      <div>
        <label className="block text-sm font-normal text-gray-500 mb-2 uppercase tracking-wider">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
        {isLongText ? (
          <textarea
            value={value || ""}
            onChange={(e) => updateEditingCard(key, e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-normal focus:outline-none focus:border-[#f79549] focus:ring-4 focus:ring-[#f79549]/5 transition-all resize-none shadow-xs"
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => updateEditingCard(key, e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-normal focus:outline-none focus:border-[#f79549] focus:ring-4 focus:ring-[#f79549]/5 transition-all resize-none shadow-xs"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#f79549] hover:bg-orange-600 text-white rounded-xl font-normal transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add Card</span>
        </button>
      </div>

      <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {cards.map((card, index) => (
          <div
            key={card.id || index}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            {editingIndex === index ? (
              <div className="space-y-4">
                {Object.keys(cardTemplate).map((key) => {
                  if (key === "id") return null;
                  return (
                    <div key={key}>{renderField(key, editingCard[key])}</div>
                  );
                })}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-normal transition-colors shadow-sm"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-normal transition-colors shadow-sm"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <GripVertical size={20} />
                  </button>
                  <button
                    onClick={() => handleMove(index, 1)}
                    disabled={index === cards.length - 1}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <GripVertical size={20} className="rotate-180" />
                  </button>
                </div>
                <div className="flex flex-1 min-w-0 gap-5 items-center pl-2">
                  {/* Primary Media Thumbnail */}
                  {(() => {
                    const mediaKeys = Object.keys(card).filter(k => 
                      k.toLowerCase().includes("image") || 
                      k.toLowerCase().includes("icon") || 
                      k.toLowerCase().includes("logo") || 
                      k.toLowerCase().includes("video")
                    );
                    const primaryMediaKey = mediaKeys.find(k => card[k]) || mediaKeys[0];
                    if (!primaryMediaKey) return null;
                    
                    const mediaVal = card[primaryMediaKey];
                    const isVid = primaryMediaKey.toLowerCase().includes("video");
                    
                    return (
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {mediaVal ? (
                          isVid ? (
                            <span className="text-xs text-blue-600 font-medium px-2 text-center">Video</span>
                          ) : (
                            <img src={mediaVal} alt="Thumbnail" className="w-full h-full object-contain p-2" />
                          )
                        ) : (
                          <span className="text-xs text-gray-400 text-center px-2">No Image</span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 space-y-1.5 text-sm">
                    {Object.entries(card).map(([key, value]) => {
                      if (key === "id") return null;
                      
                      const mediaKeys = Object.keys(card).filter(k => 
                        k.toLowerCase().includes("image") || 
                        k.toLowerCase().includes("icon") || 
                        k.toLowerCase().includes("logo") || 
                        k.toLowerCase().includes("video")
                      );
                      const primaryMediaKey = mediaKeys.find(k => card[k]) || mediaKeys[0];
                      
                      // Skip the primary media key since it's shown as the thumbnail
                      if (key === primaryMediaKey) return null;

                      const isMediaField =
                        key.toLowerCase().includes("image") ||
                        key.toLowerCase().includes("icon") ||
                        key.toLowerCase().includes("logo") ||
                        key.toLowerCase().includes("video");

                      return (
                        <div key={key} className="truncate">
                          <span className="text-gray-500 font-medium">{key}: </span>
                          {isMediaField ? (
                            <span className="text-blue-600 text-xs italic">{value ? "Media attached" : "None"}</span>
                          ) : (
                            <span className="text-gray-900 font-normal">{value || <span className="text-gray-300 italic">Empty</span>}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Card in Edit Mode */}
        {editingIndex >= cards.length && editingCard && (
          <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-4">
            <div className="space-y-4">
              {Object.keys(cardTemplate).map((key) => {
                if (key === "id") return null;
                return (
                  <div key={key}>{renderField(key, editingCard[key])}</div>
                );
              })}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-sm"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {cards.length === 0 && editingIndex === null && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 border border-gray-200 border-dashed rounded-lg shadow-sm">
          <p>No cards yet. Click "Add Card" to create one.</p>
        </div>
      )}
    </div>
  );
}
