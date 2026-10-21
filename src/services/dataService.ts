import {
  ApplicationRecord,
  WorkflowRule,
  ComplianceItem,
  AlertItem,
  AuditEvent,
  StageName,
  ApplicationStatus,
  ApplicationType,
} from '../types';

const STORAGE_KEYS = {
  APPLICATIONS: 'saksham_applications_v1',
  RULES: 'saksham_rules_v1',
  COMPLIANCE: 'saksham_compliance_v1',
  ALERTS: 'saksham_alerts_v1',
  AUDIT: 'saksham_audit_v1',
};

// Key showcase applications matching reference screenshot exactly
const SEED_PRIMARY_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'SAK-2026-1142',
    institutionName: 'ABC Institute of Technology',
    type: 'New Institute',
    currentStage: 'Scrutiny (EVC / SAC-SHC)',
    status: 'In Review',
    assignedRole: 'EVC Expert Panel',
    assignedOfficial: 'Prof. Neha Gupta',
    submissionDate: '2026-09-28',
    dueDate: '2026-10-24',
    daysRemaining: 2,
    category: 'Engineering & Tech',
    region: 'Northern (New Delhi)',
    intakeProposed: 360,
    ruleProvenance: {
      ruleId: 'RULE-2026-APH-01',
      ruleName: 'New Technical Institution Scrutiny & EVC Mandate',
      clauseReference: 'AICTE APH 2026-27, Chapter I, Clause 1.4.2 & 1.6',
      version: 'v2.4 (2026 Rev 1)',
      effectiveDate: '2026-04-01',
      criteriaMatched: 'Category = New Institute; Intake > 300; Requires Mandatory Physical/Hybrid EVC',
      resolvedAt: '2026-10-02 11:20 AM',
      status: 'Resolved',
    },
    documents: [
      {
        id: 'DOC-1142-01',
        name: 'Land Ownership Title Deed & Master Plan',
        category: 'Land & Building',
        uploadDate: '2026-09-28',
        version: 'v1.0',
        fileSize: '8.4 MB',
        validationStatus: 'Valid',
        reviewerComments: 'Verified against State Revenue records. 5.2 acres contiguous land confirmed.',
        extractedData: {
          confidence: 0.98,
          fields: {
            'Land Area': '5.2 Acres',
            'Khasra No': '412/1, 412/2',
            'Ownership': 'Registered Society Trust Deed',
            'Zoning': 'Institutional/Educational',
          },
          verifiedByHuman: true,
        },
      },
      {
        id: 'DOC-1142-02',
        name: 'Building Safety & Occupancy Certificate',
        category: 'Land & Building',
        uploadDate: '2026-09-28',
        version: 'v1.0',
        fileSize: '4.1 MB',
        validationStatus: 'Valid',
        reviewerComments: 'Issued by competent Municipal Architect.',
        extractedData: {
          confidence: 0.94,
          fields: {
            'Built-up Area': '14,200 sq.m.',
            'Structural Audit': 'Seismic Zone IV Compliant',
            'Authority': 'Municipal Corp Division III',
          },
          verifiedByHuman: true,
        },
      },
      {
        id: 'DOC-1142-03',
        name: 'Fire Safety Certificate & NOC',
        category: 'Statutory Approvals',
        uploadDate: '2026-09-29',
        version: 'v1.0',
        fileSize: '2.8 MB',
        validationStatus: 'Valid',
        reviewerComments: 'Valid till 31 March 2027.',
        extractedData: {
          confidence: 0.99,
          fields: {
            'NOC Number': 'FS-ND/2026/8892',
            'Validity Period': '3 Years',
          },
          verifiedByHuman: true,
        },
      },
      {
        id: 'DOC-1142-04',
        name: 'Faculty Cadre Ratio & Qualification Undertaking',
        category: 'Faculty & Staff',
        uploadDate: '2026-09-29',
        version: 'v1.0',
        fileSize: '3.6 MB',
        validationStatus: 'Valid',
        reviewerComments: 'Cadre ratio 1:2:6 verified for initial year.',
        extractedData: {
          confidence: 0.92,
          fields: {
            'Faculty Count': '24 Full-Time Faculty',
            'PhD Holders': '8 Professors/Assoc',
            'Ratio': '1:15 against proposed intake',
          },
          verifiedByHuman: true,
        },
      },
      {
        id: 'DOC-1142-05',
        name: 'Fixed Deposit Receipt (FDR) in joint name of AICTE',
        category: 'Financial',
        uploadDate: '2026-09-30',
        version: 'v1.0',
        fileSize: '1.9 MB',
        validationStatus: 'Valid',
        reviewerComments: 'Rs. 35 Lakhs FDR deposited for 10 years joint lien.',
        extractedData: {
          confidence: 0.97,
          fields: {
            'Amount': 'INR 35,00,000',
            'Bank': 'State Bank of India',
            'Joint Signatory': 'AICTE Member Secretary',
          },
          verifiedByHuman: true,
        },
      },
    ],
    deficiencyHistory: [],
    observations: [
      'Document scrutiny passed with 100% compliance score.',
      'Hybrid/Physical Expert Visiting Committee (EVC) scheduled for 23-24 Oct 2026.',
    ],
    clockState: {
      institutionClockDays: 4,
      officialReviewClockDays: 14,
      isPaused: false,
    },
    evcDetails: {
      required: true,
      scheduledDate: '2026-10-23',
      panelMembers: ['Prof. H. S. Rawat (IIT Delhi)', 'Dr. Sunita Rao (NIT Kurukshetra)'],
      reportStatus: 'Pending',
      reportSummary: 'Inspection scheduled at campus site: Greater Noida Knowledge Park III.',
    },
  },
  {
    id: 'SAK-2026-1178',
    institutionName: 'LN Engineering College',
    type: 'Increase in Intake',
    currentStage: 'Intake & Validation',
    status: 'Deficiency',
    assignedRole: 'Scrutiny Committee',
    assignedOfficial: 'Dr. R. K. Sharma',
    submissionDate: '2026-10-06',
    dueDate: '2026-10-27',
    daysRemaining: 5,
    category: 'Engineering & Tech',
    region: 'Central (Bhopal)',
    intakeProposed: 120,
    ruleProvenance: {
      ruleId: 'RULE-2026-APH-02',
      ruleName: 'Expansion & Intake Augmentation Norms',
      clauseReference: 'AICTE APH 2026-27, Chapter II, Clause 2.3.1',
      version: 'v2.4 (2026 Rev 1)',
      effectiveDate: '2026-04-01',
      criteriaMatched: 'Accreditation status (NBA) must be valid for at least 50% eligible courses',
      resolvedAt: '2026-10-10 03:45 PM',
      status: 'Resolved',
    },
    documents: [
      {
        id: 'DOC-1178-01',
        name: 'NBA Accreditation Certificate for CSE & ECE',
        category: 'Statutory Approvals',
        uploadDate: '2026-10-06',
        version: 'v1.0',
        fileSize: '3.1 MB',
        validationStatus: 'Valid',
        reviewerComments: 'NBA Tier-II accreditation valid up to June 2028.',
        extractedData: {
          confidence: 0.96,
          fields: {
            'Accredited Courses': 'B.Tech CSE, B.Tech ECE',
            'Validity': '30-06-2028',
          },
          verifiedByHuman: true,
        },
      },
      {
        id: 'DOC-1178-02',
        name: 'Audited Financial Statements (Last 3 Financial Years)',
        category: 'Financial',
        uploadDate: '2026-10-06',
        version: 'v1.0',
        fileSize: '12.4 MB',
        validationStatus: 'Valid',
        reviewerComments: 'Audited balance sheets verified.',
      },
      {
        id: 'DOC-1178-03',
        name: 'Additional Classroom & Lab Infrastructure Blueprint',
        category: 'Land & Building',
        uploadDate: '2026-10-06',
        version: 'v1.0',
        fileSize: '5.6 MB',
        validationStatus: 'Deficient',
        reviewerComments: 'Missing authorized Architect stamp for newly proposed 4 AI/ML computer labs (Clause 2.3.4).',
      },
      {
        id: 'DOC-1178-04',
        name: 'Affiliating University NOC for Intake Expansion',
        category: 'Statutory Approvals',
        uploadDate: '2026-10-06',
        version: 'v1.0',
        fileSize: '2.0 MB',
        validationStatus: 'Pending',
        reviewerComments: 'Awaiting signature of Registrar.',
      },
    ],
    deficiencyHistory: [
      {
        id: 'DEF-1178-01',
        date: '2026-10-18',
        returnedBy: 'Dr. R. K. Sharma',
        role: 'Scrutiny Committee',
        reason: 'Missing Architect certification seal on expansion blueprint and missing Affiliation NOC.',
        missingItems: [
          'Architect-certified floor plan with carpet area specification for 4 new labs',
          'Signed University NOC acknowledging intake increase from 480 to 600',
        ],
        status: 'Open',
      },
    ],
    observations: [
      'Application marked as DEFICIENT. Institution given 10 calendar days to resubmit corrected documents.',
      'Evidence submission clock is active.',
    ],
    clockState: {
      institutionClockDays: 7,
      officialReviewClockDays: 3,
      isPaused: true,
      pauseReason: 'Awaiting institution compliance response to deficiency memo DEF-1178-01',
    },
  },
  {
    id: 'SAK-2026-1034',
    institutionName: 'Sunrise College of Management',
    type: 'Extension',
    currentStage: 'Compliance Monitoring',
    status: 'Due Soon',
    assignedRole: 'Regional Officer',
    assignedOfficial: 'Shri Arvind Joshi',
    submissionDate: '2026-09-15',
    dueDate: '2026-10-29',
    daysRemaining: 10,
    category: 'Management',
    region: 'Western (Mumbai)',
    intakeProposed: 180,
    ruleProvenance: {
      ruleId: 'RULE-2026-APH-03',
      ruleName: 'Annual Extension of Approval (EoA) Compliance Verification',
      clauseReference: 'AICTE APH 2026-27, Chapter III, Clause 3.1.2',
      version: 'v2.4 (2026 Rev 1)',
      effectiveDate: '2026-04-01',
      criteriaMatched: 'Existing Approved Institution; No punitive action in past 3 years',
      resolvedAt: '2026-09-18 10:15 AM',
      status: 'Resolved',
    },
    documents: [
      {
        id: 'DOC-1034-01',
        name: 'Self-Disclosure Undertaking & Student Enrollment Data',
        category: 'Affidavit',
        uploadDate: '2026-09-15',
        version: 'v1.0',
        fileSize: '2.5 MB',
        validationStatus: 'Valid',
      },
      {
        id: 'DOC-1034-02',
        name: 'Faculty Cadre Matrix & Biometric KYC',
        category: 'Faculty & Staff',
        uploadDate: '2026-09-15',
        version: 'v1.0',
        fileSize: '4.8 MB',
        validationStatus: 'Valid',
      },
      {
        id: 'DOC-1034-03',
        name: 'Anti-Ragging Committee & ICC Constitution Order',
        category: 'Statutory Approvals',
        uploadDate: '2026-09-16',
        version: 'v1.0',
        fileSize: '1.8 MB',
        validationStatus: 'Valid',
      },
    ],
    deficiencyHistory: [],
    observations: [
      'Self-disclosure reviewed. All faculty salaries paid through digital bank transfers.',
      'Mandatory barrier-free ramp certificate pending upload by 29 Oct 2026.',
    ],
    clockState: {
      institutionClockDays: 2,
      officialReviewClockDays: 8,
      isPaused: false,
    },
  },
  {
    id: 'SAK-2026-0987',
    institutionName: 'RK Institute of Pharmacy',
    type: 'New Programme',
    currentStage: 'Rule Resolution',
    status: 'Exception',
    assignedRole: 'Regulations Cell',
    assignedOfficial: 'Joint Director Singh',
    submissionDate: '2026-09-10',
    dueDate: '2026-10-18',
    daysRemaining: -3,
    category: 'Pharmacy',
    region: 'South-Western (Bengaluru)',
    intakeProposed: 60,
    ruleProvenance: {
      ruleId: 'RULE-2026-EXC-01',
      ruleName: 'D.Pharm to B.Pharm Transition Rule Ambiguity',
      clauseReference: 'AICTE APH Clause 4.8 vs PCI Regulation Gazette S.O. 112',
      version: 'v1.0 (Unresolved Conflict)',
      effectiveDate: '2026-05-10',
      criteriaMatched: 'Dual regulator overlap: State Technical Board vs Pharmacy Council norms',
      resolvedAt: 'Pending Manual Resolution',
      status: 'Conflicting',
    },
    documents: [
      {
        id: 'DOC-0987-01',
        name: 'PCI (Pharmacy Council of India) In-Principle Consent',
        category: 'Statutory Approvals',
        uploadDate: '2026-09-10',
        version: 'v1.0',
        fileSize: '3.4 MB',
        validationStatus: 'Pending',
        reviewerComments: 'Contains conditional caveat on faculty qualifications.',
      },
      {
        id: 'DOC-0987-02',
        name: 'Pharmaceutics & Pharmacology Lab Equipment Inventory',
        category: 'Academic',
        uploadDate: '2026-09-10',
        version: 'v1.0',
        fileSize: '6.7 MB',
        validationStatus: 'Valid',
      },
    ],
    deficiencyHistory: [],
    observations: [
      'EXCEPTION QUEUE: Dual regulatory requirement conflict between AICTE APH Chapter 4 and State PCI norms.',
      'Manual Review required by Regulations Cell prior to stage routing.',
    ],
    clockState: {
      institutionClockDays: 0,
      officialReviewClockDays: 21,
      isPaused: true,
      pauseReason: 'Case placed in Exception Queue awaiting Policy Cell determination',
    },
    evcDetails: {
      required: true,
      reportStatus: 'Pending',
      reportSummary: 'EVC report submission overdue by 2 days.',
    },
  },
  {
    id: 'SAK-2026-1101',
    institutionName: 'DPS Polytechnic',
    type: 'Closure',
    currentStage: 'Final Decision',
    status: 'Approved',
    assignedRole: 'Member Secretary',
    assignedOfficial: 'Dr. Mamidala Jagadesh',
    submissionDate: '2026-08-20',
    dueDate: '2026-10-15',
    daysRemaining: 0,
    category: 'Polytechnic',
    region: 'Northern (New Delhi)',
    intakeProposed: 0,
    ruleProvenance: {
      ruleId: 'RULE-2026-APH-05',
      ruleName: 'Progressive / Voluntary Closure Scrutiny',
      clauseReference: 'AICTE APH 2026-27, Chapter V, Clause 5.2.3',
      version: 'v2.4 (2026 Rev 1)',
      effectiveDate: '2026-04-01',
      criteriaMatched: 'Zero enrolled students; All security deposits returned; State Govt NOC obtained',
      resolvedAt: '2026-09-02 04:10 PM',
      status: 'Resolved',
    },
    documents: [
      {
        id: 'DOC-1101-01',
        name: 'State Directorate of Technical Education No Objection',
        category: 'Statutory Approvals',
        uploadDate: '2026-08-20',
        version: 'v1.0',
        fileSize: '2.1 MB',
        validationStatus: 'Valid',
      },
      {
        id: 'DOC-1101-02',
        name: 'Student Transfer & Fee Clearance Audit',
        category: 'Academic',
        uploadDate: '2026-08-21',
        version: 'v1.0',
        fileSize: '3.9 MB',
        validationStatus: 'Valid',
      },
      {
        id: 'DOC-1101-03',
        name: 'Staff Resettlement and Gratuity Settlement Certificate',
        category: 'Faculty & Staff',
        uploadDate: '2026-08-21',
        version: 'v1.0',
        fileSize: '2.8 MB',
        validationStatus: 'Valid',
      },
    ],
    deficiencyHistory: [],
    observations: [
      'All regulatory clearances provided.',
      'Member Secretary recorded final approval for Voluntary Closure for academic session 2026-27.',
    ],
    finalDecision: {
      verdict: 'Approved',
      date: '2026-10-15',
      decidedBy: 'Member Secretary, AICTE',
      remarks: 'Voluntary closure sanctioned as per APH 2026-27 Clause 5.2.3.',
      loaNumber: 'AICTE/NWRO/CLOSURE/2026-27/044',
    },
    clockState: {
      institutionClockDays: 0,
      officialReviewClockDays: 0,
      isPaused: true,
      pauseReason: 'Case closed with final decision recorded',
    },
  },
  {
    id: 'SAK-2026-0876',
    institutionName: 'Vidyapeeth Institute of Science',
    type: 'Extension',
    currentStage: 'Compliance Monitoring',
    status: 'Overdue',
    assignedRole: 'Scrutiny Committee',
    assignedOfficial: 'Prof. Neha Gupta',
    submissionDate: '2026-08-30',
    dueDate: '2026-10-14',
    daysRemaining: -7,
    category: 'Engineering & Tech',
    region: 'Central (Bhopal)',
    intakeProposed: 420,
    ruleProvenance: {
      ruleId: 'RULE-2026-APH-03',
      ruleName: 'Annual Extension of Approval (EoA) Compliance Verification',
      clauseReference: 'AICTE APH 2026-27, Chapter III, Clause 3.1.2',
      version: 'v2.4 (2026 Rev 1)',
      effectiveDate: '2026-04-01',
      criteriaMatched: 'Extension application requiring mandatory audited expenditure filing',
      resolvedAt: '2026-09-05 11:00 AM',
      status: 'Resolved',
    },
    documents: [
      {
        id: 'DOC-0876-01',
        name: 'Campus Fire NOC Renewal Order',
        category: 'Statutory Approvals',
        uploadDate: '2026-08-30',
        version: 'v1.0',
        fileSize: '3.1 MB',
        validationStatus: 'Valid',
      },
      {
        id: 'DOC-0876-02',
        name: 'Mandatory Disclosure Web Link & Evidence',
        category: 'Affidavit',
        uploadDate: '2026-08-30',
        version: 'v1.0',
        fileSize: '1.2 MB',
        validationStatus: 'Deficient',
        reviewerComments: 'Website link broken and affidavit not notarized.',
      },
    ],
    deficiencyHistory: [
      {
        id: 'DEF-0876-01',
        date: '2026-10-01',
        returnedBy: 'Prof. Neha Gupta',
        role: 'Scrutiny Committee',
        reason: 'Notarized mandatory disclosure affidavit overdue by 7 days.',
        missingItems: ['Notarized Affidavit on Rs. 100 Non-Judicial Stamp Paper with active URL'],
        status: 'Open',
      },
    ],
    observations: [
      'Compliance undertaking overdue by 7 days. Escalation triggered to Regional Officer.',
    ],
    clockState: {
      institutionClockDays: 21,
      officialReviewClockDays: 4,
      isPaused: false,
    },
  },
  {
    id: 'SAK-2026-1203',
    institutionName: 'National Academy of Engineering',
    type: 'New Institute',
    currentStage: 'Intake & Validation',
    status: 'In Review',
    assignedRole: 'Scrutiny Committee',
    assignedOfficial: 'Dr. R. K. Sharma',
    submissionDate: '2026-10-18',
    dueDate: '2026-11-02',
    daysRemaining: 12,
    category: 'Engineering & Tech',
    region: 'Western (Mumbai)',
    intakeProposed: 300,
    ruleProvenance: {
      ruleId: 'RULE-2026-APH-01',
      ruleName: 'New Technical Institution Scrutiny & EVC Mandate',
      clauseReference: 'AICTE APH 2026-27, Chapter I, Clause 1.4.2 & 1.6',
      version: 'v2.4 (2026 Rev 1)',
      effectiveDate: '2026-04-01',
      criteriaMatched: 'New application pending intake validation',
      resolvedAt: '2026-10-19 09:30 AM',
      status: 'Resolved',
    },
    documents: [
      {
        id: 'DOC-1203-01',
        name: 'Society Registration Certificate & Bylaws',
        category: 'Statutory Approvals',
        uploadDate: '2026-10-18',
        version: 'v1.0',
        fileSize: '4.5 MB',
        validationStatus: 'Valid',
      },
      {
        id: 'DOC-1203-02',
        name: 'Land Conversion Certificate',
        category: 'Land & Building',
        uploadDate: '2026-10-18',
        version: 'v1.0',
        fileSize: '3.7 MB',
        validationStatus: 'Pending',
        reviewerComments: 'Watermark missing, requires re-scan.',
      },
    ],
    deficiencyHistory: [],
    observations: ['Document validation underway.'],
    clockState: {
      institutionClockDays: 3,
      officialReviewClockDays: 2,
      isPaused: false,
    },
  },
];

