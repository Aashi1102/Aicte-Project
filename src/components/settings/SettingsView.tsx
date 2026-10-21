import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Clock,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Sliders,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SettingsViewProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentRole,
  onChangeRole,
  onResetData,
}) => {
  const [firstReminderDays, setFirstReminderDays] = useState(7);
  const [criticalThresholdDays, setCriticalThresholdDays] = useState(3);
  const [evcSlaHours, setEvcSlaHours] = useState(48);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    onResetData();
    setResetConfirm(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>System & SLA Configuration</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          Configure notification thresholds, statutory SLA clocks, simulated RBAC perspectives, and data states
        </p>
      </div>

      {/* Role Configuration Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 card-subtle-shadow space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Simulated Role-Based Access Control (RBAC)</h3>
          <p className="text-[11px] text-slate-400">
            Switch your persona to inspect views and permissions for different stakeholders in the approval lifecycle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              role: 'AICTE Official' as UserRole,
              title: 'AICTE Official',
              desc: 'Scrutiny Committee & Joint Director. Inspect dossiers, issue deficiency memos, verify evidence.',
              badge: 'Default Perspective',
            },
            {
              role: 'Institution User' as UserRole,
              title: 'Institution User',
              desc: 'Applicant / Principal. Register applications, view status, respond to deficiencies, upload evidence.',
              badge: 'Applicant Persona',
            },
            {
              role: 'Administrator' as UserRole,
              title: 'Administrator',
              desc: 'Bureau Head & IT Cell. Configure APH rules, edit SLA timers, manage system parameters.',
              badge: 'Governance Level',
            },
          ].map((item) => (
            <button
              key={item.role}
              onClick={() => onChangeRole(item.role)}
              className={`p-4 rounded-xl border text-left transition-all ${
                currentRole === item.role
                  ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{item.title}</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Notification and SLA Timers Form */}
      <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200/80 card-subtle-shadow space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Notification & SLA Threshold Configuration</h3>
          <p className="text-[11px] text-slate-400">
            Determine when automated in-app alerts and multi-tier escalations are fired
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Initial Nudge / Reminder Window
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={firstReminderDays}
                onChange={(e) => setFirstReminderDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
              />
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Days Prior</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Critical Overdue Escalation Window
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={criticalThresholdDays}
                onChange={(e) => setCriticalThresholdDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
              />
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Days Overdue</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              EVC Report Submission SLA
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="24"
                max="120"
                step="24"
                value={evcSlaHours}
                onChange={(e) => setEvcSlaHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
              />
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Hours</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Threshold parameters saved
              </span>
            ) : (
              'Changes take effect immediately across all automated monitors'
            )}
          </span>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/30"
          >
            Save SLA Parameters
          </button>
        </div>
      </form>

      {/* Demonstration Data Management */}
      <div className="bg-white p-5 rounded-2xl border border-rose-200 card-subtle-shadow space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-rose-900">Prototype Demo Data State</h3>
            <p className="text-[11px] text-slate-500">
              Reset all application records, compliance clocks, and deficiency memos back to the pristine SIH 2026 seed state
            </p>
          </div>

          {resetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                Confirm Full Reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Seed State</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
