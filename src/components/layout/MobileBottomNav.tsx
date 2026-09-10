import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Bot, Home, PieChart, Settings, Target } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const navItems = [
    { to: '/app', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { to: '/app/ai', label: 'AI', icon: <Bot className="w-5 h-5" /> },
    { to: '/app/portfolio', label: 'Assets', icon: <PieChart className="w-5 h-5" /> },
    { to: '/app/goal', label: 'Goal', icon: <Target className="w-5 h-5" /> },
    { to: '/app/activity', label: 'Activity', icon: <Activity className="w-5 h-5" /> },
    { to: '/app/controls', label: 'Controls', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-[#E2E7F0] px-2 py-2 flex items-center justify-around md:hidden"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/app'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#2F6BFF] font-bold'
                : 'text-[#64748B] hover:text-[#11141C] font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                {item.icon}
                {item.to === '/app/ai' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#3AC8FF] animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
