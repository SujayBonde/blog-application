import React from 'react';

export const CategoryBadge = ({ name, onClick, active = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-neutral-900 text-white'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200/60'
      }`}
    >
      {name || 'General'}
    </button>
  );
};