// Helper to generate deterministic pool so total is exactly 248 applications
function generateFullDataset(): ApplicationRecord[] {
  const list: ApplicationRecord[] = [...SEED_PRIMARY_APPLICATIONS];
  
  // We need total 248 applications.
  // Breakdown matching reference image:
  // Total = 248
  // In Process: 142
  // Approved: 68
  // Returned / Deficiency: 24
  // Overdue / Escalated: 14
  // Stage breakdown:
  // Intake & Validation: 62
  // Rule Resolution: 48
  // Scrutiny (EVC / SAC-SHC): 56
  // Compliance Monitoring: 38
  // Final Decision: 30 (26 Approved + 4 In Review)
  // Let's create the remaining items with realistic institution names and valid states.
  
  const institutions = [
    'Aryabhatta Institute of Technology', 'Kalinga Institute of Engineering',
    'Chanakya School of Management', 'Heritage College of Pharmacy',
    'Shivaji Technical University Campus', 'Tagore Polytechnic Institute',
    'Bharati Vidyapeeth College of Engineering', 'Maharishi Institute of Management',
    'Modern College of Architecture', 'Apex Institute of Computer Applications',
    'Global Engineering Academy', 'St. Joseph Technical Institute',
    'Sardar Patel Institute of Tech', 'Gautam Buddha University College',
    'Vivekananda Institute of Science', 'Nalanda International College',
    'Symbiosis Polytechnic Centre', 'Amrita Institute of Advanced Tech',
    'Deccan Institute of Management Studies', 'Himalayan Technical University'
  ];

  const types: ApplicationType[] = [
    'New Institute', 'Increase in Intake', 'Extension', 
    'New Programme', 'Closure', 'Change of Site'
  ];

  const categories = [
    'Engineering & Tech', 'Management', 'Pharmacy', 'Polytechnic', 'Architecture'
  ];

  const regions = [
    'Northern (New Delhi)', 'Western (Mumbai)', 'Southern (Chennai)', 
    'South-Western (Bengaluru)', 'Central (Bhopal)', 'Eastern (Kolkata)'
  ];

  // We already have 7 in SEED_PRIMARY_APPLICATIONS:
  // 1142: In Review (Scrutiny)
  // 1178: Deficiency (Intake & Validation)
  // 1034: Due Soon (Compliance Monitoring)
  // 0987: Exception (Rule Resolution)
  // 1101: Approved (Final Decision)
  // 0876: Overdue (Compliance Monitoring)
  // 1203: In Review (Intake & Validation)
  
  // Target quotas:
  // Status:
  // Approved: 68 (1 in seed -> 67 to generate)
  // Returned/Deficiency: 24 (1 in seed -> 23 to generate)
  // Overdue: 14 (1 in seed -> 13 to generate)
  // In Process (includes Due Soon, Exception, In Review): 142 (4 in seed -> 138 to generate)
  // Sum = 68 + 24 + 14 + 142 = 248.
  
  // Stage targets:
  // Intake & Validation: 62 (2 in seed -> 60)
  // Rule Resolution: 48 (1 in seed -> 47)
  // Scrutiny (EVC / SAC-SHC): 56 (1 in seed -> 55)
  // Compliance Monitoring: 38 (2 in seed -> 36)
  // Final Decision: 30 (1 in seed -> 29)
  // Sum = 62 + 48 + 56 + 38 + 30 = 248.

  let seedIndex = 2000;
  
  // Create approved cases (Final Decision)
  for (let i = 0; i < 29; i++) {
    const inst = institutions[i % institutions.length] + ` (Campus ${Math.floor(i / 5) + 1})`;
    list.push({
      id: `SAK-2026-${seedIndex++}`,
      institutionName: inst,
      type: types[i % types.length],
      currentStage: 'Final Decision',
      status: 'Approved',
      assignedRole: 'Member Secretary',
      assignedOfficial: 'Dr. Mamidala Jagadesh',
      submissionDate: '2026-07-15',
      dueDate: '2026-09-30',
      daysRemaining: 0,
      category: categories[i % categories.length],
      region: regions[i % regions.length],
      intakeProposed: 180,
      ruleProvenance: {
        ruleId: 'RULE-2026-APH-03',
        ruleName: 'Approval Process Standard Norm',
        clauseReference: 'AICTE APH 2026-27 Clause 3.2',
        version: 'v2.4',
        effectiveDate: '2026-04-01',
        criteriaMatched: 'All conditions satisfied',
        resolvedAt: '2026-09-15',
        status: 'Resolved',
      },
      documents: [],
      deficiencyHistory: [],
      observations: ['Final clearance granted by the Competent Authority.'],
      finalDecision: {
        verdict: 'Approved',
        date: '2026-09-28',
        decidedBy: 'Executive Committee, AICTE',
        remarks: 'Approved for Academic Session 2026-27.',
        loaNumber: `AICTE/APPROVAL/2026-27/${seedIndex}`,
      },
      clockState: { institutionClockDays: 0, officialReviewClockDays: 0, isPaused: true },
    });
  }

  // 38 more approved in other or final stages to total 68 approved
  for (let i = 0; i < 38; i++) {
    const inst = institutions[(i + 4) % institutions.length] + ` Unit ${i + 1}`;
    list.push({
      id: `SAK-2026-${seedIndex++}`,
      institutionName: inst,
      type: types[i % types.length],
      currentStage: (i % 2 === 0 ? 'Compliance Monitoring' : 'Scrutiny (EVC / SAC-SHC)') as StageName,
      status: 'Approved',
      assignedRole: 'Regional Officer',
      assignedOfficial: 'Shri Arvind Joshi',
      submissionDate: '2026-08-10',
      dueDate: '2026-10-01',
      daysRemaining: 0,
      category: categories[i % categories.length],
      region: regions[i % regions.length],
      intakeProposed: 120,
      ruleProvenance: null,
      documents: [],
      deficiencyHistory: [],
      observations: ['Prior year audit and current stage approved.'],
      clockState: { institutionClockDays: 0, officialReviewClockDays: 0, isPaused: true },
    });
  }

  // 23 more Deficiency cases
  for (let i = 0; i < 23; i++) {
    const inst = institutions[(i + 7) % institutions.length] + ` Group ${i + 1}`;
    const stage = i < 15 ? 'Intake & Validation' : 'Scrutiny (EVC / SAC-SHC)';
    list.push({
      id: `SAK-2026-${seedIndex++}`,
      institutionName: inst,
      type: types[i % types.length],
      currentStage: stage,
      status: 'Deficiency',
      assignedRole: 'Scrutiny Committee',
      assignedOfficial: 'Dr. R. K. Sharma',
      submissionDate: '2026-09-20',
      dueDate: '2026-10-28',
      daysRemaining: 4,
      category: categories[i % categories.length],
      region: regions[i % regions.length],
      intakeProposed: 240,
      ruleProvenance: null,
      documents: [],
      deficiencyHistory: [
        {
          id: `DEF-GEN-${i}`,
          date: '2026-10-15',
          returnedBy: 'Scrutiny Officer',
          role: 'Scrutiny Committee',
          reason: 'Land conversion deed or structural safety certificate incomplete.',
          missingItems: ['Clear title deed with GPS geo-coordinates'],
          status: 'Open',
        },
      ],
      observations: ['Notice served for compliance deficiency correction.'],
      clockState: { institutionClockDays: 6, officialReviewClockDays: 4, isPaused: true },
    });
  }

  // 13 more Overdue cases
  for (let i = 0; i < 13; i++) {
    const inst = institutions[(i + 2) % institutions.length] + ` Campus B`;
    const stage = (i < 5 ? 'Rule Resolution' : i < 9 ? 'Compliance Monitoring' : 'Scrutiny (EVC / SAC-SHC)') as StageName;
    list.push({
      id: `SAK-2026-${seedIndex++}`,
      institutionName: inst,
      type: types[i % types.length],
      currentStage: stage,
      status: 'Overdue',
      assignedRole: 'Regional Officer',
      assignedOfficial: 'Prof. Neha Gupta',
      submissionDate: '2026-08-15',
      dueDate: '2026-10-12',
      daysRemaining: -9,
      category: categories[i % categories.length],
      region: regions[i % regions.length],
      intakeProposed: 180,
      ruleProvenance: null,
      documents: [],
      deficiencyHistory: [],
      observations: ['Statutory response deadline lapsed. Triggered Tier-2 escalation.'],
      clockState: { institutionClockDays: 24, officialReviewClockDays: 12, isPaused: false },
    });
  }

  // Remaining for In Process to hit exactly 142 total in process (and hit stage counts: Intake: 62, Rule: 48, Scrutiny: 56, Compliance: 38, Final: 30)
  // Let's count current stage totals:
  const stageCounts: Record<StageName, number> = {
    'Intake & Validation': 0,
    'Rule Resolution': 0,
    'Scrutiny (EVC / SAC-SHC)': 0,
    'Compliance Monitoring': 0,
    'Final Decision': 0,
  };

  list.forEach(item => {
    stageCounts[item.currentStage]++;
  });

  const targets: Record<StageName, number> = {
    'Intake & Validation': 62,
    'Rule Resolution': 48,
    'Scrutiny (EVC / SAC-SHC)': 56,
    'Compliance Monitoring': 38,
    'Final Decision': 30,
  };

  (Object.keys(targets) as StageName[]).forEach((stage) => {
    const needed = targets[stage] - stageCounts[stage];
    for (let k = 0; k < needed; k++) {
      const idx = seedIndex++;
      const isDueSoon = k % 4 === 0;
      const isEx = stage === 'Rule Resolution' && k === 1;
      const st: ApplicationStatus = isEx ? 'Exception' : isDueSoon ? 'Due Soon' : 'In Review';
      list.push({
        id: `SAK-2026-${idx}`,
        institutionName: institutions[k % institutions.length] + ` Branch ${k + 1}`,
        type: types[k % types.length],
        currentStage: stage,
        status: st,
        assignedRole: stage === 'Scrutiny (EVC / SAC-SHC)' ? 'EVC Expert Panel' : 'Scrutiny Committee',
        assignedOfficial: 'Dr. R. K. Sharma',
        submissionDate: '2026-09-25',
        dueDate: isDueSoon ? '2026-10-26' : '2026-11-10',
        daysRemaining: isDueSoon ? 5 : 20,
        category: categories[k % categories.length],
        region: regions[k % regions.length],
        intakeProposed: 120 + (k % 4) * 60,
        ruleProvenance: {
          ruleId: 'RULE-2026-APH-01',
          ruleName: 'Standard Procedural Routing',
          clauseReference: 'AICTE APH 2026-27 Ch. 2',
          version: 'v2.4',
          effectiveDate: '2026-04-01',
          criteriaMatched: 'Automatic verification passed',
          resolvedAt: '2026-10-01',
          status: 'Resolved',
        },
        documents: [],
        deficiencyHistory: [],
        observations: ['Active processing as per workflow stage standard operating procedures.'],
        clockState: { institutionClockDays: 4, officialReviewClockDays: 6, isPaused: false },
      });
    }
  });

  return list;
}

