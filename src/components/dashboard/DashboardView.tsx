import React from 'react';
import {
  FileText,
  Hourglass,
  CheckCircle2,
  FileSpreadsheet,
  AlertOctagon,
  ArrowUpRight,
  Calendar,
  Clock,
  Eye,
  MoreVertical,
  ChevronRight,
  PlusCircle,
  CheckSquare,
  BarChart3,
  Sliders,
  AlertTriangle,
  Bell,
  Info,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ApplicationRecord, AlertItem } from '../../types';
import { NavTab } from '../layout/Sidebar';

interface DashboardViewProps {
  stats: {
    total: number;
    inProcess: number;
    inProcessPercent: number;
    approved: number;
    approvedPercent: number;
    returned: number;
    returnedPercent: number;
    overdue: number;
    overduePercent: number;
    stageData: Array<{ name: string; stage: string; count: number; fill: string }>;
    statusData: Array<{ name: string; count: number; percent: number; fill: string }>;
  };
  recentApplications: ApplicationRecord[];
  alerts: AlertItem[];
  onSelectApplication: (app: ApplicationRecord) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenCreateModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentApplications,
  alerts,
  onSelectApplication,
  onNavigateTab,
  onOpenCreateModal,
}) => {
  // Take top 5 applications for table view
  const displayApps = recentApplications.slice(0, 5);
  // Take top 5 alerts for alert panel
  const displayAlerts = alerts.slice(0, 5);

  // Upcoming deadlines from active applications
  const upcomingDeadlines = [
    { id: 'SAK-2026-1142', inst: 'ABC Institute of Technology', days: '2 days left', date: '24 Oct 2026', color: 'text-rose-600' },
    { id: 'SAK-2026-1178', inst: 'LN Engineering College', days: '5 days left', date: '27 Oct 2026', color: 'text-amber-600' },
    { id: 'SAK-2026-0987', inst: 'RK Institute of Pharmacy', days: '7 days left', date: '29 Oct 2026', color: 'text-amber-600' },
    { id: 'SAK-2026-1034', inst: 'Sunrise College of Management', days: '10 days left', date: '01 Nov 2026', color: 'text-slate-500' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Welcome to SAKSHAM</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            AI-powered approval workflow, compliance monitoring and alert management system for AICTE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            AICTE Academic Cycle 2026-27 Active
          </span>
        </div>
      </div>

      {/* 5 KPI Cards matching reference design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Applications */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="bg-white rounded-2xl p-4 border border-blue-100/80 card-subtle-shadow card-hover-shadow cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applications</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</h3>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600">
                <span>↑ 12%</span>
                <span className="text-slate-400 font-normal">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* In Process */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="bg-white rounded-2xl p-4 border border-emerald-100/80 card-subtle-shadow card-hover-shadow cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Process</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.inProcess}</h3>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.inProcessPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                <Hourglass className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2">{stats.inProcessPercent}%</span>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="bg-white rounded-2xl p-4 border border-purple-100/80 card-subtle-shadow card-hover-shadow cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.approved}</h3>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.approvedPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2">{stats.approvedPercent}%</span>
            </div>
          </div>
        </div>

        {/* Returned / Deficiency */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="bg-white rounded-2xl p-4 border border-amber-100/80 card-subtle-shadow card-hover-shadow cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Returned / Deficiency</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.returned}</h3>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.returnedPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2">{stats.returnedPercent}%</span>
            </div>
          </div>
        </div>

        {/* Overdue / Escalated */}
        <div
          onClick={() => onNavigateTab('escalations')}
          className="bg-white rounded-2xl p-4 border border-rose-100/80 card-subtle-shadow card-hover-shadow cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue / Escalated</p>
              <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{stats.overdue}</h3>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.overduePercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-12 h-12 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2">{stats.overduePercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Applications by Stage Bar Chart, Application Status Doughnut, Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Applications by Stage (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 card-subtle-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Applications by Stage</h3>
              <p className="text-[11px] text-slate-400">Distribution across statutory routing stages</p>
            </div>
            <button
              onClick={() => onNavigateTab('workflow')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Workflow</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.stageData} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-lg">
                          <p className="font-bold">{data.stage}</p>
                          <p className="text-blue-300 font-mono mt-0.5">{data.count} Applications</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status Doughnut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 card-subtle-shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Application Status</h3>
              <p className="text-[11px] text-slate-400">Current status breakdown across pool</p>
            </div>
          </div>

          <div className="flex items-center justify-between h-56">
            <div className="relative w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {stats.statusData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-lg">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-blue-300 font-mono">
                              {data.count} ({data.percent}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Central Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-800 leading-none">{stats.total}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 flex-1 pl-4">
              {stats.statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-mono text-slate-500 font-bold">
                    {item.count} <span className="text-[10px] text-slate-400 font-normal">({item.percent}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 card-subtle-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h3>
              <button
                onClick={() => onNavigateTab('alerts')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  onClick={() => {
                    const target = recentApplications.find((a) => a.id === dl.id);
                    if (target) onSelectApplication(target);
                  }}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/40 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-800">{dl.id}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[120px]">{dl.inst}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] font-bold ${dl.color}`}>{dl.days}</span>
                    <p className="text-[10px] text-slate-400">{dl.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>SLA Clock Active</span>
            <span className="text-blue-600 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Auto-Monitored
            </span>
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Applications Table (8 cols) & Recent Alerts & Escalations (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Applications Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 card-subtle-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Applications</h3>
              <p className="text-[11px] text-slate-400">Priority cases requiring scrutiny and action</p>
            </div>
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-2.5 px-3">Application ID</th>
                  <th className="py-2.5 px-3">Institution Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Current Stage</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {displayApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-3">
                      <span
                        onClick={() => onSelectApplication(app)}
                        className="font-mono font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        {app.id}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 max-w-[180px] truncate">
                      {app.institutionName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{app.type}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {app.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'Deficiency'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : app.status === 'Exception'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : app.status === 'Due Soon'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : app.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {app.dueDate || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectApplication(app)}
                          title="Open details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onNavigateTab('documents');
                          }}
                          title="View documents"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectApplication(app)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts & Escalations Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 card-subtle-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Alerts & Escalations</h3>
                <p className="text-[11px] text-slate-400">Automated triggers and compliance warnings</p>
              </div>
              <button
                onClick={() => onNavigateTab('alerts')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {displayAlerts.map((al) => {
                const isCritical = al.severity === 'Critical';
                const isWarning = al.severity === 'Warning';
                const IconComponent = isCritical ? AlertTriangle : isWarning ? Bell : Info;

                return (
                  <div
                    key={al.id}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isCritical
                            ? 'bg-rose-100 text-rose-600'
                            : isWarning
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-tight">{al.type}</p>
                        <span className="font-mono text-[10px] text-blue-600 font-semibold">
                          {al.applicationId}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block">{al.relativeTime}</span>
                      <span
                        className={`inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          al.status === 'Escalated'
                            ? 'text-rose-600 bg-rose-50 border border-rose-200'
                            : al.status === 'Reminder'
                            ? 'text-amber-600 bg-amber-50 border border-amber-200'
                            : al.status === 'Manual Review'
                            ? 'text-purple-600 bg-purple-50 border border-purple-200'
                            : 'text-blue-600 bg-blue-50 border border-blue-200'
                        }`}
                      >
                        {al.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Escalation rules active</span>
            <button
              onClick={() => onNavigateTab('escalations')}
              className="font-bold text-blue-600 hover:underline"
            >
              Monitor SLA Matrix →
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Actions matching reference screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Action 1: Process New Application */}
        <div
          onClick={onOpenCreateModal}
          className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-blue-50/40 border border-blue-200/80 hover:border-blue-400 card-subtle-shadow card-hover-shadow cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Process New Application
              </h4>
              <p className="text-[11px] text-slate-500">Register and validate application</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Action 2: Review Pending Cases */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 to-purple-50/40 border border-purple-200/80 hover:border-purple-400 card-subtle-shadow card-hover-shadow cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Review Pending Cases
              </h4>
              <p className="text-[11px] text-slate-500">Check applications assigned to you</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Action 3: Generate Reports */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-emerald-50/40 border border-emerald-200/80 hover:border-emerald-400 card-subtle-shadow card-hover-shadow cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Generate Reports
              </h4>
              <p className="text-[11px] text-slate-500">Compliance, audit and stage reports</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Action 4: Manage Rules */}
        <div
          onClick={() => onNavigateTab('rules')}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 to-amber-50/40 border border-amber-200/80 hover:border-amber-400 card-subtle-shadow card-hover-shadow cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Manage Rules
              </h4>
              <p className="text-[11px] text-slate-500">Configure workflow and stage rules</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
