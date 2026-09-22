import React from 'react';

export const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
      {text && <p className="text-xs text-neutral-500 font-medium">{text}</p>}
    </div>
  );
};
