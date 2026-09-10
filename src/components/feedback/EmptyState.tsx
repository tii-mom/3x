import React from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import { SecondaryButton } from '../ui/SecondaryButton';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Activity Recorded Yet',
  description = 'Your AI Wealth Agent is currently evaluating liquidity pools and risk metrics.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-[#E2E7F0] ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#F0F3FA] flex items-center justify-center text-[#64748B] mb-4">
        <Bot className="w-6 h-6 text-[#2F6BFF]" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#11141C]">{title}</h3>
      <p className="text-[13px] text-[#64748B] mt-1.5 max-w-sm leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-5">
          <SecondaryButton size="sm" onClick={onAction} icon={<RefreshCw className="w-4 h-4" />}>
            {actionText}
          </SecondaryButton>
        </div>
      )}
    </div>
  );
};
