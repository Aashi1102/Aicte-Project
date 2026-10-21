import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Send,
  RotateCcw,
  ShieldAlert,
  Calendar,
  Check,
  Eye,
  Info,
} from 'lucide-react';
import { AlertItem, ApplicationRecord, UserRole } from '../../types';

interface AlertsViewProps {
  alerts: AlertItem[];
  onMarkRead: (id: string) => void;
  onResolveAlert: (id: string) => void;
  onTriggerManualReminder: (alert: AlertItem) => void;
  currentRole: UserRole;
  onOpenApplication?: (appId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onMarkRead,
  onResolveAlert,
  onTriggerManualReminder,
  currentRole,
  onOpenApplication,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'Critical' | 'Warning' | 'Info'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reminderDispatched, setReminderDispatched] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = severityFilter === 'all' || a.severity === severityFilter;
    const matchesStat = statusFilter === 'all' || a.status === statusFilter;
    return matchesSev && matchesStat;
  });

  const handleDispatch = (item: AlertItem) => {
    onTriggerManualReminder(item);
    setReminderDispatched(item.id);
    setTimeout(() => setReminderDispatched(null), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Deadlines & Alert Management Centre</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Proactive automated notifications, SLA countdowns, and duplicate-suppressed alert dispatching
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
            In-App Prototype Notification Engine Active
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 card-subtle-shadow">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Alert Events</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{alerts.length}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Recorded across cycle</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-rose-100 card-subtle-shadow">
          <p className="text-xs font-bold text-rose-600 uppercase">Critical Severity</p>
          <h3 className="text-2xl font-extrabold text-rose-600 mt-1">
            {alerts.filter((a) => a.severity === 'Critical').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">SLA breaches & conflicts</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-amber-100 card-subtle-shadow">
          <p className="text-xs font-bold text-amber-600 uppercase">Reminders & Warnings</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
            {alerts.filter((a) => a.severity === 'Warning').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Upcoming deadline nudges</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-emerald-100 card-subtle-shadow">
          <p className="text-xs font-bold text-emerald-600 uppercase">Resolved</p>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
            {alerts.filter((a) => a.status === 'Resolved').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Actioned by officials</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 card-subtle-shadow flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Filter Severity:</span>
          {(['all', 'Critical', 'Warning', 'Info'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev === 'all' ? 'All Severities' : sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Escalated">Escalated</option>
            <option value="Reminder">Reminder</option>
            <option value="Manual Review">Manual Review</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No alerts match the selected criteria.
          </div>
        ) : (
          filteredAlerts.map((item) => {
            const isCritical = item.severity === 'Critical';
            const isWarning = item.severity === 'Warning';
            const Icon = isCritical ? AlertTriangle : isWarning ? Bell : Info;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white border card-subtle-shadow transition-all space-y-3 ${
                  !item.isRead ? 'border-l-4 border-l-blue-600' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-600'
                          : isWarning
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{item.type}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.severity === 'Critical'
                              ? 'bg-rose-100 text-rose-800'
                              : item.severity === 'Warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.severity}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {item.applicationId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{item.message}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-500 block">{item.relativeTime}</span>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.status === 'Escalated'
                          ? 'text-rose-600 bg-rose-50 border border-rose-200'
                          : item.status === 'Reminder'
                          ? 'text-amber-600 bg-amber-50 border border-amber-200'
                          : item.status === 'Resolved'
                          ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                          : 'text-purple-600 bg-purple-50 border border-purple-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-4">
                    <span>Target: <strong>{item.targetRole}</strong></span>
                    <span>Retries: <strong>{item.retryCount}</strong></span>
                    <span>Channel: <strong>{item.deliveryStatus}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenApplication && (
                      <button
                        onClick={() => onOpenApplication(item.applicationId)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Application</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDispatch(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{reminderDispatched === item.id ? 'Dispatched!' : 'Trigger Nudge'}</span>
                    </button>

                    {item.status !== 'Resolved' && (
                      <button
                        onClick={() => onResolveAlert(item.id)}
                        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
