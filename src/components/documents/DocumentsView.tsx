import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  Search,
  Filter,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileCheck,
  Check,
  X,
} from 'lucide-react';
import { DocumentItem, ApplicationRecord, UserRole } from '../../types';

interface DocumentsViewProps {
  applications: ApplicationRecord[];
  currentRole: UserRole;
  onOpenApplication?: (app: ApplicationRecord) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  applications,
  currentRole,
  onOpenApplication,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [targetAppId, setTargetAppId] = useState(applications[0]?.id || '');
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<'Land & Building' | 'Faculty & Staff' | 'Financial' | 'Statutory Approvals' | 'Academic' | 'Affidavit'>('Land & Building');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Flatten all documents with their application metadata
  const allDocs: Array<DocumentItem & { appId: string; institutionName: string; appRef: ApplicationRecord }> = [];
  applications.forEach((app) => {
    app.documents.forEach((doc) => {
      allDocs.push({
        ...doc,
        appId: app.id,
        institutionName: app.institutionName,
        appRef: app,
      });
    });
  });

  const filteredDocs = allDocs.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.institutionName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStat = selectedStatus === 'all' || doc.validationStatus === selectedStatus;

    return matchesSearch && matchesCat && matchesStat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    // Simulate safe upload & mock OCR extraction
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
      setDocName('');
      setSelectedFile(null);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Documents Repository & Verification</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Centralized document vault with OCR metadata extraction and human-in-the-loop verification
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document Dossier</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 card-subtle-shadow space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search document name, App ID, institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 font-medium"
            >
              <option value="all">All Document Categories</option>
              <option value="Land & Building">Land & Building</option>
              <option value="Faculty & Staff">Faculty & Staff</option>
              <option value="Financial">Financial</option>
              <option value="Statutory Approvals">Statutory Approvals</option>
              <option value="Academic">Academic</option>
              <option value="Affidavit">Affidavit</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 font-medium"
            >
              <option value="all">All Validation Statuses</option>
              <option value="Valid">Valid (Verified)</option>
              <option value="Pending">Pending Scrutiny</option>
              <option value="Deficient">Deficient</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{filteredDocs.length}</strong> statutory documents
          </span>
          <span className="text-[11px] text-blue-600 font-semibold">
            All documents scanned against AICTE APH Chapter 1 & 2 checklists
          </span>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 card-subtle-shadow space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {doc.appId}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.validationStatus === 'Valid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : doc.validationStatus === 'Deficient'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {doc.validationStatus}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">{doc.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{doc.institutionName}</p>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{doc.category}</span>
                <span>•</span>
                <span>{doc.fileSize}</span>
                <span>•</span>
                <span>{doc.version}</span>
              </div>

              {/* Extracted Metadata Preview */}
              {doc.extractedData && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-600">Simulated OCR Extraction:</span>
                    <span className="text-emerald-700">
                      {Math.round(doc.extractedData.confidence * 100)}% Confidence
                    </span>
                  </div>
                  <div className="pt-1 text-[11px] font-mono text-slate-700 space-y-0.5">
                    {Object.entries(doc.extractedData.fields).slice(0, 2).map(([k, v]) => (
                      <div key={k} className="truncate">
                        <span className="text-slate-400">{k}:</span> {v}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doc.reviewerComments && (
                <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded border border-amber-200/80">
                  <strong>Scrutiny Memo:</strong> {doc.reviewerComments}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Uploaded {doc.uploadDate}</span>
              {onOpenApplication && (
                <button
                  onClick={() => onOpenApplication(doc.appRef)}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in Dossier</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Upload Evidence Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-lg bg-blue-800 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900">Document Uploaded Successfully</h4>
                <p className="text-xs text-slate-500">
                  OCR metadata extracted with 96% confidence. Awaiting human verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Application ID</label>
                  <select
                    value={targetAppId}
                    onChange={(e) => setTargetAppId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    {applications.slice(0, 10).map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.id} - {app.institutionName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Revised Fire Safety NOC with Geo-Coordinates"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Statutory Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Land & Building">Land & Building</option>
                    <option value="Faculty & Staff">Faculty & Staff</option>
                    <option value="Financial">Financial</option>
                    <option value="Statutory Approvals">Statutory Approvals</option>
                    <option value="Academic">Academic</option>
                    <option value="Affidavit">Affidavit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select File (PDF / Scanned Image)</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Allowed: PDF, JPG, PNG up to 25 MB</p>
                </div>

                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-blue-900">Document Security Guardrail:</p>
                  <p>
                    Uploaded files are processed securely. OCR extraction flags low-confidence readings for mandatory human inspection.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Upload & Extract
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
