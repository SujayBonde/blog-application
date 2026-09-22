import React from 'react';
import { BookOpen } from 'lucide-react';

export const EmptyState = ({
  title = 'No stories found',
  message = 'Try searching with different terms or selecting another category.',
  icon: Icon = BookOpen,
}) => {
  return (
    <div className="py-16 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-500 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 leading-relaxed">{message}</p>
    </div>
  );
};
