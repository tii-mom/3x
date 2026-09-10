import React from 'react';
import { Wallet, Bot, History, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      id="bottom-navigation"
      className="fixed bottom-0 left-0 right-0 w-full z-50 flex justify-around items-center px-4 py-2 max-w-[540px] mx-auto bg-[#F9F9FF]/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(10,13,18,0.06)] border-t border-[#C3C5D8]/30"
    >
      {/* Home Tab */}
      <button
        id="tab-home"
        type="button"
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer ${
          activeTab === 'home' ? 'text-[#0051DF]' : 'text-[#434655] hover:text-[#191C21]'
        }`}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[12px] font-medium mt-0.5">Home</span>
      </button>

      {/* AI Tab (Active focus) */}
      <button
        id="tab-ai"
        type="button"
        onClick={() => onSelectTab('ai')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer relative ${
          activeTab === 'ai' ? 'text-[#0051DF]' : 'text-[#434655] hover:text-[#191C21]'
        }`}
      >
        <Bot className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[12px] font-bold mt-0.5">AI</span>
        {activeTab === 'ai' && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#0051DF] absolute -bottom-0.5"></span>
        )}
      </button>

      {/* Activity Tab */}
      <button
        id="tab-activity"
        type="button"
        onClick={() => onSelectTab('activity')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer relative ${
          activeTab === 'activity' ? 'text-[#0051DF]' : 'text-[#434655] hover:text-[#191C21]'
        }`}
      >
        <History className="w-5 h-5" />
        <span className="text-[12px] font-medium mt-0.5">Activity</span>
        {activeTab === 'activity' && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#0051DF] absolute -bottom-0.5"></span>
        )}
      </button>

      {/* Account Tab */}
      <button
        id="tab-account"
        type="button"
        onClick={() => onSelectTab('account')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer relative ${
          activeTab === 'account' ? 'text-[#0051DF]' : 'text-[#434655] hover:text-[#191C21]'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[12px] font-medium mt-0.5">Account</span>
        {activeTab === 'account' && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#0051DF] absolute -bottom-0.5"></span>
        )}
      </button>
    </nav>
  );
};
