import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, Sparkles, Eye, Code, Layers, Palette } from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes';
import { CandidateProfile, UploadedFileState } from '../types/agent';

interface ResumeDropzoneProps {
  uploadedFile: UploadedFileState | null;
  resumeText: string;
  onFileSelect: (fileState: UploadedFileState, textContent: string) => void;
  onTextChange: (newText: string) => void;
  onClear: () => void;
  parsedProfile: CandidateProfile | null;
  isParsingQuick: boolean;
  onSelectSample: (sample: SampleResume) => void;
  selectedSampleId: string | null;
}

export const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({
  uploadedFile,
  resumeText,
  onFileSelect,
  onTextChange,
  onClear,
  parsedProfile,
  isParsingQuick,
  onSelectSample,
  selectedSampleId,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showRawEditor, setShowRawEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isText = file.type.includes('text') || file.name.endsWith('.txt');

    if (isText) {
      const text = await file.text();
      onFileSelect(
        {
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          textPreview: text.slice(0, 400),
        },
        text
      );
    } else {
      // Binary / PDF: read as base64 for Gemini multimodal ingestion
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        onFileSelect(
          {
            name: file.name,
            size: file.size,
            type: file.type || (isPdf ? 'application/pdf' : 'application/octet-stream'),
            base64Data,
            textPreview: `Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
          },
          `[Attached Document: ${file.name}]`
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasResume = !!uploadedFile || resumeText.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-200">
          Candidate Resume <span className="text-indigo-400">*</span>
        </label>
        {hasResume && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowRawEditor(!showRawEditor)}
              className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              {showRawEditor ? 'Hide Text' : 'View / Edit Text'}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Main Upload Dropzone */}
      {!hasResume ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/20'
              : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
            <UploadCloud className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-slate-200 mb-1">
            Drop your resume here, or <span className="text-indigo-400 underline underline-offset-2">browse file</span>
          </p>
          <p className="text-xs text-slate-500">
            Supports PDF, DOCX, and TXT (Max 20MB)
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                  {uploadedFile?.name || 'Resume Document'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {uploadedFile?.size ? (
                    <>
                      <span>{formatSize(uploadedFile.size)}</span>
                      <span aria-hidden="true">·</span>
                    </>
                  ) : null}
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Analysis
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors shrink-0"
            >
              Replace
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Quick Parsed Profile Summary */}
          {isParsingQuick ? (
            <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-xs text-indigo-300">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
              Extracting candidate profile and core competencies...
            </div>
          ) : parsedProfile ? (
            <div className="pt-2.5 border-t border-slate-800/60 space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  {parsedProfile.candidateName}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  · {parsedProfile.headline}
                </span>
              </div>
              {parsedProfile.technicalSkills && parsedProfile.technicalSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {parsedProfile.technicalSkills.slice(0, 8).map((skill, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-indigo-300 bg-indigo-950/40 border border-indigo-900/40 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {parsedProfile.technicalSkills.length > 8 && (
                    <span className="text-[11px] text-slate-500 py-0.5 px-1">
                      +{parsedProfile.technicalSkills.length - 8} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Raw text preview/editor */}
      {showRawEditor && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">
            Resume Content (editable for fine-tuning)
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => onTextChange(e.target.value)}
            rows={7}
            placeholder="Paste or edit resume text here..."
            className="w-full text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
          />
        </div>
      )}

      {/* Quick-Test Sample Candidate Resumes */}
      <div className="pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Or load a pre-built candidate profile to test immediately:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_RESUMES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-0.5">
                  {sample.domain === 'Tech' && <Code className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {sample.domain === 'Product' && <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  {sample.domain === 'Design' && <Palette className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                  <span className="truncate">{sample.domain}: {sample.targetRole}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {sample.candidateName} · {sample.headline.split('·')[0]}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
