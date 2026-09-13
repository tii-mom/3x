import React from 'react';
import { Environment } from '../models/types';
import { ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

interface Props {
  environment: Environment;
  className?: string;
}

export const SimulationBadge: React.FC<Props> = ({ environment, className = '' }) => {
  if (environment === 'simulation') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs ${className}`}
        title="Running in zero-risk sandbox mode. All balances and values are simulated."
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <Sparkles className="w-3.5 h-3.5" />
        <span>SIMULATION</span>
      </span>
    );
  }

  if (environment === 'testnet') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs ${className}`}
        title="Running on TON Testnet / TVM Devnet emulator. Native Tolk smart contracts."
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>TON TESTNET (DEV)</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs ${className}`}
      title="Mainnet execution is strictly disabled. Protocol safety invariant active."
    >
      <AlertTriangle className="w-3.5 h-3.5" />
      <span>MAINNET DISABLED</span>
    </span>
  );
};