// Configurable workflow rules with full provenance
const SEED_RULES: WorkflowRule[] = [
  {
    id: 'RULE-2026-APH-01',
    name: 'New Technical Institution Scrutiny & EVC Routing',
    category: 'New Institute',
    targetStage: 'Scrutiny (EVC / SAC-SHC)',
    stageCondition: 'Mandatory intake validation passed & land/building verified -> Mandatory EVC',
    ruleSource: 'AICTE Approval Process Handbook (APH) 2026-27, Chapter I, Clause 1.4.2 & 1.6',
    version: 'v2.4 (2026 Rev 1)',
    effectiveDate: '2026-04-01',
    isActive: true,
    updatedAt: '2026-09-15 14:30',
    responsibleAdmin: 'AICTE Regulations & Approval Bureau',
    mandatoryDocs: [
      'Land Ownership Title Deed & Master Plan',
      'Building Safety & Occupancy Certificate',
      'Fire Safety Certificate & NOC',
      'Faculty Cadre Ratio & Qualification Undertaking',
      'Fixed Deposit Receipt (FDR) Joint Lien',
    ],
    requiresEvc: true,
    maxProcessingDays: 30,
    description: 'Mandatory physical/hybrid Expert Visiting Committee inspection required for all proposed new institutions.',
  },
  {
    id: 'RULE-2026-APH-02',
    name: 'Increase in Intake / Additional Course Criteria',
    category: 'Increase in Intake',
    targetStage: 'Rule Resolution',
    stageCondition: 'Accreditation status (NBA) active for at least 50% eligible programmes and Faculty 1:15 ratio',
    ruleSource: 'AICTE APH 2026-27, Chapter II, Clause 2.3.1 - 2.3.5',
    version: 'v2.4 (2026 Rev 1)',
    effectiveDate: '2026-04-01',
    isActive: true,
    updatedAt: '2026-09-12 10:15',
    responsibleAdmin: 'AICTE Technical Education Bureau',
    mandatoryDocs: [
      'NBA Accreditation Certificate',
      'Audited Financial Statements (Last 3 FYs)',
      'Additional Classroom & Lab Infrastructure Blueprint',
      'Affiliating University NOC',
    ],
    requiresEvc: false,
    maxProcessingDays: 21,
    description: 'Allows intake augmentation without physical EVC if NBA score > 675 and University NOC is submitted.',
  },
  {
    id: 'RULE-2026-APH-03',
    name: 'Annual Extension of Approval (EoA) Fast-Track',
    category: 'Extension',
    targetStage: 'Compliance Monitoring',
    stageCondition: 'Clean self-disclosure + Zero pending vigilance/court complaints in past 3 cycles',
    ruleSource: 'AICTE APH 2026-27, Chapter III, Clause 3.1.2',
    version: 'v2.4 (2026 Rev 1)',
    effectiveDate: '2026-04-01',
    isActive: true,
    updatedAt: '2026-09-10 11:20',
    responsibleAdmin: 'AICTE Regional Office Co-ordination Cell',
    mandatoryDocs: [
      'Self-Disclosure Undertaking & Student Enrollment Data',
      'Faculty Cadre Matrix & Biometric KYC',
      'Anti-Ragging Committee & ICC Constitution Order',
    ],
    requiresEvc: false,
    maxProcessingDays: 14,
    description: 'Autonomous, systematic document verification for smooth academic continuum.',
  },
  {
    id: 'RULE-2026-APH-04',
    name: 'New Programme Introduction (Emerging Technologies)',
    category: 'New Programme',
    targetStage: 'Scrutiny (EVC / SAC-SHC)',
    stageCondition: 'Emerging tech stream (AI, Robotics, Cyber Security, EV) with industry MoU partner',
    ruleSource: 'AICTE APH 2026-27, Chapter IV, Clause 4.2.1 (Focus on NEP 2020)',
    version: 'v2.4 (2026 Rev 1)',
    effectiveDate: '2026-04-01',
    isActive: true,
    updatedAt: '2026-09-14 16:00',
    responsibleAdmin: 'AICTE Policy & Academic Planning Cell',
    mandatoryDocs: [
      'Industry MoU for Curriculum & Internship',
      'Specialized Lab Equipment Invoice & Setup Proof',
      'University Syllabus Approval / In-Principle Consent',
    ],
    requiresEvc: true,
    maxProcessingDays: 25,
    description: 'Special scrutiny channel to accelerate emerging technologies education.',
  },
  {
    id: 'RULE-2026-APH-05',
    name: 'Voluntary / Progressive Closure Verification',
    category: 'Closure',
    targetStage: 'Final Decision',
    stageCondition: 'Zero pending enrolled students + State Govt NOC + Staff settlement verified',
    ruleSource: 'AICTE APH 2026-27, Chapter V, Clause 5.2.3',
    version: 'v2.4 (2026 Rev 1)',
    effectiveDate: '2026-04-01',
    isActive: true,
    updatedAt: '2026-09-08 12:40',
    responsibleAdmin: 'AICTE Legal & Scrutiny Wing',
    mandatoryDocs: [
      'State Directorate of Technical Education No Objection',
      'Student Transfer & Fee Clearance Audit',
      'Staff Resettlement and Gratuity Settlement Certificate',
    ],
    requiresEvc: false,
    maxProcessingDays: 20,
    description: 'Strict safeguarding of student transcripts and staff liabilities prior to formal closure.',
  },
  {
    id: 'RULE-2026-EXC-01',
    name: 'Dual Regulatory Conflict Exception Handler',
    category: 'All Categories',
    targetStage: 'Rule Resolution',
    stageCondition: 'When state statutory body and national council guidelines present divergent thresholds',
    ruleSource: 'AICTE Standing Advisory Committee (SAC) Resolution 88/2026',
    version: 'v1.1 (Exception Protocol)',
    effectiveDate: '2026-05-10',
    isActive: true,
    updatedAt: '2026-09-20 09:10',
    responsibleAdmin: 'AICTE Standing Appellate Committee (SAC)',
    mandatoryDocs: ['Affiliation Order', 'Council Gazetted Norms'],
    requiresEvc: false,
    maxProcessingDays: 7,
    description: 'Transfers case into human Exception Queue for resolution by Joint Director or Member Secretary.',
  },
];

