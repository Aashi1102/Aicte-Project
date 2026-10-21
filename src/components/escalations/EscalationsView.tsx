import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  UserCheck,
  CheckCircle2,
  Building,
  Eye,
  AlertOctagon,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { ApplicationRecord, AlertItem, UserRole } from '../../types';

interface EscalationsViewProps {
  applications: ApplicationRecord[];
  alerts: AlertItem[];
  onSelectApplication: (app: ApplicationRecord) => void;
  onResolveAlert: (id: string) => void;
  currentRole: UserRole;
}

export const EscalationsView: React.FC<EscalationsViewProps> = ({
  applications,
  alerts,
  onSelectApplication,
  onResolveAlert,
  currentRole,
}) => {
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');

  // Find overdue applications that are escalated
  const escalatedApps = applications.filter(
    (a) => a.status === 'Overdue' || a.status === 'Exception' || a.daysRemaining < 0
  );

  const escalatedAlerts = alerts.filter((a) => a.status === 'Escalated' || a.severity === 'Critical');

  // Hierarchy levels
  const TIERS = [
    {
      level: 1,
      title: 'Tier 1: Scrutiny Committee',
      slaWindow: 'Within 10 days of submission',
      role: 'Scrutiny Officer / Expert Panel',
      trigger: 'Missing documents or unacknowledged deficiency notice after 5 days',
      color: 'border-blue-300 bg-blue-50/50',
    },
    {
      level: 2,
      title: 'Tier 2: Regional Officer',
      slaWindow: '11 to 20 days',
      role: 'Regional Officer (RO)',
      trigger: 'Institution fails to submit evidence within 10 days or EVC inspection report delayed',
      color: 'border-amber-300 bg-amber-50/50',
    },
    {
      level: 3,
      title: 'Tier 3: Member Secretary & SAC',
      slaWindow: 'Beyond 21 days or Policy Ambiguity',
      role: 'Member Secretary / Standing Appellate Committee',
      trigger: 'Statutory deadline breached, rule conflict, or institutional grievance petition',
      color: 'border-rose-300 bg-rose-50/50',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Escalation Matrix & SLA Governance</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Multi-tier statutory hierarchy routing lapsed compliance obligations to responsible authorities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>{escalatedApps.length} Active Escalation Dossiers</span>
          </span>
        </div>
      </div>

      {/* 3-Tier Escalation Hierarchy Ladder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.level}
            onClick={() => setSelectedTier(selectedTier === tier.level ? 'all' : tier.level)}
            className={`p-5 rounded-2xl border card-subtle-shadow cursor-pointer transition-all ${tier.color} ${
              selectedTier === tier.level ? 'ring-2 ring-blue-600 shadow-md' : 'hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                Level 0{tier.level}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {tier.slaWindow}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mt-2">{tier.title}</h3>
            <p className="text-xs font-bold text-blue-700 mt-1">{tier.role}</p>

            <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-600">
              <strong>Escalation Threshold:</strong> {tier.trigger}
            </div>
          </div>
        ))}
      </div>

      {/* Active Escalated Cases */}
      <div className="bg-white rounded-2xl border border-slate-200/80 card-subtle-shadow overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Cases Under Escalation</h3>
            <p className="text-[11px] text-slate-400">
              Prioritized by days overdue and statutory risk level
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Click any row to open full audit dossier
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {escalatedApps.map((app) => (
            <div
              key={app.id}
              className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {app.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{app.institutionName}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    Tier-2 Escalation
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {app.type} • Assigned: <strong>{app.assignedOfficial}</strong> ({app.assignedRole})
                </p>
                <div className="text-[11px] text-slate-600 bg-rose-50/60 p-2 rounded border border-rose-100">
                  <strong>Root Cause:</strong>{' '}
                  {app.observations[app.observations.length - 1] || 'Statutory review window exceeded SLA.'}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-rose-600">
                    {app.daysRemaining < 0 ? `${Math.abs(app.daysRemaining)} Days Overdue` : 'Due Soon'}
                  </span>
                  <p className="text-[10px] text-slate-400">Deadline: {app.dueDate}</p>
                </div>

                <button
                  onClick={() => onSelectApplication(app)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Take Executive Action</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
