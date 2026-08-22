import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toggleSaveCity } from '../../services/api';

export default function InspirationCard({ item }) {
  const [isSaved, setIsSaved] = useState(item.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  const displayName = item.name;
  const imageUrl =
    item.image ||
    item.bannerImageUrl ||
    item.imageUrl ||
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80';
  const description =
    item.description ||
    `Discover iconic landmarks, local culture, and top experiences in ${item.region || item.state || 'this destination'}.`;

  const tags =
    Array.isArray(item.tags) && item.tags.length > 0
      ? item.tags
      : [item.region, item.state || item.country].filter(Boolean);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsSaving(true);
      const res = await toggleSaveCity(item.id);
      setIsSaved(res.isSaved);
    } catch (err) {
      console.warn('Failed to toggle save city:', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Link
      to={`/search/cities?q=${encodeURIComponent(displayName)}`}
      className="flex items-center gap-4 bg-surface rounded-2xl p-3 shadow-sm active:scale-[0.98] hover:shadow-md transition-all relative"
    >
      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-surface-container">
        <img className="w-full h-full object-cover" src={imageUrl} alt={displayName} />
      </div>
      <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-headline-md text-headline-md text-lg text-on-surface truncate">{displayName}</h4>
          <button
            type="button"
            onClick={handleFavoriteClick}
            disabled={isSaving}
            className="p-1.5 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer text-on-surface"
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-colors ${
                isSaved ? 'text-error font-fill' : 'text-outline-variant hover:text-error'
              }`}
            >
              {isSaved ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
