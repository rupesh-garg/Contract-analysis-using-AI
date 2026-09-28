'use client';

import { useState, DragEvent, ChangeEvent } from 'react';

import AnalysisDashboard from './AnalysisDashboard';

export default function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAgreed) return; // Prevent drag interaction if not agreed
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!isAgreed) {
      setStatus('error'); // Or just a toast, but using error status for visibility
      setMessage('⚠️ Please agree to the disclaimer first.');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setStatus('error');
      setMessage("Only PDF files are allowed.");
      return;
    }

    setStatus('uploading');
    setMessage("Uploading and extracting text...");
    setAnalyzeResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      // 1. Parse the JSON response regardless of status
      const data = await response.json();

      // 2. Handle Server Errors (400, 500, etc.)
      if (!response.ok) {
        setStatus('error');
        // Use the specific message from the backend, or a fallback
        setMessage(`⚠️ ${data.detail || "Upload failed"}`);
        return; // Stop here, do not throw an error
      }

      // 3. Handle Invalid Data Format (Success 200 but bad JSON)
      if (!data.analysis || !Array.isArray(data.analysis)) {
        setStatus('error');
        setMessage("⚠️ Invalid response format from AI");
        return;
      }

      // 4. Success
      setStatus('success');
      setMessage('');
      setAnalyzeResult(data.analysis);

    } catch (error) {
      // This block only runs if the Network Request fails completely (backend is offline)
      console.error(error);
      setStatus('error');
      setMessage("Connection failed. Is the backend running?");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">

      {!analyzeResult && (
        <>
          {/* Legal Checkbox */}
          <div className="flex items-start gap-3 mb-6 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <input
              type="checkbox"
              id="legal-agree"
              checked={isAgreed}
              onChange={(e) => {
                setIsAgreed(e.target.checked);
                if (e.target.checked && message === '⚠️ Please agree to the disclaimer first.') {
                  setMessage(''); // Clear warning
                  setStatus('idle');
                }
              }}
              className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/20"
            />
            <label htmlFor="legal-agree" className="text-sm text-zinc-400 cursor-pointer select-none">
              I understand that CreatorShield uses AI for educational purposes only and is <strong className="text-white">NOT a substitute for a qualified attorney</strong>. I agree to the <span className="underline hover:text-white">Terms of Service</span>.
            </label>
          </div>

          <div
            className={`relative group flex flex-col items-center justify-center w-full h-64 rounded-xl transition-all duration-300 ease-in-out
                ${!isAgreed ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
                ${dragActive
                ? 'border-2 border-white bg-zinc-900 shadow-2xl'
                : 'border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl hover:border-zinc-600 hover:bg-zinc-900/80'}
                ${status === 'error' ? 'border-destructive/50 bg-destructive/5' : ''}
                `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleChange}
              disabled={!isAgreed}
            />

            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center cursor-pointer pointer-events-none transition-transform duration-300 group-hover:-translate-y-1">
              {status === 'uploading' ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <div className="text-zinc-400 text-sm tracking-widest uppercase font-medium">Analyzing Contract...</div>
                </div>
              ) : (
                <>
                  <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${status === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-white/5 text-white group-hover:bg-white/10'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-zinc-300 font-medium">Upload Contract PDF</p>
                  <p className="text-xs text-zinc-500">Drag and drop or click to browse</p>
                </>
              )}
            </div>
            <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer" />
          </div>

          {message && (
            <div className={`p-3 rounded-lg border text-sm flex items-center justify-center gap-2 ${status === 'success' ? 'border-zinc-800 bg-zinc-900/50 text-white' :
              status === 'error' ? 'border-destructive/20 bg-destructive/10 text-destructive' :
                'border-zinc-800 text-zinc-400'
              }`}>
              {status === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              {status === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-destructive" />}
              {message}
            </div>
          )}

          {/* Privacy Badge */}
          <div className="flex items-center justify-center gap-2 text-emerald-500/80 bg-emerald-500/5 border border-emerald-500/10 rounded-full px-4 py-2 w-max mx-auto mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
            <span className="text-[10px] uppercase tracking-widest font-bold">Zero-Data Retention</span>
          </div>
          <p className="text-xs text-zinc-500 text-center max-w-sm mx-auto">
            Your PDF is analyzed in RAM and permanently deleted from our servers immediately after processing.
          </p>

          {/* Footer Disclaimer */}
          <div className="pt-12 text-center">
            <p className="text-[10px] text-zinc-600">
              This tool is powered by Gemini 1.5 Pro. AI can make mistakes. Always verify important clauses with a professional.
            </p>
          </div>
        </>
      )}

      {analyzeResult && (
        <AnalysisDashboard
          analysis={analyzeResult}
          onReset={() => {
            setAnalyzeResult(null);
            setStatus('idle');
            setMessage('');
          }}
        />
      )}
    </div>
  );
}
