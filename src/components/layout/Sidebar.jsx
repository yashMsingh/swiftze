// src/components/layout/Sidebar.jsx
import {
  User,
  CreditCard,
  MessageCircle,
  BarChart2,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { id: 'orders',    label: 'Orders',          Icon: () => (
    // Truck/delivery icon SVG to match reference
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )},
  { id: 'profile',   label: 'Profile',          Icon: User },
  { id: 'payment',   label: 'Payment Method',   Icon: CreditCard },
  { id: 'messages',  label: 'Messages',         Icon: MessageCircle },
  { id: 'analytics', label: 'Analytics',        Icon: BarChart2 },
  { id: 'help',      label: 'Help Center',      Icon: HelpCircle },
  { id: 'settings',  label: 'Settings',         Icon: Settings },
];

export default function Sidebar({ activeNav = 'settings', onNavChange }) {
  return (
    <aside
      className="fixed left-0 top-0 h-full bg-white flex flex-col z-10"
      style={{ width: '267px' }}
    >
      {/* Logo */}
      <div className="pt-[105px] pb-[68px] flex justify-center flex-shrink-0">
        <div className="w-[52px] h-[42px] flex items-center justify-center">
          {/* Swiftze bag+truck logo */}
          <svg width="52" height="42" viewBox="0 0 52 42" fill="none">
            <path d="M3 16h30l4 18H0l3-18Z" fill="#FF1324"/>
            <path d="M34 21h9l6 8v5H37l-3-13Z" fill="#FF1324"/>
            <path d="M15 16c0-8 4-13 10-13s10 5 10 13" stroke="#2F2F32" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="35" r="4" fill="white"/>
            <circle cx="40" cy="35" r="4" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-[15px] flex flex-col gap-[17px]">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => onNavChange?.(id)}
              className={`w-full h-[59px] flex items-center gap-[15px] px-[18px] rounded-[13px] transition-colors duration-150 focus:outline-none ${
                isActive
                  ? 'bg-[#FF4050] text-white'
                  : 'text-[#4A4A4D] hover:bg-[#F4F4F5] hover:text-[#111827]'
              }`}
            >
              {typeof Icon === 'function' ? (
                <span className="flex-shrink-0"><Icon /></span>
              ) : (
                <Icon size={21} strokeWidth={1.8} className="flex-shrink-0" />
              )}
              <span className="text-[19px] font-medium whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Log out */}
      <div className="px-[30px] pb-[130px] flex-shrink-0">
        <button className="w-full flex items-center gap-[15px] text-[#4A4A4D] hover:text-[#111827] transition-colors duration-150 focus:outline-none">
          <LogOut size={21} strokeWidth={1.8} className="flex-shrink-0" />
          <span className="text-[19px] font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
