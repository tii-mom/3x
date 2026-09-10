import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { SecondaryButton } from '../ui/SecondaryButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Connection Interrupted',
  message = 'Failed to load telemetry from the TON RPC network. Please try refreshing.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-[#FEF2F2] border border-[#FECACA] rounded-2xl ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#991B1B]">{title}</h3>
      <p className="text-[13px] text-[#B91C1C] mt-1.5 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <SecondaryButton size="sm" onClick={onRetry} icon={<RotateCcw className="w-4 h-4" />}>
            Retry Sync
          </SecondaryButton>
        </div>
      )}
    </div>
  );
};
