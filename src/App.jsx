// src/App.jsx
import { useEffect, useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { getProfileBundle, logout } from './api/swiftzeApi';
import './index.css';

export default function App() {
  // Auth state — check localStorage on mount for an existing session
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [activeNav, setActiveNav] = useState('profile');
  const [filledImages, setFilledImages] = useState(false);

  // Header user info — loaded from API after login
  const [headerUser, setHeaderUser] = useState({ name: '', initials: '', id: '' });

  // On mount: check if a token already exists (page refresh persistence)
  useEffect(() => {
    const token = localStorage.getItem('swiftze_access_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  // Load header user info whenever auth state becomes true
  useEffect(() => {
    if (!isAuthenticated) return;

    getProfileBundle()
      .then((profile) => {
        setHeaderUser({
          name: profile.name || '',
          initials: profile.initials || '',
          id: profile.id || '',
        });
      })
      .catch(() => {
        // Header fields stay empty if API fails
      });
  }, [isAuthenticated]);

  const handleLoginSuccess = (user) => {
    setHeaderUser({
      name: user.full_name || '',
      initials: (user.full_name || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('') || 'U',
      id: user.id || '',
    });
    setIsAuthenticated(true);
    setActiveNav('profile');
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setHeaderUser({ name: '', initials: '', id: '' });
  };

  // Avoid flash of login page on refresh when a token exists
  if (!authChecked) return null;

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const isSettings = activeNav === 'settings';

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar — fixed 267px */}
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} onLogout={handleLogout} />

      {/* Main column */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '267px' }}>

        {/* Top header */}
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

            {/* Avatar — from API */}
            <div className="flex items-center gap-3">
              <div className="w-[58px] h-[58px] rounded-full bg-[#9CA3AF] flex items-center justify-center flex-shrink-0">
                <span className="text-[#2F2F32] text-[22px] font-bold">
                  {headerUser.initials || '…'}
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[14px] font-bold text-[#9CA3AF]">
                  {headerUser.name || '…'}
                </span>
                <span className="text-[14px] text-[#C5C5CA] mt-1">
                  {headerUser.id ? `ID: ${headerUser.id}` : ''}
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
