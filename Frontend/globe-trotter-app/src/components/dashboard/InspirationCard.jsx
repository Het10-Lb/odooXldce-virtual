import React from 'react';
import { Link } from 'react-router-dom';

export default function InspirationCard({ item }) {
  return (
    <Link
      to={`/search/cities?q=${encodeURIComponent(item.name)}`}
      className="flex items-center gap-4 bg-surface rounded-2xl p-3 shadow-sm active:scale-[0.98] hover:shadow-md transition-all"
    >
      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
        <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
      </div>
      <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-headline-md text-headline-md text-lg text-on-surface truncate">{item.name}</h4>
          <span className="material-symbols-outlined text-outline-variant hover:text-error transition-colors">
            favorite_border
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{item.description}</p>
        <div className="flex gap-2 mt-1">
          {item.tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