// Seed Compliance & EVC items
const SEED_COMPLIANCE: ComplianceItem[] = [
  {
    id: 'CMP-2026-01',
    applicationId: 'SAK-2026-1142',
    institutionName: 'ABC Institute of Technology',
    title: 'Physical EVC Inspection & Lab Verification',
    stage: 'Under Review',
    requiredByDate: '2026-10-24',
    submittedAt: '2026-10-21 09:15 AM',
    daysRemaining: 2,
    responsibleParty: 'EVC Inspection Team',
    clockType: 'Official Review Clock',
    clockStatus: 'Running',
    actionHistory: [
      { timestamp: '2026-10-15 10:00', action: 'EVC Committee Constituted', actor: 'Regional Officer' },
      { timestamp: '2026-10-20 14:30', action: 'Inspection Itinerary Dispatched', actor: 'Prof. Neha Gupta' },
    ],
    evcSchedule: {
      inspectionDate: '2026-10-23',
      teamLead: 'Prof. H. S. Rawat (IIT Delhi)',
      venue: 'ABC Tech Campus, Greater Noida',
      status: 'Scheduled',
    },
  },
  {
    id: 'CMP-2026-02',
    applicationId: 'SAK-2026-0876',
    institutionName: 'Vidyapeeth Institute of Science',
    title: 'Mandatory Public Disclosure & Anti-Ragging Undertaking',
    stage: 'Returned',
    requiredByDate: '2026-10-14',
    daysRemaining: -7,
    responsibleParty: 'Institution',
    clockType: 'Institution Clock',
    clockStatus: 'Expired',
    actionHistory: [
      { timestamp: '2026-10-01 11:00', action: 'Deficiency Notice Issued', actor: 'Prof. Neha Gupta' },
      { timestamp: '2026-10-14 23:59', action: 'Deadline Expired', actor: 'System Alert Engine' },
    ],
  },
  {
    id: 'CMP-2026-03',
    applicationId: 'SAK-2026-1034',
    institutionName: 'Sunrise College of Management',
    title: 'Barrier-Free Campus & Ramp Compliance Audit',
    stage: 'Required',
    requiredByDate: '2026-10-29',
    daysRemaining: 10,
    responsibleParty: 'Institution',
    clockType: 'Institution Clock',
    clockStatus: 'Running',
    actionHistory: [
      { timestamp: '2026-09-18 10:00', action: 'Obligation Registered', actor: 'Shri Arvind Joshi' },
    ],
  },
  {
    id: 'CMP-2026-04',
    applicationId: 'SAK-2026-1178',
    institutionName: 'LN Engineering College',
    title: 'Architect Certified Lab Blueprints Resubmission',
    stage: 'Returned',
    requiredByDate: '2026-10-27',
    daysRemaining: 5,
    responsibleParty: 'Institution',
    clockType: 'Institution Clock',
    clockStatus: 'Running',
    actionHistory: [
      { timestamp: '2026-10-18 11:20', action: 'Deficiency Notice DEF-1178-01 Served', actor: 'Dr. R. K. Sharma' },
    ],
  },
  {
    id: 'CMP-2026-05',
    applicationId: 'SAK-2026-1101',
    institutionName: 'DPS Polytechnic',
    title: 'Staff Gratuity and Student Transfer Completion Certificate',
    stage: 'Closed',
    requiredByDate: '2026-10-15',
    submittedAt: '2026-10-12 16:40',
    daysRemaining: 0,
    responsibleParty: 'AICTE Scrutiny Cell',
    clockType: 'Official Review Clock',
    clockStatus: 'Paused',
    actionHistory: [
      { timestamp: '2026-10-14 17:00', action: 'Verified & Accepted by Member Secretary', actor: 'Dr. Mamidala Jagadesh' },
    ],
  },
];

