import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  ArrowRight,
  FileCheck,
  GitBranch,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { ApplicationRecord } from '../../types';
import { NavTab } from '../layout/Sidebar';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenApplication: (appId: string) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenApplication,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Open Submitted Application',
      summary: 'Inspect submitted technical institution dossier with complete metadata and documents.',
      targetAppId: 'SAK-2026-1142',
      targetTab: 'applications' as NavTab,
      actionText: 'Open Application SAK-2026-1142',
      notes: 'Demonstrates intake data, 5 uploaded statutory documents, and initial compliance clock.',
    },
    {
      num: 2,
      title: 'Validate Required Fields & Documents',
      summary: 'Run automated document checklist validation and view extracted OCR metadata with confidence scores.',
      targetAppId: 'SAK-2026-1142',
      targetTab: 'applications' as NavTab,
      actionText: 'View Document Validation in SAK-2026-1142',
      notes: 'Highlights human-in-the-loop verification requirement (e.g. 98% confidence on Land Ownership deed).',
    },
    {
      num: 3,
      title: 'Resolve Configured Rule & Show Provenance',
      summary: 'Inspect how SAKSHAM matches statutory handbook clauses to the application type.',
      targetAppId: 'SAK-2026-1142',
      targetTab: 'applications' as NavTab,
      actionText: 'Inspect Rule RULE-2026-APH-01 Provenance',
      notes: 'Shows exact clause citation: AICTE APH 2026-27 Ch. I Clause 1.4.2 & 1.6 (v2.4).',
    },
    {
      num: 4,
      title: 'Route Application to Permitted Stage',
      summary: 'Advance application from Intake into Scrutiny (EVC / SAC-SHC) committee queue.',
      targetAppId: 'SAK-2026-1142',
      targetTab: 'workflow' as NavTab,
      actionText: 'View Pipeline in Workflow & Stages',
      notes: 'Illustrates stage gatekeeping: application cannot skip scrutiny when EVC is mandatory.',
    },
    {
      num: 5,
      title: 'Return for Missing Document / Deficiency',
      summary: 'Issue a formal deficiency memo with a pause on statutory approval clock.',
      targetAppId: 'SAK-2026-1178',
      targetTab: 'applications' as NavTab,
      actionText: 'Inspect Deficient Case SAK-2026-1178',
      notes: 'Shows LN Engineering College returned for missing architect stamp on expansion blueprint.',
    },
    {
      num: 6,
      title: 'Resubmit Corrected Evidence (Institution)',
      summary: 'Simulate the institution user uploading corrected version v1.1 of the missing document.',
      targetAppId: 'SAK-2026-1178',
      targetTab: 'documents' as NavTab,
      actionText: 'Navigate to Documents Repository',
      notes: 'Audit history automatically logs resubmission timestamp and restarts review clock.',
    },
    {
      num: 7,
      title: 'Track Compliance Deadline & Reminder',
      summary: 'Inspect the dual-clock monitoring (Institution Clock vs Official Review Clock) and live SLA countdown.',
      targetAppId: 'SAK-2026-0876',
      targetTab: 'compliance' as NavTab,
      actionText: 'Go to Compliance & EVC Page',
      notes: 'Displays overdue undertaking with automated alert and escalation trigger.',
    },
    {
      num: 8,
      title: 'Unresolved Rule Exception Queue',
      summary: 'Demonstrate automated detection of conflicting rules routed to human Exception Queue.',
      targetAppId: 'SAK-2026-0987',
      targetTab: 'workflow' as NavTab,
      actionText: 'Inspect Exception Queue in Workflow',
      notes: 'RK Institute of Pharmacy (D.Pharm to B.Pharm overlap) safely held without illegal auto-approval.',
    },
    {
      num: 9,
      title: 'Record Authorised Official Decision',
      summary: 'Authorised Member Secretary records formal decision and generates approval LOA.',
      targetAppId: 'SAK-2026-1101',
      targetTab: 'applications' as NavTab,
      actionText: 'Inspect Final Decision on SAK-2026-1101',
      notes: 'Closure approval recorded with LOA # AICTE/NWRO/CLOSURE/2026-27/044.',
    },
    {
      num: 10,
      title: 'Inspect Immutable Audit Trail',
      summary: 'Open the chronologically ordered event ledger with actor, role, timestamps, and rule references.',
      targetAppId: 'SAK-2026-1142',
      targetTab: 'audit' as NavTab,
      actionText: 'Go to Audit Trail',
      notes: 'Every single transition, deficiency return, resubmission, and alert is permanently accounted for.',
    },
    {
      num: 11,
      title: 'Dashboard Live Recalculation',
      summary: 'Verify live dashboard KPIs, bar charts, doughnut status distribution, and upcoming deadlines.',
      targetAppId: '',
      targetTab: 'dashboard' as NavTab,
      actionText: 'Return to Dashboard',
      notes: 'All 5 KPI cards and Recharts visualizations are derived directly from the active state store.',
    },
  ];

  const current = steps[activeStep];

  const handleExecute = () => {
    onNavigateTab(current.targetTab);
    if (current.targetAppId) {
      onOpenApplication(current.targetAppId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                <span>SIH 2026 Judge Demonstration Walkthrough</span>
                <span className="text-[10px] font-mono bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/40">
                  Step {activeStep + 1} of 11
                </span>
              </h3>
              <p className="text-xs text-blue-200 font-medium">
                End-to-end verification of statutory approval workflow & compliance intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Dots */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between overflow-x-auto gap-1">
          {steps.map((s, idx) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 transition-colors ${
                idx === activeStep
                  ? 'bg-blue-600 text-white shadow-xs'
                  : idx < activeStep
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200/70 text-slate-600 hover:bg-slate-300/70'
              }`}
            >
              <span>{s.num}</span>
              <span className="hidden sm:inline text-[11px] truncate max-w-[80px]">
                {s.title.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-xl shrink-0">
              {current.num}
            </div>
            <div className="flex-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-blue-600">
                Demonstration Requirement #{current.num}
              </span>
              <h4 className="text-lg font-bold text-slate-800 mt-0.5">{current.title}</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{current.summary}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>What Judges Should Verify Here:</span>
            </div>
            <p className="text-xs text-slate-700 leading-normal pl-6">{current.notes}</p>
            {current.targetAppId && (
              <div className="pl-6 pt-1 flex items-center gap-2 text-xs">
                <span className="text-slate-500">Demonstration target:</span>
                <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {current.targetAppId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExecute}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/30 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{current.actionText}</span>
            </button>

            {activeStep < steps.length - 1 ? (
              <button
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
