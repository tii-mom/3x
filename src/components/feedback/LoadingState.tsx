import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'AI is syncing portfolio telemetry...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center min-h-[220px] ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#090B10] border border-white/10 flex items-center justify-center text-[#3AC8FF] shadow-[0_0_20px_rgba(58,200,255,0.2)] mb-4">
        <Loader2 className="w-6 h-6 animate-spin text-[#3AC8FF]" />
      </div>
      <p className="text-[14px] font-medium text-[#11141C]">{message}</p>
      <p className="text-[12px] text-[#64748B] mt-1">Reading verifiable on-chain state from TON</p>
    </div>
  );
};
