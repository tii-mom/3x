import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, ShoppingBag, Activity, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/app', label: 'AI', icon: Bot, end: true },
  { to: '/app/market', label: 'Market', icon: ShoppingBag },
  { to: '/app/activity', label: 'Activity', icon: Activity },
  { to: '/app/me', label: 'Me', icon: User },
];

export const BottomNavigation: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-[env(safe-area-inset-bottom,8px)] px-4">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-600 font-semibold scale-105'
                    : 'text-slate-500 hover:text-slate-800 font-normal'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export const DesktopHeaderNav: React.FC = () => {
  return (
    <div className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