// Seed Alerts matching screenshot
const SEED_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2026-01',
    applicationId: 'SAK-2026-0987',
    type: 'Pending EVC report',
    severity: 'Critical',
    status: 'Escalated',
    timestamp: '2026-10-21T08:30:00Z',
    relativeTime: '2 hours ago',
    targetRole: 'Regional Officer',
    message: 'Expert Visiting Committee inspection report not submitted within 48h SLA window for RK Institute of Pharmacy.',
    isRead: false,
    retryCount: 2,
    deliveryStatus: 'Delivered (In-App)',
  },
  {
    id: 'ALT-2026-02',
    applicationId: 'SAK-2026-0876',
    type: 'Undertaking overdue',
    severity: 'Warning',
    status: 'Reminder',
    timestamp: '2026-10-21T05:30:00Z',
    relativeTime: '5 hours ago',
    targetRole: 'Institution',
    message: 'Statutory undertaking for Vidyapeeth Institute of Science is 7 days past deadline. Escalated to Tier-2.',
    isRead: false,
    retryCount: 3,
    deliveryStatus: 'Delivered (In-App)',
  },
  {
    id: 'ALT-2026-03',
    applicationId: 'SAK-2026-1178',
    type: 'Conflicting rules detected',
    severity: 'Critical',
    status: 'Manual Review',
    timestamp: '2026-10-20T10:00:00Z',
    relativeTime: '1 day ago',
    targetRole: 'Scrutiny Committee',
    message: 'Rule resolution triggered exception: NBA Tier-II validation vs intake increase threshold discrepancy.',
    isRead: false,
    retryCount: 1,
    deliveryStatus: 'Delivered (In-App)',
  },
  {
    id: 'ALT-2026-04',
    applicationId: 'SAK-2026-1203',
    type: 'Document missing',
    severity: 'Warning',
    status: 'Pending',
    timestamp: '2026-10-20T14:15:00Z',
    relativeTime: '1 day ago',
    targetRole: 'Institution',
    message: 'Land conversion deed watermark verification incomplete for National Academy of Engineering.',
    isRead: true,
    retryCount: 1,
    deliveryStatus: 'Delivered (In-App)',
  },
  {
    id: 'ALT-2026-05',
    applicationId: 'SAK-2026-1101',
    type: 'Stage transition completed',
    severity: 'Info',
    status: 'Info',
    timestamp: '2026-10-19T11:00:00Z',
    relativeTime: '2 days ago',
    targetRole: 'Administrator',
    message: 'Application SAK-2026-1101 has completed final decision stage: Voluntary Closure approved.',
    isRead: true,
    retryCount: 1,
    deliveryStatus: 'Delivered (In-App)',
  },
];

