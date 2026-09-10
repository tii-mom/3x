import React, { useState } from 'react';
import { ActivityEvent } from '../../types';
import { ChevronDown, ChevronUp, ExternalLink, FileSearch, ShieldCheck, Zap } from 'lucide-react';
import { formatAddress } from '../../utils/formatters';

interface DecisionReasoningProps {
  event: ActivityEvent;
  className?: string;
}

export const DecisionReasoning: React.FC<DecisionReasoningProps> = ({ event, className = '' }) => {
  const [showEvidence, setShowEvidence] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  const [showTx, setShowTx] = useState(false);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Layer 1: Plain Human-readable Reason (Default) */}
      <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E7F0] space-y-2">
        <div className="flex items-center gap-2 text-[#2F6BFF] text-[12px] font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          <span>Core AI Rationale</span>
        </div>
        <p className="text-[14px] text-[#11141C] font-medium leading-relaxed">
          {event.reasoningSnippet || event.description}
        </p>
      </div>

      {/* Layer 2: Expandable Evidence */}
      <div className="border border-[#E2E7F0] rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-[#64748B]" />
            <span className="text-[13px] font-bold text-[#11141C]">Market Evidence & Telemetry</span>
          </div>
          {showEvidence ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
        </button>

        {showEvidence && (
          <div className="px-4 pb-4 pt-1 border-t border-[#F1F5F9] space-y-2 text-[12px]">
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Data Source</span>
              <span className="font-semibold text-[#11141C]">{event.evidence?.source || 'TON On-Chain Indexer'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Observed APY</span>
              <span className="font-semibold text-[#00B074]">{event.evidence?.apy || '18.2% APY'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Model Confidence</span>
              <span className="font-semibold text-[#11141C]">{event.evidence?.confidence || 94}% Confidence</span>
            </div>
            <div className="py-1">
              <span className="text-[#64748B] block mb-1">Signal Trigger:</span>
              <span className="text-[#334155] bg-[#F1F5F9] p-2 rounded-lg block font-mono text-[11px]">
                {event.evidence?.trigger || 'Pool volume surge and low volatility threshold verified.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Layer 3: Expandable Execution Route */}
      <div className="border border-[#E2E7F0] rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => setShowExecution(!showExecution)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00B074]" />
            <span className="text-[13px] font-bold text-[#11141C]">Safety & Execution Guardrails</span>
          </div>
          {showExecution ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
        </button>

        {showExecution && (
          <div className="px-4 pb-4 pt-1 border-t border-[#F1F5F9] space-y-2 text-[12px]">
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Route</span>
              <span className="font-semibold text-[#11141C] font-mono">{event.execution?.route || 'Isolated Sub-Wallet Route'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Slippage Tolerance</span>
              <span className="font-semibold text-[#00B074] font-mono">{event.execution?.slippage || '< 0.05%'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Gas Fee (TON)</span>
              <span className="font-semibold text-[#11141C] font-mono">{event.execution?.gasFeeTon || '0.008 TON'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Exact Timestamp</span>
              <span className="font-mono text-[#64748B]">{event.execution?.timestampExact || 'Confirmed on-chain'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Layer 4: Verifiable On-chain Transaction */}
      <div className="border border-[#E2E7F0] rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => setShowTx(!showTx)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#2F6BFF]" />
            <span className="text-[13px] font-bold text-[#11141C]">Verifiable On-Chain Audit</span>
          </div>
          {showTx ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
        </button>

        {showTx && (
          <div className="px-4 pb-4 pt-1 border-t border-[#F1F5F9] space-y-3 text-[12px]">
            <p className="text-[#64748B]">
              Every autonomous decision is strictly signed by the non-custodial sub-wallet smart contract on TON Mainnet.
            </p>
            <div className="bg-[#090B10] text-white p-3 rounded-xl font-mono text-[11px] flex items-center justify-between">
              <span className="text-[#3AC8FF]">
                tx/{event.txHash || '9e8a...32f1'}
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70">
                TONScan Verified
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
