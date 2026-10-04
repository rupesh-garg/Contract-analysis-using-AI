"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import AnalysisDashboard from "./AnalysisDashboard";

interface AnalysisItem {
  clause: string;
  risk_level: "High" | "Medium" | "Low";
  translation: string;
  counter_offer?: string;
}

export default function FileUpload() {
  const [dragActive, setDragActive] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  const [analyzeResult, setAnalyzeResult] = useState<AnalysisItem[] | null>(
    null
  );

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setStatus("error");
      setMessage("Only PDF files are supported.");
      return;
    }

    setStatus("uploading");
    setMessage("");
    setAnalyzeResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.detail || "Unable to analyze the contract.");
        return;
      }

      if (!data.analysis || !Array.isArray(data.analysis)) {
        setStatus("error");
        setMessage("The AI returned an invalid response.");
        return;
      }

      setStatus("success");
      setAnalyzeResult(data.analysis);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Could not connect to the backend.");
    }
  };

  if (analyzeResult) {
    return (
      <AnalysisDashboard
        analysis={analyzeResult}
        onReset={() => {
          setAnalyzeResult(null);
          setStatus("idle");
          setMessage("");
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl">

      {/* Upload Area */}
      <div
        className={`
          relative flex min-h-64 flex-col items-center justify-center
          rounded-lg border border-dashed p-8 text-center
          transition-colors
          ${
            dragActive
              ? "cursor-pointer border-zinc-400 bg-zinc-900"
              : "cursor-pointer border-zinc-700 bg-zinc-900/30 hover:border-zinc-500 hover:bg-zinc-900/60"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={status === "uploading"}
          onChange={handleChange}
        />

        <label
          htmlFor="file-upload"
          className="flex cursor-pointer flex-col items-center"
        >
          {status === "uploading" ? (
            <>
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

              <p className="text-sm font-medium text-white">
                Analyzing contract...
              </p>

              <p className="mt-2 text-xs text-zinc-500">
                Extracting clauses and checking for risks
              </p>
            </>
          ) : (
            <>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300">
                ↑
              </div>

              <p className="text-sm font-medium text-zinc-200">
                Choose a contract PDF
              </p>

              <p className="mt-2 text-xs text-zinc-500">
                or drag and drop it here
              </p>
            </>
          )}
        </label>
      </div>

      {/* Error Message */}
      {message && (
        <div className="mt-3 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs text-red-400">
          {message}
        </div>
      )}

      {/* Small Info */}
      <div className="mt-4 flex justify-between text-[11px] text-zinc-600">
        <span>PDF only</span>
        <span>Processed locally</span>
      </div>

    </div>
  );
}