// Initial Audit Trail
const SEED_AUDIT: AuditEvent[] = [
  {
    id: 'AUD-2026-001',
    timestamp: '2026-10-21 10:15 AM',
    applicationId: 'SAK-2026-1142',
    action: 'Stage Transition: Scrutiny (EVC / SAC-SHC)',
    actor: 'Prof. Neha Gupta',
    role: 'Scrutiny Committee',
    details: 'Routed to Scrutiny stage following 100% document validation and Rule RULE-2026-APH-01 resolution.',
    ruleReference: 'RULE-2026-APH-01 (v2.4)',
  },
  {
    id: 'AUD-2026-002',
    timestamp: '2026-10-20 03:20 PM',
    applicationId: 'SAK-2026-1178',
    action: 'Deficiency Notice Returned',
    actor: 'Dr. R. K. Sharma',
    role: 'Scrutiny Committee',
    details: 'Issued deficiency memo DEF-1178-01 for missing architect seal on expansion blueprint.',
    ruleReference: 'RULE-2026-APH-02 (v2.4)',
  },
  {
    id: 'AUD-2026-003',
    timestamp: '2026-10-19 11:30 AM',
    applicationId: 'SAK-2026-0987',
    action: 'Exception Queue Placement',
    actor: 'Workflow Engine',
    role: 'Automated Rule Resolution',
    details: 'Conflicting state statutory threshold vs AICTE APH Chapter 4 detected; assigned to Regulations Cell.',
    ruleReference: 'RULE-2026-EXC-01 (v1.1)',
  },
  {
    id: 'AUD-2026-004',
    timestamp: '2026-10-15 04:45 PM',
    applicationId: 'SAK-2026-1101',
    action: 'Final Approval Recorded',
    actor: 'Dr. Mamidala Jagadesh',
    role: 'Member Secretary',
    details: 'Voluntary closure sanctioned under APH Clause 5.2.3. LOA # AICTE/NWRO/CLOSURE/2026-27/044 generated.',
    ruleReference: 'RULE-2026-APH-05 (v2.4)',
  },
  {
    id: 'AUD-2026-005',
    timestamp: '2026-10-14 09:10 AM',
    applicationId: 'SAK-2026-0876',
    action: 'Tier-2 Escalation Triggered',
    actor: 'System Alert Engine',
    role: 'Automated Monitor',
    details: 'Compliance deadline for public disclosure affidavit lapsed by 7 days without institution submission.',
  },
];

