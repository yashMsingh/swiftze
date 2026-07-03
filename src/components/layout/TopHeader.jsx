// src/components/layout/TopHeader.jsx
import { Bell } from 'lucide-react';

export default function TopHeader({ title = 'Profile', name, id }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Bell */}
        <button className="w-10 h-10 rounded-full bg-bg-page flex items-center justify-center hover:bg-border-default transition-colors">
          <Bell size={18} className="text-text-secondary" />
        </button>
        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">CO</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text-primary leading-tight">{name}</span>
            <span className="text-xs text-text-muted leading-tight">ID: {id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
