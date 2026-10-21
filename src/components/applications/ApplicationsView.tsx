import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Download,
  FileText,
  Calendar,
  AlertCircle,
  Building,
  CheckCircle2,
  X,
  FilePlus2,
} from 'lucide-react';
import { ApplicationRecord, StageName, ApplicationStatus, ApplicationType, UserRole } from '../../types';

interface ApplicationsViewProps {
  applications: ApplicationRecord[];
  onSelectApplication: (app: ApplicationRecord) => void;
  onCreateApplication: (data: Partial<ApplicationRecord>) => void;
  currentRole: UserRole;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onSelectApplication,
  onCreateApplication,
  currentRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Application Form State
  const [newInstName, setNewInstName] = useState('');
  const [newType, setNewType] = useState<ApplicationType>('New Institute');
  const [newCategory, setNewCategory] = useState('Engineering & Tech');
  const [newRegion, setNewRegion] = useState('Northern (New Delhi)');
  const [newIntake, setNewIntake] = useState(300);

  const pageSize = 10;

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        searchQuery === '' ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.assignedOfficial.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = selectedStage === 'all' || app.currentStage === selectedStage;
      const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
      const matchesType = selectedType === 'all' || app.type === selectedType;

      return matchesSearch && matchesStage && matchesStatus && matchesType;
    });
  }, [applications, searchQuery, selectedStage, selectedStatus, selectedType]);

  const totalPages = Math.ceil(filteredApps.length / pageSize) || 1;
  const paginatedApps = filteredApps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim()) return;

    onCreateApplication({
      institutionName: newInstName.trim(),
      type: newType,
      category: newCategory,
      region: newRegion,
      intakeProposed: Number(newIntake),
      documents: [
        {
          id: `DOC-NEW-01`,
          name: 'Land Ownership Title Deed & Master Plan',
          category: 'Land & Building',
          uploadDate: new Date().toISOString().split('T')[0],
          version: 'v1.0',
          fileSize: '6.4 MB',
          validationStatus: 'Pending',
        },
        {
          id: `DOC-NEW-02`,
          name: 'Building Safety & Occupancy Certificate',
          category: 'Land & Building',
          uploadDate: new Date().toISOString().split('T')[0],
          version: 'v1.0',
          fileSize: '3.8 MB',
          validationStatus: 'Pending',
        },
        {
          id: `DOC-NEW-03`,
          name: 'Fire Safety Certificate & NOC',
          category: 'Statutory Approvals',
          uploadDate: new Date().toISOString().split('T')[0],
          version: 'v1.0',
          fileSize: '2.1 MB',
          validationStatus: 'Pending',
        },
      ],
    });

    setShowCreateModal(false);
    setNewInstName('');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Applications Registry</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Monitor, scrutinize, and route approval applications for technical education institutions
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Application</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 card-subtle-shadow space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, institution, official..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={selectedStage}
              onChange={(e) => {
                setSelectedStage(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium"
            >
              <option value="all">All Stages ({applications.length})</option>
              <option value="Intake & Validation">Intake & Validation</option>
              <option value="Rule Resolution">Rule Resolution</option>
              <option value="Scrutiny (EVC / SAC-SHC)">Scrutiny (EVC / SAC-SHC)</option>
              <option value="Compliance Monitoring">Compliance Monitoring</option>
              <option value="Final Decision">Final Decision</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="In Review">In Review</option>
              <option value="Deficiency">Deficiency</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Exception">Exception</option>
              <option value="Approved">Approved</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium"
            >
              <option value="all">All Application Types</option>
              <option value="New Institute">New Institute</option>
              <option value="Increase in Intake">Increase in Intake</option>
              <option value="Extension">Extension</option>
              <option value="New Programme">New Programme</option>
              <option value="Closure">Closure</option>
              <option value="Change of Site">Change of Site</option>
            </select>
          </div>
        </div>

        {/* Quick result count & active filter reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{filteredApps.length}</strong> matching applications
          </span>
          {(searchQuery || selectedStage !== 'all' || selectedStatus !== 'all' || selectedType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStage('all');
                setSelectedStatus('all');
                setSelectedType('all');
                setCurrentPage(1);
              }}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 card-subtle-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Type & Category</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4">
                      <span
                        onClick={() => onSelectApplication(app)}
                        className="font-mono font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        {app.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{app.institutionName}</p>
                      <p className="text-[10px] text-slate-400">{app.region}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{app.type}</span>
                      <p className="text-[10px] text-slate-400">{app.category}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {app.currentStage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{app.assignedOfficial}</p>
                      <p className="text-[10px] text-slate-400">{app.assignedRole}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div>{app.dueDate}</div>
                      <span
                        className={`text-[10px] font-sans font-semibold ${
                          app.daysRemaining < 0
                            ? 'text-rose-600'
                            : app.daysRemaining <= 5
                            ? 'text-amber-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {app.daysRemaining < 0
                          ? `${Math.abs(app.daysRemaining)}d overdue`
                          : `${app.daysRemaining}d left`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 rounded text-xs font-semibold ${
                  currentPage === num
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Register New Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FilePlus2 className="w-5 h-5 text-blue-300" />
                <h3 className="text-base font-bold">Register Technical Institution Application</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-lg bg-blue-800 hover:bg-blue-700 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Institution Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharishi Dayanand Institute of Engineering"
                  value={newInstName}
                  onChange={(e) => setNewInstName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Application Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ApplicationType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="New Institute">New Institute</option>
                    <option value="Increase in Intake">Increase in Intake</option>
                    <option value="Extension">Extension</option>
                    <option value="New Programme">New Programme</option>
                    <option value="Closure">Closure</option>
                    <option value="Change of Site">Change of Site</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Discipline / Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="Management">Management</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Polytechnic">Polytechnic</option>
                    <option value="Architecture">Architecture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">AICTE Regional Jurisdiction</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Northern (New Delhi)">Northern (New Delhi)</option>
                    <option value="Western (Mumbai)">Western (Mumbai)</option>
                    <option value="Southern (Chennai)">Southern (Chennai)</option>
                    <option value="South-Western (Bengaluru)">South-Western (Bengaluru)</option>
                    <option value="Central (Bhopal)">Central (Bhopal)</option>
                    <option value="Eastern (Kolkata)">Eastern (Kolkata)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Proposed Intake (Seats)</label>
                  <input
                    type="number"
                    min="30"
                    max="1200"
                    step="30"
                    value={newIntake}
                    onChange={(e) => setNewIntake(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Mandatory Validation Gate
                </p>
                <p className="text-[11px] text-slate-600">
                  New applications will automatically be seeded with standard statutory documents and routed to
                  Stage 1: Intake & Validation.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-blue-600/30"
                >
                  Submit & Begin Validation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
