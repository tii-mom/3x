import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#E2E7F0] z-10 animate-scale-up max-h-[90vh] flex flex-col`}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full mx-auto mb-4 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F1F5F9] shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-[#11141C] font-headline">{title}</h2>
            {subtitle && <p className="text-[13px] text-[#64748B] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close sheet"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-black/5 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto py-4 flex-1 no-scrollbar space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
