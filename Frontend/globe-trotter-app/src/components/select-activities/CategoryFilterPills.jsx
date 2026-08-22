import React from 'react';

const CATEGORIES = ['All', 'Adventure', 'Culture', 'Food', 'Leisure'];

export default function CategoryFilterPills({ activeCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2 px-margin-mobile mb-2">
      <div className="flex gap-2 w-max">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-5 py-2.5 rounded-xl font-label-md text-label-md transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
