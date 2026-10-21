import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
  UserCheck,
  FileText,
  Eye,
  Filter,
  Layers,
  HelpCircle,
  FileCheck2,
  RotateCcw,
} from 'lucide-react';
import { ApplicationRecord, StageName, UserRole } from '../../types';

interface WorkflowViewProps {
  applications: ApplicationRecord[];
  onSelectApplication: (app: ApplicationRecord) => void;
  onUpdateApplication: (id: string, updates: Partial<ApplicationRecord>, actionName: string) => void;
  currentRole: UserRole;
}

export const WorkflowView: React.FC<WorkflowViewProps> = ({
  applications,
  onSelectApplication,
  onUpdateApplication,
  currentRole,
}) => {
  const [selectedWorkflowStage, setSelectedWorkflowStage] = useState<StageName | 'All' | 'Exception Queue'>('All');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'exceptionQueue'>('pipeline');

  // Complete 10-step statutory workflow nodes
  const WORKFLOW_STEPS = [
    { id: 1, title: 'Intake Submission', stage: 'Intake & Validation' as StageName, desc: 'Digital portal registration & fee verification' },
    { id: 2, title: 'Field Validation', stage: 'Intake & Validation' as StageName, desc: 'Mandatory statutory field completeness check' },
    { id: 3, title: 'Document Validation', stage: 'Intake & Validation' as StageName, desc: 'Deed, safety NOC, & faculty ratio checking' },
    { id: 4, title: 'Rule Resolution', stage: 'Rule Resolution' as StageName, desc: 'Provenanced APH handbook rule mapping' },
    { id: 5, title: 'Stage Gate Routing', stage: 'Rule Resolution' as StageName, desc: 'Autonomous routing to Scrutiny or EVC' },
    { id: 6, title: 'Official Review', stage: 'Scrutiny (EVC / SAC-SHC)' as StageName, desc: 'Scrutiny Committee inspection & evaluation' },
    { id: 7, title: 'EVC / SAC Decision', stage: 'Scrutiny (EVC / SAC-SHC)' as StageName, desc: 'Physical/hybrid site verification report' },
    { id: 8, title: 'Compliance Monitoring', stage: 'Compliance Monitoring' as StageName, desc: 'Dual-clock tracking of undertakings' },
    { id: 9, title: 'Alerts & Escalation', stage: 'Compliance Monitoring' as StageName, desc: 'Automated SLA notifications to Regional Officer' },
    { id: 10, title: 'Closure & Audit', stage: 'Final Decision' as StageName, desc: 'Member Secretary LOA issuance & tamper ledger' },
  ];

  // Stage summary counts
  const stageCounts = {
    'Intake & Validation': applications.filter((a) => a.currentStage === 'Intake & Validation').length,
    'Rule Resolution': applications.filter((a) => a.currentStage === 'Rule Resolution').length,
    'Scrutiny (EVC / SAC-SHC)': applications.filter((a) => a.currentStage === 'Scrutiny (EVC / SAC-SHC)').length,
    'Compliance Monitoring': applications.filter((a) => a.currentStage === 'Compliance Monitoring').length,
    'Final Decision': applications.filter((a) => a.currentStage === 'Final Decision').length,
    'Exception Queue': applications.filter((a) => a.status === 'Exception').length,
  };

  // Filtered applications based on stage selection
  const stageFilteredApps = applications.filter((app) => {
    if (selectedWorkflowStage === 'All') return true;
    if (selectedWorkflowStage === 'Exception Queue') return app.status === 'Exception';
    return app.currentStage === selectedWorkflowStage;
  });

  const exceptionApps = applications.filter((a) => a.status === 'Exception');

  const handleResolveException = (appId: string) => {
    onUpdateApplication(
      appId,
      {
        status: 'In Review',
        currentStage: 'Scrutiny (EVC / SAC-SHC)',
        ruleProvenance: {
          ruleId: 'RULE-2026-APH-04',
          ruleName: 'SAC Resolution on Pharmacy Inter-Regulatory Alignment',
          clauseReference: 'AICTE Executive Council Minute 114.3 & SAC Directive 2026',
          version: 'v2.4 (Manual Resolution by Bureau)',
          effectiveDate: '2026-10-21',
          criteriaMatched: 'Policy Bureau resolved state vs national threshold overlap',
          resolvedAt: new Date().toLocaleString(),
          status: 'Resolved',
        },
        observations: [
          'Policy Bureau examined inter-regulatory discrepancy and ruled that APH 2026-27 norms govern the infrastructure requirements.',
          'Transferred out of Exception Queue into Scrutiny stage.',
        ],
        clockState: {
          institutionClockDays: 0,
          officialReviewClockDays: 2,
          isPaused: false,
        },
      },
      'Manual Exception Resolution Recorded by Bureau'
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Workflow & Statutory Stage Gates</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            End-to-end statutory approval routing engine with automated rule resolution and exception branching
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pipeline'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Workflow Pipeline
          </button>
          <button
            onClick={() => setActiveTab('exceptionQueue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'exceptionQueue'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Exception Queue ({exceptionApps.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'pipeline' ? (
        <>
          {/* Interactive Visual Stage Pipeline Map */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 card-subtle-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">10-Step AICTE Statutory Workflow Map</h3>
                <p className="text-[11px] text-slate-400">
                  Click any stage card below to filter live cases in that pipeline node
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                Statutory Zero Auto-Approval Guardrail Active
              </span>
            </div>

            {/* Stage nodes scrollable row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {[
                { stage: 'Intake & Validation', label: '1. Intake & Validation', color: 'from-blue-500 to-blue-600', count: stageCounts['Intake & Validation'] },
                { stage: 'Rule Resolution', label: '2. Rule Resolution', color: 'from-emerald-500 to-emerald-600', count: stageCounts['Rule Resolution'] },
                { stage: 'Scrutiny (EVC / SAC-SHC)', label: '3. Scrutiny (EVC)', color: 'from-purple-500 to-purple-600', count: stageCounts['Scrutiny (EVC / SAC-SHC)'] },
                { stage: 'Compliance Monitoring', label: '4. Compliance & SLA', color: 'from-amber-500 to-amber-600', count: stageCounts['Compliance Monitoring'] },
                { stage: 'Final Decision', label: '5. Final Decision', color: 'from-rose-500 to-rose-600', count: stageCounts['Final Decision'] },
              ].map((node) => {
                const isSelected = selectedWorkflowStage === node.stage;
                return (
                  <button
                    key={node.stage}
                    onClick={() => setSelectedWorkflowStage(isSelected ? 'All' : (node.stage as StageName))}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">{node.label}</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {node.count}
                      </span>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${node.color} rounded-full`} style={{ width: '100%' }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Branching rules callout banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-600" />
                <span>Statutory Branching Logic & Decision Gateways:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-amber-700">Branch A: Missing Documents</span>
                  <p className="text-slate-500 mt-0.5">
                    Deficiency notice issued. Official review clock pauses; institution evidence clock runs for 10 calendar days.
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-rose-700">Branch B: Rule Ambiguity</span>
                  <p className="text-slate-500 mt-0.5">
                    Unresolved statutory conflict routes instantly to Exception Queue. No automated bypass allowed.
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-purple-700">Branch C: Mandatory EVC</span>
                  <p className="text-slate-500 mt-0.5">
                    New Institutions or new disciplines trigger mandatory Expert Visiting Committee scheduling before Member Secretary review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cases Currently in Selected Stage */}
          <div className="bg-white rounded-2xl border border-slate-200/80 card-subtle-shadow overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Applications in Stage: <span className="text-blue-600">{selectedWorkflowStage}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Showing {stageFilteredApps.length} active application dossiers
                </p>
              </div>

              {selectedWorkflowStage !== 'All' && (
                <button
                  onClick={() => setSelectedWorkflowStage('All')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Show All Stages
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {stageFilteredApps.slice(0, 15).map((app) => (
                <div
                  key={app.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-blue-600">{app.id}</span>
                      <span className="font-bold text-sm text-slate-900">{app.institutionName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : app.status === 'Deficiency'
                            ? 'bg-amber-50 text-amber-700'
                            : app.status === 'Exception'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {app.type} • {app.region} • Assigned to: <strong>{app.assignedOfficial}</strong>
                    </p>
                    {app.ruleProvenance && (
                      <p className="text-[11px] text-slate-400 font-mono">
                        Rule: {app.ruleProvenance.ruleId} ({app.ruleProvenance.clauseReference})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <p className="font-mono text-slate-600">{app.dueDate}</p>
                      <span
                        className={`text-[10px] font-bold ${
                          app.daysRemaining < 0 ? 'text-rose-600' : 'text-slate-400'
                        }`}
                      >
                        {app.daysRemaining < 0 ? 'Overdue' : `${app.daysRemaining} days remaining`}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectApplication(app)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Dossier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* EXCEPTION QUEUE VIEW */
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Statutory Rule Exception Queue (Human In The Loop)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              In accordance with AICTE Regulations, when an application cannot be resolved against established Approval
              Process Handbook rules due to regulatory conflict, missing policy parameters, or state-national jurisdictional
              overlap, the automated pipeline halts and puts the dossier here. <strong>No system may auto-approve or invent rules.</strong>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 card-subtle-shadow overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">
                Pending Regulatory Exceptions ({exceptionApps.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100 p-4 space-y-4">
              {exceptionApps.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Exception queue is currently clear. All cases successfully mapped to active rules.
                </div>
              ) : (
                exceptionApps.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl border border-rose-200 bg-white space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            {app.id}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{app.institutionName}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {app.type} • {app.category} • {app.region}
                        </p>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        Rule Conflict
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-200">
                      <p className="font-bold text-slate-800">Conflict / Exception Details:</p>
                      <p className="text-slate-600">
                        {app.ruleProvenance?.ruleName || 'Dual regulator threshold divergence between AICTE and State Council.'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Reference: {app.ruleProvenance?.clauseReference || 'APH 2026-27 vs State Technical Norms'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Application Evidence</span>
                      </button>

                      <button
                        onClick={() => handleResolveException(app.id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                      >
                        Record Policy Bureau Resolution & Resume Scrutiny
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
