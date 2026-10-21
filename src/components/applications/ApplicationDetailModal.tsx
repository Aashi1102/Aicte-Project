import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Building,
  User,
  ShieldCheck,
  FileWarning,
  UploadCloud,
  ChevronRight,
  Award,
  GitBranch,
  History,
  Calendar,
  Send,
  HelpCircle,
  FileCheck,
  AlertCircle,
  Play,
} from 'lucide-react';
import { ApplicationRecord, StageName, ApplicationStatus, UserRole } from '../../types';

interface ApplicationDetailModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  onUpdateApplication: (id: string, updates: Partial<ApplicationRecord>, actionName: string) => void;
  currentRole: UserRole;
  onNavigateTab?: (tab: any) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onUpdateApplication,
  currentRole,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'rules' | 'actions' | 'deficiencies' | 'audit'>('overview');
  const [deficiencyReason, setDeficiencyReason] = useState('');
  const [deficiencyMissingItem, setDeficiencyMissingItem] = useState('');
  const [showDeficiencyForm, setShowDeficiencyForm] = useState(false);
  const [officialObservation, setOfficialObservation] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');

  if (!application) return null;

  const STAGES: StageName[] = [
    'Intake & Validation',
    'Rule Resolution',
    'Scrutiny (EVC / SAC-SHC)',
    'Compliance Monitoring',
    'Final Decision',
  ];

  const currentStageIndex = STAGES.indexOf(application.currentStage);

  // Handlers for workflow actions
  const handleAdvanceStage = () => {
    if (currentStageIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentStageIndex + 1];
      onUpdateApplication(
        application.id,
        {
          currentStage: nextStage,
          status: 'In Review',
          observations: [...application.observations, `Advanced to ${nextStage} stage following authorized scrutiny.`],
        },
        `Advanced to stage: ${nextStage}`
      );
    }
  };

  const handleReturnDeficiency = () => {
    if (!deficiencyReason.trim()) return;

    const newNote = {
      id: `DEF-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      returnedBy: currentRole === 'AICTE Official' ? 'Joint Director Singh' : 'Authorized Scrutiny Officer',
      role: currentRole,
      reason: deficiencyReason,
      missingItems: deficiencyMissingItem ? [deficiencyMissingItem] : ['Additional document / clarification required'],
      status: 'Open' as const,
    };

    onUpdateApplication(
      application.id,
      {
        status: 'Deficiency',
        deficiencyHistory: [newNote, ...application.deficiencyHistory],
        observations: [
          ...application.observations,
          `Returned for deficiency: ${deficiencyReason}. Evidence submission clock running.`,
        ],
        clockState: {
          ...application.clockState,
          isPaused: true,
          pauseReason: `Deficiency notice issued: ${deficiencyReason}`,
        },
      },
      `Deficiency Notice Issued: ${deficiencyReason.slice(0, 50)}`
    );

    setShowDeficiencyForm(false);
    setDeficiencyReason('');
    setDeficiencyMissingItem('');
  };

  const handleResubmitEvidence = () => {
    const updatedDocs = application.documents.map((d) =>
      d.validationStatus === 'Deficient' || d.validationStatus === 'Pending'
        ? { ...d, validationStatus: 'Valid' as const, version: 'v1.1', reviewerComments: 'Corrected version uploaded and auto-checked.' }
        : d
    );

    const updatedHistory = application.deficiencyHistory.map((h, i) =>
      i === 0 ? { ...h, status: 'Resolved' as const, resubmittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : h
    );

    onUpdateApplication(
      application.id,
      {
        status: 'In Review',
        documents: updatedDocs,
        deficiencyHistory: updatedHistory,
        observations: [
          ...application.observations,
          'Corrected evidence resubmitted by Institution. Official review clock resumed.',
        ],
        clockState: {
          ...application.clockState,
          isPaused: false,
          pauseReason: undefined,
        },
      },
      'Corrected Evidence Resubmitted by Institution'
    );
  };

  const handleSendToExceptionQueue = () => {
    onUpdateApplication(
      application.id,
      {
        status: 'Exception',
        observations: [
          ...application.observations,
          'Case placed in Exception Queue due to rule conflict / lack of clear regulatory precedent. Awaiting Policy Bureau resolution.',
        ],
        clockState: {
          ...application.clockState,
          isPaused: true,
          pauseReason: 'Awaiting Policy Bureau exception resolution',
        },
      },
      'Transferred to Exception Queue (Rule Conflict)'
    );
  };

  const handleRecordFinalDecision = (verdict: 'Approved' | 'Rejected') => {
    const loaNum = verdict === 'Approved' ? `AICTE/LOA/2026-27/${application.id.slice(-4)}` : undefined;
    onUpdateApplication(
      application.id,
      {
        status: verdict === 'Approved' ? 'Approved' : 'Rejected',
        currentStage: 'Final Decision',
        finalDecision: {
          verdict,
          date: new Date().toISOString().split('T')[0],
          decidedBy: 'Member Secretary / Executive Committee',
          remarks: decisionNotes || (verdict === 'Approved' ? 'Approval granted as per APH 2026-27 provisions.' : 'Application rejected due to statutory non-compliance.'),
          loaNumber: loaNum,
        },
        observations: [
          ...application.observations,
          `Statutory Decision Recorded: ${verdict}. ${loaNum ? `Letter of Approval generated: ${loaNum}` : ''}`,
        ],
        clockState: {
          ...application.clockState,
          isPaused: true,
          pauseReason: 'Final statutory decision recorded',
        },
      },
      `Recorded Final Decision: ${verdict}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-blue-600 text-white tracking-wider">
              {application.id}
            </span>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight">
                {application.institutionName}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {application.type} • {application.category} • {application.region}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                application.status === 'Approved'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : application.status === 'Deficiency'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : application.status === 'Exception'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                  : application.status === 'Overdue'
                  ? 'bg-rose-600/30 text-rose-200 border border-rose-500/50'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
              }`}
            >
              {application.status}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workflow Stage Progress Tracker */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 shrink-0 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {STAGES.map((stg, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stg} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isPast
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-xs font-bold whitespace-nowrap ${
                        isCurrent
                          ? 'text-blue-700'
                          : isPast
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {stg}
                    </span>
                  </div>
                  {idx < STAGES.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-1 shrink-0 bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Clocks
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Document Checklist</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
              {application.documents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Rule Provenance</span>
            {application.ruleProvenance?.status === 'Conflicting' && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'actions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Stage Gate Actions
          </button>
          <button
            onClick={() => setActiveTab('deficiencies')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'deficiencies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Deficiency Memos</span>
            {application.deficiencyHistory.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                {application.deficiencyHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key metadata grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Assigned Official</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{application.assignedOfficial}</p>
                  <p className="text-[10px] text-slate-500">{application.assignedRole}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Proposed Intake</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{application.intakeProposed} Seats</p>
                  <p className="text-[10px] text-slate-500">{application.category}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Submission Date</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{application.submissionDate}</p>
                  <p className="text-[10px] text-slate-500">Cycle 2026-27</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Statutory Deadline</p>
                  <p className={`text-xs font-bold mt-0.5 ${application.daysRemaining < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {application.dueDate}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    {application.daysRemaining < 0 ? `${Math.abs(application.daysRemaining)} days overdue` : `${application.daysRemaining} days remaining`}
                  </p>
                </div>
              </div>

              {/* Dual Clock Monitor matching prompt requirement */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-blue-900">
                      Dual Statutory Clock Engine (Institution vs Official Review)
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      application.clockState.isPaused
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {application.clockState.isPaused ? 'Official Clock Paused' : 'Official Clock Running'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-[11px] font-semibold text-slate-500">Institution Evidence Clock</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      {application.clockState.institutionClockDays} Days Logged
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Time consumed by institution responding to deficiency notices
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-[11px] font-semibold text-slate-500">AICTE Official Review Clock</p>
                    <p className="text-lg font-black text-blue-600 mt-0.5">
                      {application.clockState.officialReviewClockDays} Days Active
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Active SLA scrutiny window (capped at 30 days as per APH)
                    </p>
                  </div>
                </div>

                {application.clockState.pauseReason && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>Clock pause rule applied: {application.clockState.pauseReason}</span>
                  </div>
                )}
              </div>

              {/* Final Decision Banner if closed */}
              {application.finalDecision && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>Statutory Decision: {application.finalDecision.verdict}</span>
                  </div>
                  <div className="mt-2 text-xs space-y-1 text-slate-700">
                    <p>
                      <strong>Letter of Approval (LOA):</strong> {application.finalDecision.loaNumber || 'N/A'}
                    </p>
                    <p>
                      <strong>Authorized Authority:</strong> {application.finalDecision.decidedBy}
                    </p>
                    <p>
                      <strong>Remarks:</strong> {application.finalDecision.remarks}
                    </p>
                  </div>
                </div>
              )}

              {/* Observations Log */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Recorded Scrutiny Observations</h4>
                <div className="space-y-2">
                  {application.observations.map((obs, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Mandatory Statutory Documents Checklist</h4>
                  <p className="text-[11px] text-slate-400">
                    Validated against AICTE APH 2026-27 Document Guidelines
                  </p>
                </div>
                {application.status === 'Deficiency' && (
                  <button
                    onClick={handleResubmitEvidence}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Simulate Resubmission (Institution)</span>
                  </button>
                )}
              </div>

              {application.documents.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  No documents attached to this record.
                </div>
              ) : (
                <div className="space-y-3">
                  {application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">{doc.name}</h5>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span>{doc.category}</span>
                              <span>•</span>
                              <span>{doc.fileSize}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-600">{doc.version}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.validationStatus === 'Valid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : doc.validationStatus === 'Deficient'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {doc.validationStatus}
                        </span>
                      </div>

                      {/* Extracted fields with confidence */}
                      {doc.extractedData && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-600 flex items-center gap-1.5">
                              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                              Extracted Metadata
                            </span>
                            <span className="font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded text-[10px]">
                              {Math.round(doc.extractedData.confidence * 100)}% Confidence • Human Verified
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                            {Object.entries(doc.extractedData.fields).map(([k, v]) => (
                              <div key={k} className="text-slate-700">
                                <span className="text-slate-400">{k}:</span> {v}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {doc.reviewerComments && (
                        <p className="text-[11px] text-slate-600 italic bg-slate-50/50 p-2 rounded">
                          <strong>Scrutiny Note:</strong> {doc.reviewerComments}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RULE PROVENANCE */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Rule Resolution & Statutory Provenance</h4>
                <p className="text-[11px] text-slate-400">
                  Every routing decision is traceable to an exact clause in the AICTE Approval Process Handbook
                </p>
              </div>

              {application.ruleProvenance ? (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                      {application.ruleProvenance.ruleId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        application.ruleProvenance.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {application.ruleProvenance.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{application.ruleProvenance.ruleName}</h5>
                    <p className="text-xs text-blue-800 font-semibold mt-0.5">
                      Statutory Citation: {application.ruleProvenance.clauseReference}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-blue-200/60">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Version & Effective Date</p>
                      <p className="font-semibold text-slate-800">
                        {application.ruleProvenance.version} (Effective {application.ruleProvenance.effectiveDate})
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Resolved Timestamp</p>
                      <p className="font-semibold text-slate-800">{application.ruleProvenance.resolvedAt}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-blue-100 text-xs">
                    <span className="font-bold text-slate-600">Criteria Matched:</span>{' '}
                    <span className="text-slate-800">{application.ruleProvenance.criteriaMatched}</span>
                  </div>

                  {application.ruleProvenance.status === 'Conflicting' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2">
                      <div className="flex items-center gap-2 text-rose-800 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Rule Conflict Detected</span>
                      </div>
                      <p className="text-rose-700">
                        The case presents conflicting statutory criteria that cannot be safely auto-resolved.
                        Human determination is mandated by regulations.
                      </p>
                      <button
                        onClick={handleSendToExceptionQueue}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors"
                      >
                        Transfer to Human Exception Queue
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  No automated rule provenance mapped yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STAGE GATE ACTIONS */}
          {activeTab === 'actions' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Authorised Stage Gate Controls</h4>
                <p className="text-[11px] text-slate-400">
                  Official review actions require role authorization. All actions are logged to Audit Trail.
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Advance Stage */}
                <button
                  onClick={handleAdvanceStage}
                  disabled={currentStageIndex >= STAGES.length - 1 || application.status === 'Deficiency'}
                  className="p-3.5 rounded-xl border border-blue-300 bg-blue-50/50 hover:bg-blue-100/60 text-left transition-colors disabled:opacity-40 disabled:pointer-events-none group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">Advance to Next Permitted Stage</span>
                    <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Route application forward if all current stage requirements and documents are satisfied.
                  </p>
                </button>

                {/* Return for Deficiency */}
                <button
                  onClick={() => setShowDeficiencyForm(true)}
                  className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-amber-100/60 text-left transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">Return for Deficiency Correction</span>
                    <FileWarning className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Serve formal deficiency memo. Pauses official review clock and starts institution clock.
                  </p>
                </button>
              </div>

              {/* Deficiency Input Modal/Box */}
              {showDeficiencyForm && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-3 animate-in fade-in duration-150">
                  <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Issue Deficiency Memo
                  </h5>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Specific Observation / Deficiency Reason</label>
                    <textarea
                      value={deficiencyReason}
                      onChange={(e) => setDeficiencyReason(e.target.value)}
                      placeholder="e.g. Missing authorized Architect stamp for newly proposed 4 AI/ML computer labs (Clause 2.3.4)"
                      className="w-full mt-1 p-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Required Rectified Evidence Item</label>
                    <input
                      type="text"
                      value={deficiencyMissingItem}
                      onChange={(e) => setDeficiencyMissingItem(e.target.value)}
                      placeholder="e.g. Architect-certified floor plan with carpet area specification"
                      className="w-full mt-1 p-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowDeficiencyForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReturnDeficiency}
                      disabled={!deficiencyReason.trim()}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-colors"
                    >
                      Issue Deficiency Notice
                    </button>
                  </div>
                </div>
              )}

              {/* Final Decision Section if at Final Decision stage */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Statutory Decision Gateway (Competent Authority)
                </h5>
                <p className="text-[11px] text-slate-500">
                  Reserved for Member Secretary / Executive Committee as per AICTE Act Section 10(k).
                </p>

                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Official decision note or conditions to be stated in the Letter of Approval (LOA)..."
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows={2}
                />

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => handleRecordFinalDecision('Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Grant Formal Approval (Issue LOA)</span>
                  </button>
                  <button
                    onClick={() => handleRecordFinalDecision('Rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Issue Refusal / Show-Cause
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEFICIENCIES */}
          {activeTab === 'deficiencies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Deficiency Notices & Rectification History</h4>
                  <p className="text-[11px] text-slate-400">
                    Transparent log of all return memos served to the applicant
                  </p>
                </div>
              </div>

              {application.deficiencyHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  No deficiency memos recorded for this application. Clean compliance record.
                </div>
              ) : (
                <div className="space-y-3">
                  {application.deficiencyHistory.map((def) => (
                    <div key={def.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-900">{def.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            def.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {def.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{def.reason}</p>
                      <div className="text-[11px] text-slate-600 space-y-1">
                        <p>
                          <strong>Missing Items:</strong> {def.missingItems.join(', ')}
                        </p>
                        <p>
                          <strong>Issued By:</strong> {def.returnedBy} ({def.role}) on {def.date}
                        </p>
                        {def.resubmittedAt && (
                          <p className="text-emerald-700 font-semibold">
                            ✓ Resubmitted by Institution on {def.resubmittedAt}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Audit Hash: SHA-256-{application.id.replace(/-/g, '')}-OK
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
