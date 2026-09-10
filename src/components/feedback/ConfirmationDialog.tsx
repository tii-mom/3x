import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  details?: { label: string; value: string }[];
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = false,
  details = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E2E7F0] z-10 animate-scale-up space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isDestructive ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#F0F3FA] text-[#2F6BFF]'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#11141C] font-headline">{title}</h3>
              <p className="text-[13px] text-[#64748B] mt-0.5">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {details.length > 0 && (
          <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E7F0] space-y-2">
            {details.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[13px]">
                <span className="text-[#64748B]">{item.label}</span>
                <span className="font-semibold text-[#11141C] font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <SecondaryButton fullWidth onClick={onClose}>
            {cancelLabel}
          </SecondaryButton>
          <PrimaryButton
            fullWidth
            variant={isDestructive ? 'danger' : 'blue'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
