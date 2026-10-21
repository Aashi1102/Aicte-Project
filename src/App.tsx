/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ApplicationsView } from './components/applications/ApplicationsView';
import { ApplicationDetailModal } from './components/applications/ApplicationDetailModal';
import { WorkflowView } from './components/workflow/WorkflowView';
import { ComplianceView } from './components/compliance/ComplianceView';
import { DocumentsView } from './components/documents/DocumentsView';
import { AlertsView } from './components/alerts/AlertsView';
import { EscalationsView } from './components/escalations/EscalationsView';
import { ReportsView } from './components/reports/ReportsView';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { RulesView } from './components/rules/RulesView';
import { SettingsView } from './components/settings/SettingsView';
import { DemoGuideModal } from './components/common/DemoGuideModal';
import { dataService } from './services/dataService';
import {
  ApplicationRecord,
  WorkflowRule,
  ComplianceItem,
  AlertItem,
  AuditEvent,
  UserRole,
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('AICTE Official');
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [showCreateModalFromDash, setShowCreateModalFromDash] = useState(false);

  // Load all initial state from dataService
  const refreshData = useCallback(() => {
    const apps = dataService.getApplications();
    const r = dataService.getRules();
    const c = dataService.getComplianceItems();
    const a = dataService.getAlerts();
    const aud = dataService.getAuditTrail();

    setApplications(apps);
    setRules(r);
    setComplianceItems(c);
    setAlerts(a);
    setAuditEvents(aud);

    // Keep selectedApplication synced if open
    setSelectedApplication((prev) => {
      if (!prev) return null;
      return apps.find((item) => item.id === prev.id) || prev;
    });
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle application update with auto state sync & audit
  const handleUpdateApplication = (
    id: string,
    updates: Partial<ApplicationRecord>,
    actionName: string
  ) => {
    dataService.updateApplication(id, updates, actionName, currentRole, currentRole);
    refreshData();
  };

  // Handle application create
  const handleCreateApplication = (data: Partial<ApplicationRecord>) => {
    const created = dataService.createApplication(data);
    refreshData();
    setSelectedApplication(created);
  };

  // Handle rule update
  const handleUpdateRule = (id: string, updates: Partial<WorkflowRule>) => {
    dataService.updateRule(id, updates);
    refreshData();
  };

  // Handle rule create
  const handleCreateRule = (rule: Omit<WorkflowRule, 'id' | 'updatedAt'>) => {
    dataService.createRule(rule);
    refreshData();
  };

  // Handle compliance update
  const handleUpdateCompliance = (id: string, updates: Partial<ComplianceItem>) => {
    dataService.updateComplianceItem(id, updates);
    refreshData();
  };

  // Handle alert read & resolve
  const handleMarkAlertRead = (id: string) => {
    dataService.markAlertRead(id);
    refreshData();
  };

  const handleResolveAlert = (id: string) => {
    dataService.resolveAlert(id);
    refreshData();
  };

  const handleTriggerManualReminder = (alert: AlertItem) => {
    dataService.createAlert({
      applicationId: alert.applicationId,
      type: `Manual Reminder: ${alert.type}`,
      severity: 'Warning',
      status: 'Reminder',
      targetRole: alert.targetRole,
      message: `Manual reminder triggered by ${currentRole}: Please submit outstanding evidence for ${alert.applicationId}`,
      deliveryStatus: 'Delivered (In-App)',
    });
    refreshData();
  };

  // Reset to seed data
  const handleResetData = () => {
    dataService.resetDemoData();
    refreshData();
  };

  // Open specific application by ID
  const handleOpenApplicationById = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    if (app) {
      setSelectedApplication(app);
    }
  };

  // Calculated statistics
  const stats = dataService.getCalculatedStats();

  return (
    <div className="flex h-screen bg-[#f3f6fc] text-slate-800 overflow-hidden font-sans">
      {/* Dark Navy Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        alertCount={alerts.filter((a) => !a.isRead).length}
        escalationCount={applications.filter((a) => a.status === 'Overdue').length}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
          applications={applications}
          alerts={alerts}
          onSelectApplication={setSelectedApplication}
          onNavigateTab={setCurrentTab}
          onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
          onResetData={handleResetData}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f3f6fc]">
          {currentTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              recentApplications={applications}
              alerts={alerts}
              onSelectApplication={setSelectedApplication}
              onNavigateTab={setCurrentTab}
              onOpenCreateModal={() => {
                setCurrentTab('applications');
              }}
            />
          )}

          {currentTab === 'applications' && (
            <ApplicationsView
              applications={applications}
              onSelectApplication={setSelectedApplication}
              onCreateApplication={handleCreateApplication}
              currentRole={currentRole}
            />
          )}

          {currentTab === 'workflow' && (
            <WorkflowView
              applications={applications}
              onSelectApplication={setSelectedApplication}
              onUpdateApplication={handleUpdateApplication}
              currentRole={currentRole}
            />
          )}

          {currentTab === 'compliance' && (
            <ComplianceView
              complianceItems={complianceItems}
              onUpdateCompliance={handleUpdateCompliance}
              currentRole={currentRole}
              onOpenApplication={handleOpenApplicationById}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentsView
              applications={applications}
              currentRole={currentRole}
              onOpenApplication={setSelectedApplication}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onMarkRead={handleMarkAlertRead}
              onResolveAlert={handleResolveAlert}
              onTriggerManualReminder={handleTriggerManualReminder}
              currentRole={currentRole}
              onOpenApplication={handleOpenApplicationById}
            />
          )}

          {currentTab === 'escalations' && (
            <EscalationsView
              applications={applications}
              alerts={alerts}
              onSelectApplication={setSelectedApplication}
              onResolveAlert={handleResolveAlert}
              currentRole={currentRole}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              applications={applications}
              alerts={alerts}
              complianceItems={complianceItems}
            />
          )}

          {currentTab === 'audit' && (
            <AuditTrailView
              auditEvents={auditEvents}
              currentRole={currentRole}
              onOpenApplication={handleOpenApplicationById}
            />
          )}

          {currentTab === 'rules' && (
            <RulesView
              rules={rules}
              onUpdateRule={handleUpdateRule}
              onCreateRule={handleCreateRule}
              currentRole={currentRole}
              onChangeRole={setCurrentRole}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              currentRole={currentRole}
              onChangeRole={setCurrentRole}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Application Deep Detail Drawer / Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateApplication={handleUpdateApplication}
          currentRole={currentRole}
          onNavigateTab={setCurrentTab}
        />
      )}

      {/* Judge Demonstration Walkthrough Helper Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setIsDemoGuideOpen(false);
        }}
        onOpenApplication={(appId) => {
          handleOpenApplicationById(appId);
          setIsDemoGuideOpen(false);
        }}
      />
    </div>
  );
}
