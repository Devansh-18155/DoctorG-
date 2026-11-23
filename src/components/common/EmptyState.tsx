import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-100 shadow-2xs my-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-sm font-bold text-[#172B4D] mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-semibold shadow-xs shadow-teal-700/20 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
