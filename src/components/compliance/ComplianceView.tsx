import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Eye,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Building,
  FileCheck2,
  X,
} from 'lucide-react';
import { ComplianceItem, UserRole } from '../../types';

interface ComplianceViewProps {
  complianceItems: ComplianceItem[];
  onUpdateCompliance: (id: string, updates: Partial<ComplianceItem>) => void;
  currentRole: UserRole;
  onOpenApplication?: (appId: string) => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  complianceItems,
  onUpdateCompliance,
  currentRole,
  onOpenApplication,
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'evc' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForEvc, setSelectedItemForEvc] = useState<ComplianceItem | null>(null);

  // EVC Scheduling Form State
  const [evcDate, setEvcDate] = useState('2026-10-28');
  const [evcLead, setEvcLead] = useState('Prof. A. K. Sen (IIT Roorkee)');
  const [evcVenue, setEvcVenue] = useState('Institutional Campus Main Building');

  const filteredItems = complianceItems.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTab === 'evc') return matchesSearch && (item.evcSchedule || item.title.includes('EVC'));
    if (selectedTab === 'overdue') return matchesSearch && item.daysRemaining < 0;
    return matchesSearch;
  });

  const handleToggleClock = (item: ComplianceItem) => {
    const newStatus = item.clockStatus === 'Running' ? 'Paused' : 'Running';
    onUpdateCompliance(item.id, {
      clockStatus: newStatus,
      actionHistory: [
        ...item.actionHistory,
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: `Clock status changed to ${newStatus} by ${currentRole}`,
          actor: currentRole,
        },
      ],
    });
  };

  const handleScheduleEvc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForEvc) return;

    onUpdateCompliance(selectedItemForEvc.id, {
      evcSchedule: {
        inspectionDate: evcDate,
        teamLead: evcLead,
        venue: evcVenue,
        status: 'Scheduled',
      },
      stage: 'Under Review',
      actionHistory: [
        ...selectedItemForEvc.actionHistory,
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: `EVC Inspection scheduled for ${evcDate} by ${evcLead}`,
          actor: currentRole,
        },
      ],
    });

    setSelectedItemForEvc(null);
  };

  const handleAcceptItem = (item: ComplianceItem) => {
    onUpdateCompliance(item.id, {
      stage: 'Accepted',
      clockStatus: 'Paused',
      actionHistory: [
        ...item.actionHistory,
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: `Compliance undertaking verified and accepted by ${currentRole}`,
          actor: currentRole,
        },
      ],
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Compliance Monitoring & EVC Inspections</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Dual-clock monitoring of statutory undertakings, physical expert committees, and institutional SLA compliance
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Obligations ({complianceItems.length})
          </button>
          <button
            onClick={() => setSelectedTab('evc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'evc' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EVC / SAC Inspections
          </button>
          <button
            onClick={() => setSelectedTab('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'overdue' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            Overdue Cases
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 card-subtle-shadow">
          <p className="text-xs font-bold text-slate-500 uppercase">Tracked Obligations</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{complianceItems.length}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Active undertakings across cycle</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-blue-100 card-subtle-shadow">
          <p className="text-xs font-bold text-blue-600 uppercase">Under Review</p>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
            {complianceItems.filter((c) => c.stage === 'Under Review').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Official review clock ticking</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-amber-100 card-subtle-shadow">
          <p className="text-xs font-bold text-amber-600 uppercase">Returned for Deficiency</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
            {complianceItems.filter((c) => c.stage === 'Returned').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Institution clock active</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-rose-100 card-subtle-shadow">
          <p className="text-xs font-bold text-rose-600 uppercase">Lapsed / Overdue</p>
          <h3 className="text-2xl font-extrabold text-rose-600 mt-1">
            {complianceItems.filter((c) => c.daysRemaining < 0).length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Escalated to Tier-2</p>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 card-subtle-shadow overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search compliance item, app ID, institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredItems.length} compliance obligations
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => {
            const isOverdue = item.daysRemaining < 0;
            return (
              <div key={item.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {item.applicationId}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.stage === 'Accepted' || item.stage === 'Closed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.stage === 'Returned'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.stage === 'Under Review'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.stage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.institutionName} • Responsible: <strong>{item.responsibleParty}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-mono text-slate-600">{item.requiredByDate}</p>
                      <span
                        className={`text-[11px] font-bold ${
                          isOverdue ? 'text-rose-600' : 'text-slate-500'
                        }`}
                      >
                        {isOverdue ? `${Math.abs(item.daysRemaining)} days overdue` : `${item.daysRemaining} days remaining`}
                      </span>
                    </div>

                    {item.stage !== 'Accepted' && item.stage !== 'Closed' && (
                      <button
                        onClick={() => handleAcceptItem(item)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                      >
                        Verify & Accept
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedItemForEvc(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                    >
                      Schedule EVC
                    </button>
                  </div>
                </div>

                {/* Dual Clock Info and EVC Schedule Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {item.clockType}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Status: <strong className={item.clockStatus === 'Running' ? 'text-emerald-700' : 'text-amber-700'}>{item.clockStatus}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleClock(item)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded border border-slate-300 hover:bg-white flex items-center gap-1 transition-colors"
                    >
                      {item.clockStatus === 'Running' ? (
                        <>
                          <Pause className="w-3 h-3 text-amber-600" />
                          <span>Pause Clock</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-emerald-600" />
                          <span>Resume Clock</span>
                        </>
                      )}
                    </button>
                  </div>

                  {item.evcSchedule ? (
                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-purple-900 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-purple-600" />
                          EVC Inspection: {item.evcSchedule.inspectionDate}
                        </span>
                        <p className="text-[11px] text-slate-600 mt-0.5 truncate max-w-[260px]">
                          Lead: {item.evcSchedule.teamLead}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {item.evcSchedule.status}
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs flex items-center justify-center">
                      No physical EVC inspection scheduled
                    </div>
                  )}
                </div>

                {/* History trail */}
                <div className="pt-1 flex items-center gap-2 overflow-x-auto text-[10px] text-slate-400">
                  <span className="font-bold text-slate-500 shrink-0">Audit Events:</span>
                  {item.actionHistory.map((act, i) => (
                    <span key={i} className="bg-slate-100 px-2 py-0.5 rounded shrink-0">
                      {act.action} ({act.timestamp})
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule EVC Inspection Modal */}
      {selectedItemForEvc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-purple-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Schedule Expert Visiting Committee (EVC)</h3>
              <button
                onClick={() => setSelectedItemForEvc(null)}
                className="w-7 h-7 rounded-lg bg-purple-800 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleEvc} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Institution & App ID</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedItemForEvc.applicationId} - ${selectedItemForEvc.institutionName}`}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Proposed Inspection Date</label>
                <input
                  type="date"
                  required
                  value={evcDate}
                  onChange={(e) => setEvcDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">EVC Lead Expert Inspector</label>
                <input
                  type="text"
                  required
                  value={evcLead}
                  onChange={(e) => setEvcLead(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Physical Campus Venue</label>
                <input
                  type="text"
                  required
                  value={evcVenue}
                  onChange={(e) => setEvcVenue(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForEvc(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Issue EVC Itinerary & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
