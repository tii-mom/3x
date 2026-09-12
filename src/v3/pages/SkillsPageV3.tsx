import React, { useState } from 'react';
import { useAgentStore } from '../services/agentService';
import { SkillItem } from '../models/types';
import { Cpu, CheckCircle2, Plus, Zap, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SkillsPageV3: React.FC = () => {
  const { data, skillsCatalog, learnSkill, unbindSkill } = useAgentStore();
  const { skills } = data.agent;

  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const boundSkills = skills.filter((s) => s.bound);
  const maxSlots = 3; // Genesis 1X limit

  const handleLearnClick = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setShowConfirmModal(true);
  };

  const confirmLearn = () => {
    if (selectedSkill) {
      learnSkill(selectedSkill.id);
      setShowConfirmModal(false);
      setSelectedSkill(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Skill Circuits</h1>
            <p className="text-xs text-slate-500">
              Equip and bind capability circuits to expand MOMO's decision connectome
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-700">
            Equipped: {boundSkills.length}/{maxSlots}
          </span>
          <span className="block text-[10px] text-slate-400">Level 1X Capacity</span>
        </div>
      </div>

      {/* 1. Equipped Skill Slots */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
          Equipped Circuits ({boundSkills.length}/{maxSlots})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: maxSlots }).map((_, idx) => {
            const skill = boundSkills[idx];

            if (skill) {
              return (
                <div
                  key={skill.id}
                  className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded uppercase">
                        Slot {idx + 1} • {skill.tier}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{skill.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1 font-mono">
                      <Zap className="w-3 h-3 text-amber-500" />
                      {skill.energyCostEst}⚡ / op
                    </span>
                    <button
                      type="button"
                      onClick={() => unbindSkill(skill.id)}
                      className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      Unbind
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`empty_${idx}`}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center text-slate-400"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-500">Empty Slot {idx + 1}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Learn a circuit below</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Available Skill Catalog */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Available Skill Catalog</h2>
          <p className="text-xs text-slate-500">
            Certified decision circuits. Installing a skill structurally updates the Agent's decision path.
          </p>
        </div>

        <div className="space-y-3">
          {skillsCatalog.map((catalogSkill) => {
            const isEquipped = boundSkills.some((s) => s.id === catalogSkill.id);

            return (
              <div
                key={catalogSkill.id}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{catalogSkill.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          catalogSkill.tier === 'ADVANCED'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {catalogSkill.tier}
                      </span>
                      {isEquipped && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                      {catalogSkill.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                      <span>Circuit ID: {catalogSkill.circuitId}</span>
                      <span>• Est. Energy: {catalogSkill.energyCostEst}⚡</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {isEquipped ? (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold"
                    >
                      Already Equipped
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleLearnClick(catalogSkill)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Learn & Bind Circuit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedSkill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Install {selectedSkill.name}?
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This will bind the <strong>{selectedSkill.name}</strong> circuit to MOMO. The agent will immediately begin using this logic when evaluating tasks and opportunities.
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 mb-5 flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Behavioral Modification:</strong> Higher tier skills change reasoning structure rather than guaranteeing passive yield.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLearn}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Confirm & Bind Circuit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
