import React, { useState } from 'react';

export default function CoverPhotoUploader({ value, onChange }) {
  const [preview, setPreview] = useState(value || null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      if (onChange) onChange(file, objectUrl);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (onChange) onChange(null, null);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-label-md text-on-surface ml-1">Cover Photo</label>
      <div className="w-full h-44 bg-surface-container-low rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:bg-surface-container-high cursor-pointer relative overflow-hidden group border-2 border-dashed border-outline-variant/40 hover:border-primary/50">
        {preview ? (
          <div className="absolute inset-0 w-full h-full">
            <img src={preview} alt="Cover Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <span className="text-white font-label-md bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">
                Change Photo
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-error text-on-error p-2 rounded-xl hover:scale-105 transition-transform"
                title="Remove photo"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined">add_photo_alternate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-md text-primary">Tap to upload</span>
              <span className="font-label-sm text-on-surface-variant mt-1">High-res landscape recommended</span>
            </div>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
