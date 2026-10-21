import React from 'react';
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  ShieldCheck,
  FolderOpen,
  Bell,
  AlertTriangle,
  BarChart3,
  History,
  Sliders,
  Settings,
  Landmark,
  BadgeAlert,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'applications'
  | 'workflow'
  | 'compliance'
  | 'documents'
  | 'alerts'
  | 'escalations'
  | 'reports'
  | 'audit'
  | 'rules'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  alertCount?: number;
  escalationCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  alertCount = 3,
  escalationCount = 2,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'workflow', label: 'Workflow & Stages', icon: GitBranch },
    { id: 'compliance', label: 'Compliance & EVC', icon: ShieldCheck },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'alerts', label: 'Deadlines & Alerts', icon: Bell, badge: alertCount, badgeColor: 'bg-amber-500' },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, badge: escalationCount, badgeColor: 'bg-rose-500' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'rules', label: 'Manage Rules', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a1526] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-[#15253e] z-20">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-[#13233c]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">SAKSHAM</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                SIH 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">
              AICTE Approval Workflow & Compliance Intelligence
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 group text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-[#14233c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full text-white ${
                      item.badgeColor || 'bg-blue-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Disclaimer */}
      <div className="p-4 border-t border-[#13233c] bg-[#08111f]/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-blue-400/40 bg-blue-950/80 flex items-center justify-center text-blue-300 shrink-0">
            <span className="text-xs font-black tracking-tighter">AICTE</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200 leading-tight">All India Council for</p>
            <p className="text-[11px] text-slate-400 leading-tight">Technical Education</p>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-[#13233c] flex items-center justify-between text-[10px] text-slate-400">
          <span>Proposed Prototype</span>
          <span className="text-blue-400 font-mono">v1.4.0</span>
        </div>
      </div>
    </aside>
  );
};
