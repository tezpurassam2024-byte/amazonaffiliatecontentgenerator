import React from 'react';

interface AdSlotProps {
  placement: 'header' | 'in-content' | 'sidebar' | 'article-bottom' | 'footer';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const heightClasses = {
    header: 'h-24 max-w-4xl',
    'in-content': 'h-32 max-w-2xl my-8',
    sidebar: 'h-64 w-full',
    'article-bottom': 'h-40 max-w-3xl my-8',
    footer: 'h-24 max-w-5xl my-4',
  }[placement];

  return (
    <div
      className={`mx-auto flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-4 text-center transition-all hover:bg-slate-50 ${heightClasses} ${className}`}
      aria-label={`Advertisement Slot - ${placement}`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400"></span>
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Ad Space ({placement})
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Reserved for Google AdSense / Monetization Provider
      </p>
    </div>
  );
};
