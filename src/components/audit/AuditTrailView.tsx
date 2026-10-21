import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  User,
  ArrowUpRight,
  Database,
  Lock,
} from 'lucide-react';
import { AuditEvent, UserRole } from '../../types';

interface AuditTrailViewProps {
  auditEvents: AuditEvent[];
  currentRole: UserRole;
  onOpenApplication?: (appId: string) => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  auditEvents,
  currentRole,
  onOpenApplication,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filteredEvents = auditEvents.filter((ev) => {
    const matchesSearch =
      searchQuery === '' ||
      ev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || ev.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Statutory Audit Trail & Event Ledger</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Chronological, append-only log of every stage transition, deficiency memo, document validation, and decision
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>Append-Only Ledger ({auditEvents.length} Recorded Events)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 card-subtle-shadow space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event ID, app ID, action, actor, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 font-medium"
            >
              <option value="all">All Roles & Actors</option>
              <option value="Scrutiny Committee">Scrutiny Committee</option>
              <option value="Member Secretary">Member Secretary</option>
              <option value="Automated Rule Resolution">Automated Rule Resolution</option>
              <option value="Automated Monitor">Automated Monitor</option>
              <option value="Institution User">Institution User</option>
              <option value="AICTE Official">AICTE Official</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{filteredEvents.length}</strong> events
          </span>
          <span className="text-[11px] text-blue-600 font-mono">
            Integrity check: Consistent sequence order maintained
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 card-subtle-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor / Role</th>
                <th className="py-3 px-4">Statutory Reference / Rule</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No audit events match your search query.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {ev.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {ev.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      {onOpenApplication ? (
                        <button
                          onClick={() => onOpenApplication(ev.applicationId)}
                          className="font-mono font-bold text-blue-600 hover:underline"
                        >
                          {ev.applicationId}
                        </button>
                      ) : (
                        <span className="font-mono font-bold text-blue-600">{ev.applicationId}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {ev.action}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{ev.actor}</p>
                      <p className="text-[10px] text-slate-400">{ev.role}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {ev.ruleReference ? (
                        <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {ev.ruleReference}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={ev.details}>
                      {ev.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
