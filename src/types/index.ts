export type UserRole = 'AICTE Official' | 'Institution User' | 'Administrator';

export type StageName = 
  | 'Intake & Validation'
  | 'Rule Resolution'
  | 'Scrutiny (EVC / SAC-SHC)'
  | 'Compliance Monitoring'
  | 'Final Decision';

export type ApplicationStatus = 
  | 'In Review'
  | 'Deficiency'
  | 'Due Soon'
  | 'Exception'
  | 'Approved'
  | 'Overdue'
  | 'Draft'
  | 'Rejected';

export type ApplicationType = 
  | 'New Institute'
  | 'Increase in Intake'
  | 'Extension'
  | 'New Programme'
  | 'Closure'
  | 'Change of Site';

export interface DocumentItem {
  id: string;
  name: string;
  category: 'Land & Building' | 'Faculty & Staff' | 'Financial' | 'Statutory Approvals' | 'Academic' | 'Affidavit';
  uploadDate: string;
  version: string;
  fileSize: string;
  validationStatus: 'Valid' | 'Pending' | 'Deficient' | 'Rejected';
  reviewerComments?: string;
  extractedData?: {
    confidence: number;
    fields: Record<string, string>;
    verifiedByHuman: boolean;
  };
}

export interface RuleProvenance {
  ruleId: string;
  ruleName: string;
  clauseReference: string;
  version: string;
  effectiveDate: string;
  criteriaMatched: string;
  resolvedAt: string;
  status: 'Resolved' | 'Conflicting' | 'Missing';
}

export interface DeficiencyNote {
  id: string;
  date: string;
  returnedBy: string;
  role: string;
  reason: string;
  missingItems: string[];
  resubmittedAt?: string;
  resubmissionNotes?: string;
  status: 'Open' | 'Resolved';
}

export interface ApplicationRecord {
  id: string; // e.g. SAK-2026-1142
  institutionName: string;
  type: ApplicationType;
  currentStage: StageName;
  status: ApplicationStatus;
  assignedRole: string;
  assignedOfficial: string;
  submissionDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  daysRemaining: number;
  category: string; // e.g. Engineering & Tech, Management
  region: string;
  intakeProposed: number;
  ruleProvenance: RuleProvenance | null;
  documents: DocumentItem[];
  deficiencyHistory: DeficiencyNote[];
  observations: string[];
  finalDecision?: {
    verdict: 'Approved' | 'Rejected' | 'Approved with Conditions';
    date: string;
    decidedBy: string;
    remarks: string;
    loaNumber?: string;
  };
  clockState: {
    institutionClockDays: number;
    officialReviewClockDays: number;
    isPaused: boolean;
    pauseReason?: string;
  };
  evcDetails?: {
    required: boolean;
    scheduledDate?: string;
    panelMembers?: string[];
    reportStatus?: 'Pending' | 'Submitted' | 'Verified' | 'Not Required';
    reportSummary?: string;
  };
}

export interface WorkflowRule {
  id: string;
  name: string;
  category: ApplicationType | 'All Categories';
  targetStage: StageName;
  stageCondition: string;
  ruleSource: string; // e.g. APH 2026-27 Clause 2.4.1
  version: string;
  effectiveDate: string;
  isActive: boolean;
  updatedAt: string;
  responsibleAdmin: string;
  mandatoryDocs: string[];
  requiresEvc: boolean;
  maxProcessingDays: number;
  description: string;
}

export interface ComplianceItem {
  id: string;
  applicationId: string;
  institutionName: string;
  title: string;
  stage: 'Required' | 'Submitted' | 'Under Review' | 'Accepted' | 'Returned' | 'Closed';
  requiredByDate: string;
  submittedAt?: string;
  daysRemaining: number;
  responsibleParty: 'Institution' | 'EVC Inspection Team' | 'AICTE Scrutiny Cell';
  clockType: 'Institution Clock' | 'Official Review Clock';
  clockStatus: 'Running' | 'Paused' | 'Expired';
  actionHistory: Array<{ timestamp: string; action: string; actor: string }>;
  evcSchedule?: {
    inspectionDate: string;
    teamLead: string;
    venue: string;
    status: 'Scheduled' | 'Completed' | 'Pending';
  };
}

export interface AlertItem {
  id: string;
  applicationId: string;
  type: string;
  severity: 'Critical' | 'Warning' | 'Info';
  status: 'Escalated' | 'Reminder' | 'Manual Review' | 'Pending' | 'Info' | 'Resolved';
  timestamp: string;
  relativeTime: string;
  targetRole: string;
  message: string;
  isRead: boolean;
  retryCount: number;
  deliveryStatus: 'Delivered (In-App)' | 'Queued' | 'Acknowledged';
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  applicationId: string;
  action: string;
  actor: string;
  role: string;
  details: string;
  ruleReference?: string;
}