class DataService {
  private get<T>(key: string, defaultVal: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(stored) as T;
    } catch {
      return defaultVal;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }

  // Applications
  getApplications(): ApplicationRecord[] {
    return this.get<ApplicationRecord[]>(STORAGE_KEYS.APPLICATIONS, generateFullDataset());
  }

  getApplicationById(id: string): ApplicationRecord | undefined {
    return this.getApplications().find((app) => app.id === id);
  }

  saveApplications(apps: ApplicationRecord[]): void {
    this.set(STORAGE_KEYS.APPLICATIONS, apps);
  }

  updateApplication(id: string, updates: Partial<ApplicationRecord>, auditAction?: string, actor = 'AICTE Official', role = 'AICTE Official'): ApplicationRecord | undefined {
    const apps = this.getApplications();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    const updated = { ...apps[index], ...updates };
    apps[index] = updated;
    this.saveApplications(apps);

    if (auditAction) {
      this.addAuditEvent({
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        applicationId: id,
        action: auditAction,
        actor,
        role,
        details: typeof updates === 'object' ? JSON.stringify(updates).slice(0, 150) : 'Updated record',
        ruleReference: updated.ruleProvenance?.ruleId,
      });
    }

    return updated;
  }

  createApplication(data: Partial<ApplicationRecord>): ApplicationRecord {
    const apps = this.getApplications();
    const newId = `SAK-2026-${Math.floor(1250 + Math.random() * 500)}`;
    const newApp: ApplicationRecord = {
      id: newId,
      institutionName: data.institutionName || 'New Technical Institute',
      type: data.type || 'New Institute',
      currentStage: 'Intake & Validation',
      status: 'In Review',
      assignedRole: 'Scrutiny Committee',
      assignedOfficial: 'Dr. R. K. Sharma',
      submissionDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: 21,
      category: data.category || 'Engineering & Tech',
      region: data.region || 'Northern (New Delhi)',
      intakeProposed: data.intakeProposed || 300,
      ruleProvenance: null,
      documents: data.documents || [],
      deficiencyHistory: [],
      observations: ['Application created and queued for mandatory field validation.'],
      clockState: {
        institutionClockDays: 0,
        officialReviewClockDays: 1,
        isPaused: false,
      },
    };

    apps.unshift(newApp);
    this.saveApplications(apps);

    this.addAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      applicationId: newId,
      action: 'Application Registered & Submitted',
      actor: 'Institution Authorized Signatory',
      role: 'Institution User',
      details: `New ${newApp.type} application created for ${newApp.institutionName}`,
    });

    return newApp;
  }

  // Rules
  getRules(): WorkflowRule[] {
    return this.get<WorkflowRule[]>(STORAGE_KEYS.RULES, SEED_RULES);
  }

  updateRule(id: string, updates: Partial<WorkflowRule>): WorkflowRule | undefined {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    rules[idx] = { ...rules[idx], ...updates, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) };
    this.set(STORAGE_KEYS.RULES, rules);
    return rules[idx];
  }

  createRule(rule: Omit<WorkflowRule, 'id' | 'updatedAt'>): WorkflowRule {
    const rules = this.getRules();
    const newRule: WorkflowRule = {
      ...rule,
      id: `RULE-2026-${Math.floor(100 + Math.random() * 900)}`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    rules.push(newRule);
    this.set(STORAGE_KEYS.RULES, rules);
    return newRule;
  }

  // Compliance
  getComplianceItems(): ComplianceItem[] {
    return this.get<ComplianceItem[]>(STORAGE_KEYS.COMPLIANCE, SEED_COMPLIANCE);
  }

  updateComplianceItem(id: string, updates: Partial<ComplianceItem>): ComplianceItem | undefined {
    const items = this.getComplianceItems();
    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...updates };
    this.set(STORAGE_KEYS.COMPLIANCE, items);
    return items[idx];
  }

  // Alerts
  getAlerts(): AlertItem[] {
    return this.get<AlertItem[]>(STORAGE_KEYS.ALERTS, SEED_ALERTS);
  }

  markAlertRead(id: string): void {
    const alerts = this.getAlerts();
    const item = alerts.find((a) => a.id === id);
    if (item) {
      item.isRead = true;
      this.set(STORAGE_KEYS.ALERTS, alerts);
    }
  }

  createAlert(alert: Omit<AlertItem, 'id' | 'timestamp' | 'relativeTime' | 'isRead' | 'retryCount'>): AlertItem {
    const alerts = this.getAlerts();
    const newAlert: AlertItem = {
      ...alert,
      id: `ALT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
      isRead: false,
      retryCount: 1,
    };
    alerts.unshift(newAlert);
    this.set(STORAGE_KEYS.ALERTS, alerts);
    return newAlert;
  }

  resolveAlert(id: string): void {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx !== -1) {
      alerts[idx].status = 'Resolved';
      alerts[idx].isRead = true;
      this.set(STORAGE_KEYS.ALERTS, alerts);
    }
  }

  // Audit
  getAuditTrail(): AuditEvent[] {
    return this.get<AuditEvent[]>(STORAGE_KEYS.AUDIT, SEED_AUDIT);
  }

  addAuditEvent(event: AuditEvent): void {
    const audit = this.getAuditTrail();
    audit.unshift(event);
    this.set(STORAGE_KEYS.AUDIT, audit.slice(0, 100)); // keep last 100 events
  }

  // Reset demo
  resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.RULES);
    localStorage.removeItem(STORAGE_KEYS.COMPLIANCE);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    // Re-seed
    this.getApplications();
    this.getRules();
    this.getComplianceItems();
    this.getAlerts();
    this.getAuditTrail();
  }

  // Calculated Statistics (derived directly from store, not hardcoded)
  getCalculatedStats() {
    const apps = this.getApplications();
    const total = apps.length;

    const inProcess = apps.filter((a) => 
      a.status === 'In Review' || a.status === 'Due Soon' || a.status === 'Exception' || a.status === 'Draft'
    ).length;

    const approved = apps.filter((a) => a.status === 'Approved').length;
    const returned = apps.filter((a) => a.status === 'Deficiency').length;
    const overdue = apps.filter((a) => a.status === 'Overdue').length;

    const byStage: Record<StageName, number> = {
      'Intake & Validation': 0,
      'Rule Resolution': 0,
      'Scrutiny (EVC / SAC-SHC)': 0,
      'Compliance Monitoring': 0,
      'Final Decision': 0,
    };

    apps.forEach((a) => {
      if (byStage[a.currentStage] !== undefined) {
        byStage[a.currentStage]++;
      }
    });

    const stageData = [
      { name: 'Intake &\nValidation', stage: 'Intake & Validation', count: byStage['Intake & Validation'], fill: '#60a5fa' },
      { name: 'Rule\nResolution', stage: 'Rule Resolution', count: byStage['Rule Resolution'], fill: '#34d399' },
      { name: 'Scrutiny\n(EVC / SAC-SHC)', stage: 'Scrutiny (EVC / SAC-SHC)', count: byStage['Scrutiny (EVC / SAC-SHC)'], fill: '#a78bfa' },
      { name: 'Compliance\nMonitoring', stage: 'Compliance Monitoring', count: byStage['Compliance Monitoring'], fill: '#fbbf24' },
      { name: 'Final\nDecision', stage: 'Final Decision', count: byStage['Final Decision'], fill: '#f87171' },
    ];

    const statusData = [
      { name: 'In Process', count: inProcess, percent: Math.round((inProcess / (total || 1)) * 100), fill: '#3b82f6' },
      { name: 'Approved', count: approved, percent: Math.round((approved / (total || 1)) * 100), fill: '#10b981' },
      { name: 'Returned', count: returned, percent: Math.round((returned / (total || 1)) * 100), fill: '#f59e0b' },
      { name: 'Overdue', count: overdue, percent: Math.round((overdue / (total || 1)) * 100), fill: '#ef4444' },
    ];

    return {
      total,
      inProcess,
      inProcessPercent: Math.round((inProcess / (total || 1)) * 100),
      approved,
      approvedPercent: Math.round((approved / (total || 1)) * 100),
      returned,
      returnedPercent: Math.round((returned / (total || 1)) * 100),
      overdue,
      overduePercent: Math.round((overdue / (total || 1)) * 100),
      stageData,
      statusData,
    };
  }
}

export const dataService = new DataService();
