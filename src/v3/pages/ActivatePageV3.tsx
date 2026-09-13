import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAgentStore } from '../services/agentService';
import { ShieldCheck, Wallet, ArrowRight, AlertCircle, Lock, RefreshCw } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';

export const ActivatePageV3: React.FC = () => {
  const navigate = useNavigate();
  const {
    data,
    isWalletConnected,
    ownerAddress,
    isActivatedTestnet,
    connectOwnerWallet,
    prepareActivation,
    confirmActivation,
  } = useAgentStore();

  const [isPreparing, setIsPreparing] = useState(false);
  const [activationPrepared, setActivationPrepared] = useState<{
    environment: string;
    networkFeeEstimate: string;
    request: Record<string, unknown>;
  } | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleConnectWallet = () => {
    // Connect mock TON Testnet owner wallet
    connectOwnerWallet('EQC_owner_testnet_7721a9');
  };

  const handlePrepare = async () => {
    setIsPreparing(true);
    try {
      const res = await prepareActivation();
      setActivationPrepared(res);
    } finally {
      setIsPreparing(false);
    }
  };

  const handleConfirmDeploy = async () => {
    setIsDeploying(true);
    try {
      // Simulate real TonConnect sign & broadcast
      await new Promise((resolve) => setTimeout(resolve, 800));
      await confirmActivation('0x9a8f4412bc78dfb91024c');
      navigate('/app');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-lg w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
            3X
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-800">Activate on Testnet</span>
        </Link>
        <SimulationBadge environment="testnet" />
      </header>

      {/* Main Content */}
      <main className="max-w-lg w-full mx-auto px-6 py-4 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Activate {data.agent.name} on TON Testnet
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Deploy Agentic Subwallet with split-key security and owner root revocation
            </p>
          </div>

          {/* Already Activated State */}
          {isActivatedTestnet ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-emerald-800">Agentic Wallet Active</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                {data.agent.name} is already activated on TON Testnet.
              </p>
              <button
                onClick={() => navigate('/app')}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Step 1: Connect TON Owner Wallet */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Step 1: Owner Wallet
                  </span>
                  {isWalletConnected ? (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Required</span>
                  )}
                </div>

                {isWalletConnected ? (
                  <div className="flex items-center justify-between text-xs font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                    <span>{ownerAddress}</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-sans font-medium">
                      TON Testnet
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnectWallet}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect TON Testnet Wallet</span>
                  </button>
                )}
              </div>

              {/* Step 2: Prepare & Review Gas Disclosure */}
              {isWalletConnected && !activationPrepared && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Step 2: Prepare Agentic Contract
                  </span>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Generates typed deployment payload and verifies operator permissions under immutable risk limits.
                  </p>
                  <button
                    type="button"
                    onClick={handlePrepare}
                    disabled={isPreparing}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPreparing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>{isPreparing ? 'Preparing Estimate...' : 'Estimate Network Gas & Deploy'}</span>
                  </button>
                </div>
              )}

              {/* Step 3: Gas Disclosure & Confirmation */}
              {activationPrepared && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Estimated TON Network Gas:</span>
                    <span className="font-mono text-blue-700 text-sm font-bold">
                      {activationPrepared.networkFeeEstimate}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-blue-100 text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Network Fee Disclosure:</strong> This fee is consumed purely by TON Testnet validator gas for contract deployment. Zero platform fees are collected.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmDeploy}
                    disabled={isDeploying}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-blue-glow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>{isDeploying ? 'Broadcasting on Testnet...' : 'Sign & Activate on Testnet'}</span>
                  </button>
                </div>
              )}

              {/* Security Invariants Box */}
              <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/60 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Security & Ownership Invariants</span>
                </div>
                <p>• Root Ownership: Owner retains permanent master authority to pause or withdraw.</p>
                <p>• Isolated Operator Key: Operator keys are held in secure KMS boundaries and never exposed to browser or LLM contexts.</p>
                <p>• Instant Revocation: Owner can revoke operator split-key with a single click at any time.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-lg w-full mx-auto px-6 py-6 text-center text-xs text-slate-400">
        TON Testnet / Devnet environment • Smart contracts written in Tolk • MAINNET_EXECUTION is strictly false
      </footer>
    </div>
  );
};
