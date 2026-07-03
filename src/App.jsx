// src/App.jsx
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

export default function App() {
  const [activeNav, setActiveNav] = useState('settings');
  const [filledImages, setFilledImages] = useState(false);

  const isSettings = activeNav === 'settings';

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar — fixed 220px */}
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* Main column */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '267px' }}>

        {/* Top header — white, full width of content area */}
        <div className="h-[156px] bg-white px-[50px] flex items-center justify-between">
          <span className="text-[32px] font-bold text-[#2F2F32]">
            {isSettings ? 'Settings' : 'Profile'}
          </span>

          <div className="flex items-center gap-12">
            {/* Placeholder toggle (Profile only) */}
            {!isSettings && (
              <button
                onClick={() => setFilledImages(!filledImages)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  filledImages
                    ? 'bg-[#EF4444] text-white border-[#EF4444]'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                }`}
              >
                {filledImages ? '✓ Filled Photos' : 'Placeholders'}
              </button>
            )}

            {/* Bell */}
            <button className="relative w-14 h-14 rounded-full bg-[#F8F8FA] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {isSettings && (
                <span className="absolute top-[18px] right-[18px] w-2 h-2 rounded-full bg-[#EF4444]" />
              )}
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className={`w-[58px] h-[58px] rounded-full flex items-center justify-center flex-shrink-0 ${isSettings ? 'bg-[#A6A6A6]' : 'bg-[#9CA3AF]'}`}>
                <span className="text-[#2F2F32] text-[26px] font-bold">{isSettings ? 'UM' : 'CO'}</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[14px] font-bold text-[#9CA3AF]">
                  {isSettings ? 'UKosco Media' : 'Catherine Ojong'}
                </span>
                <span className="text-[14px] text-[#C5C5CA] mt-1">
                  ID: {isSettings ? '2345678' : '1234567'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className={`flex-1 overflow-y-auto ${isSettings ? 'bg-white' : 'bg-[#F4F4F5]'}`}>
          {isSettings ? (
            <div className="px-6 pt-[45px] pb-[38px] max-w-[948px] mx-auto w-full">
              <SettingsPage />
            </div>
          ) : (
            <div className="px-10 py-8">
              <ProfilePage filledImages={filledImages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
