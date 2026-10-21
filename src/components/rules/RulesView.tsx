import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  Filter,
  FileText,
  Clock,
  Sparkles,
  Edit2,
  X,
  Play,
} from 'lucide-react';
import { WorkflowRule, UserRole, StageName, ApplicationType } from '../../types';

interface RulesViewProps {
  rules: WorkflowRule[];
  onUpdateRule: (id: string, updates: Partial<WorkflowRule>) => void;
  onCreateRule: (rule: Omit<WorkflowRule, 'id' | 'updatedAt'>) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export const RulesView: React.FC<RulesViewProps> = ({
  rules,
  onUpdateRule,
  onCreateRule,
  currentRole,
  onChangeRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [simType, setSimType] = useState<ApplicationType>('New Institute');
  const [simIntake, setSimIntake] = useState(360);
  const [simResult, setSimResult] = useState<WorkflowRule | null>(null);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newCategory, setNewCategory] = useState<ApplicationType | 'All Categories'>('New Institute');
  const [newTargetStage, setNewTargetStage] = useState<StageName>('Scrutiny (EVC / SAC-SHC)');
  const [newCondition, setNewCondition] = useState('');
  const [newSource, setNewSource] = useState('AICTE Approval Process Handbook (APH) 2026-27 Clause 2.1');
  const [newVersion, setNewVersion] = useState('v2.4');
  const [newRequiresEvc, setNewRequiresEvc] = useState(true);

  const isAdmin = currentRole === 'Administrator';

  const filteredRules = rules.filter(
    (r) =>
      searchQuery === '' ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ruleSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.responsibleAdmin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (rule: WorkflowRule) => {
    if (!isAdmin) return;
    onUpdateRule(rule.id, { isActive: !rule.isActive });
  };

  const handleSimulateRuleResolution = () => {
    const matched = rules.find((r) => r.isActive && (r.category === simType || r.category === 'All Categories'));
    setSimResult(matched || null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newRuleName.trim()) return;

    onCreateRule({
      name: newRuleName.trim(),
      category: newCategory,
      targetStage: newTargetStage,
      stageCondition: newCondition.trim() || 'Standard intake verification',
      ruleSource: newSource.trim(),
      version: newVersion.trim(),
      effectiveDate: '2026-04-01',
      isActive: true,
      responsibleAdmin: 'AICTE Regulations Cell',
      mandatoryDocs: ['Mandatory Field Verification Proof'],
      requiresEvc: newRequiresEvc,
      maxProcessingDays: 30,
      description: 'Configured statutory workflow routing rule.',
    });

    setShowCreateModal(false);
    setNewRuleName('');
    setNewCondition('');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Workflow Rule Engine & Provenance Registry</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Configurable statutory routing rules with clause-level handbook citations and version control
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/30 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Configured Rule</span>
          </button>
        ) : (
          <button
            onClick={() => onChangeRole('Administrator')}
            className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Switch to Administrator to Edit Rules</span>
          </button>
        )}
      </div>

      {/* Permissions & Regulatory Notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-blue-600" />
          Statutory Rule Transparency & RBAC Restriction
        </p>
        <p className="text-[11px] text-slate-500">
          Only authorized AICTE Administrators may modify routing rules. Every workflow stage transition displays its exact
          governing rule citation, version, and effective date. If no rule matches or conflict exists, cases route to the Exception Queue.
        </p>
      </div>

      {/* Rule Resolution Simulator Panel */}
      <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30 card-subtle-shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Rule Resolution Provenance Simulator</h3>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
            Interactive Test
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Application Type</label>
            <select
              value={simType}
              onChange={(e) => setSimType(e.target.value as ApplicationType)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none"
            >
              <option value="New Institute">New Institute</option>
              <option value="Increase in Intake">Increase in Intake</option>
              <option value="Extension">Extension</option>
              <option value="New Programme">New Programme</option>
              <option value="Closure">Closure</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Proposed Intake</label>
            <input
              type="number"
              value={simIntake}
              onChange={(e) => setSimIntake(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none"
            />
          </div>

          <button
            onClick={handleSimulateRuleResolution}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resolve Statutory Rule</span>
          </button>
        </div>

        {simResult && (
          <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200 text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Matched: {simResult.id} (Version {simResult.version})
              </span>
              <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Target Stage: {simResult.targetStage}
              </span>
            </div>
            <p className="font-bold text-slate-800">{simResult.name}</p>
            <p className="text-[11px] text-slate-600">
              <strong>Statutory Authority:</strong> {simResult.ruleSource}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Routing Condition: {simResult.stageCondition} • EVC Mandatory: {simResult.requiresEvc ? 'YES' : 'NO'}
            </p>
          </div>
        )}
      </div>

      {/* Rules Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 card-subtle-shadow overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rule ID, name, handbook clause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <span className="text-xs text-slate-500">
            {filteredRules.length} Configured Approval Process Handbook Rules
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRules.map((rule) => (
            <div key={rule.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-3">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                      {rule.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{rule.name}</h4>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {rule.version}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rule.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-xs text-blue-900 font-semibold mt-1">
                    {rule.ruleSource}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{rule.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isAdmin && (
                    <button
                      onClick={() => handleToggleStatus(rule)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        rule.isActive
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {rule.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>
              </div>

              {/* Conditions grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Target Stage</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{rule.targetStage}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Applicable Category</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{rule.category}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">SLA Processing Window</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{rule.maxProcessingDays} Calendar Days</p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Effective Date: {rule.effectiveDate} • Last Updated: {rule.updatedAt}</span>
                <span>Responsible: {rule.responsibleAdmin}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Configured Approval Rule</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Institute Fast-Track Scrutiny"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Applicable Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="New Institute">New Institute</option>
                    <option value="Increase in Intake">Increase in Intake</option>
                    <option value="Extension">Extension</option>
                    <option value="New Programme">New Programme</option>
                    <option value="Closure">Closure</option>
                    <option value="All Categories">All Categories</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Stage Gate</label>
                  <select
                    value={newTargetStage}
                    onChange={(e) => setNewTargetStage(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Intake & Validation">Intake & Validation</option>
                    <option value="Rule Resolution">Rule Resolution</option>
                    <option value="Scrutiny (EVC / SAC-SHC)">Scrutiny (EVC / SAC-SHC)</option>
                    <option value="Compliance Monitoring">Compliance Monitoring</option>
                    <option value="Final Decision">Final Decision</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Statutory Source Citation</label>
                <input
                  type="text"
                  required
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Routing Condition</label>
                <input
                  type="text"
                  placeholder="e.g. NAAC score > 3.25 and UGC autonomous status valid"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="evcCheck"
                  checked={newRequiresEvc}
                  onChange={(e) => setNewRequiresEvc(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="evcCheck" className="text-xs text-slate-700 font-semibold">
                  Requires Mandatory Physical / Hybrid EVC Inspection
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save & Publish Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
