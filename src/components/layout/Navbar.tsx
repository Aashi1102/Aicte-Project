import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Shield,
  UserCheck,
  Building2,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserRole, ApplicationRecord, AlertItem } from '../../types';
import { NavTab } from './Sidebar';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  applications: ApplicationRecord[];
  alerts: AlertItem[];
  onSelectApplication: (app: ApplicationRecord) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenDemoGuide: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  applications,
  alerts,
  onSelectApplication,
  onNavigateTab,
  onOpenDemoGuide,
  onResetData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setShowAlertsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered applications for search
  const filteredApps = searchQuery.trim()
    ? applications.filter(
        (a) =>
          a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.currentStage.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.status.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  // Profile details based on active role
  const profileDetails = {
    'AICTE Official': {
      initials: 'AS',
      name: 'Aashi Singh',
      designation: 'Joint Director, Bureau of Approval',
      avatarBg: 'bg-blue-600',
    },
    'Institution User': {
      initials: 'VK',
      name: 'Prof. V. K. Raman',
      designation: 'Principal, ABC Institute',
      avatarBg: 'bg-emerald-600',
    },
    'Administrator': {
      initials: 'SA',
      name: 'System Admin',
      designation: 'Regulations & IT Governance',
      avatarBg: 'bg-purple-600',
    },
  }[currentRole];

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 shadow-xs z-30 sticky top-0">
      {/* Global Search Bar */}
      <div className="relative w-96" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by application ID, institution name, stage, etc..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full pl-10 pr-8 py-2 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
            <div className="p-2 border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 flex justify-between items-center">
              <span>Matching Applications ({filteredApps.length})</span>
              <span className="text-[10px] text-slate-400">Click to open</span>
            </div>
            {filteredApps.length === 0 ? (
              <div className="p-4 text-xs text-slate-500 text-center">
                No applications matching "{searchQuery}"
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onSelectApplication(app);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-blue-50/60 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 group-hover:underline">
                          {app.id}
                        </span>
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[180px]">
                          {app.institutionName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {app.type} • {app.currentStage}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        app.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'Deficiency'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : app.status === 'Overdue'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {app.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Judge Demo Walkthrough Button */}
        <button
          onClick={onOpenDemoGuide}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 text-xs font-bold transition-all shadow-2xs"
          title="Open interactive Judge Demonstration helper"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Judge Demo Script (11 Steps)</span>
        </button>

        {/* Role Selector */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                Switch Perspective (Simulated RBAC)
              </div>
              <button
                onClick={() => {
                  onChangeRole('AICTE Official');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                  currentRole === 'AICTE Official'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-semibold">AICTE Official</p>
                  <p className="text-[10px] text-slate-400">Scrutiny, verification, approval routing</p>
                </div>
              </button>
              <button
                onClick={() => {
                  onChangeRole('Institution User');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                  currentRole === 'Institution User'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-semibold">Institution User</p>
                  <p className="text-[10px] text-slate-400">Submit, upload docs, fix deficiencies</p>
                </div>
              </button>
              <button
                onClick={() => {
                  onChangeRole('Administrator');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                  currentRole === 'Administrator'
                    ? 'bg-purple-50 text-purple-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="font-semibold">Administrator</p>
                  <p className="text-[10px] text-slate-400">Manage rules, SLA thresholds, audit logs</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative" ref={alertsRef}>
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-84 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Alerts & Notifications</h4>
                  <p className="text-[10px] text-slate-400">{unreadAlerts.length} unacknowledged events</p>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab('alerts');
                    setShowAlertsDropdown(false);
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {alerts.slice(0, 4).map((al) => (
                  <div key={al.id} className="p-3 hover:bg-slate-50/80 transition-colors text-left">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          al.severity === 'Critical'
                            ? 'bg-rose-500'
                            : al.severity === 'Warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{al.type}</span>
                          <span className="text-[10px] text-slate-400">{al.relativeTime}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{al.message}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {al.applicationId}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {al.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div
            className={`w-8 h-8 rounded-full ${profileDetails.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}
          >
            {profileDetails.initials}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{profileDetails.name}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{profileDetails.designation}</p>
          </div>
        </div>

        {/* Date/Time Widget matching reference screenshot */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <div className="text-[11px] font-medium leading-tight text-right">
            <div>Tuesday, 21 Oct 2026</div>
            <div className="text-[10px] text-slate-400 font-mono">10:30 AM IST</div>
          </div>
        </div>
      </div>
    </header>
  );
};
