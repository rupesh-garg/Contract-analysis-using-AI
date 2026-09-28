'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisItem {
    clause: string;
    risk_level: 'High' | 'Medium' | 'Low';
    translation: string;
    counter_offer?: string;
}

interface DashboardProps {
    analysis: AnalysisItem[];
    onReset: () => void;
}

export default function AnalysisDashboard({ analysis, onReset }: DashboardProps) {
    if (!analysis || !Array.isArray(analysis)) {
        console.error("AnalysisDashboard received invalid data:", analysis);
        return null;
    }

    const [filter, setFilter] = useState<'All' | 'High' | 'Medium'>('All');
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
    const [isPremium, setIsPremium] = useState(false);

    // Calculate Safety Score
    const score = useMemo(() => {
        let baseScore = 100;
        analysis.forEach(item => {
            if (item.risk_level === 'High') baseScore -= 20;
            if (item.risk_level === 'Medium') baseScore -= 10;
        });
        return Math.max(0, baseScore);
    }, [analysis]);

    const scoreColor = score < 50 ? 'text-red-500' : score < 80 ? 'text-yellow-500' : 'text-emerald-500';
    const scoreLabel = score < 50 ? 'DO NOT SIGN' : score < 80 ? 'CAUTION' : 'SAFE TO SIGN';

    // Circular Progress Calculation
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const filteredAnalysis = analysis.filter(item => filter === 'All' || item.risk_level === filter);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 50, damping: 15 } as any
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl mx-auto pb-24"
        >

            {/* 1. Header & Score */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 border-b border-zinc-900 pb-12">

                {/* Score Circle (Thin Ring) */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            className="text-zinc-900"
                        />
                        <motion.circle
                            cx="96"
                            cy="96"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`${scoreColor} ${score < 50 ? 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className={`text-6xl font-thin tracking-tighter ${scoreColor}`}
                        >
                            {score}
                        </motion.span>
                        <span className="text-xs uppercase tracking-widest text-zinc-600 mt-2 font-medium">Safety Score</span>
                    </div>
                </div>

                {/* Text Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 text-center md:text-left space-y-6"
                >
                    <div>
                        <h2 className={`text-5xl font-bold tracking-tight ${scoreColor} mb-2`}>{scoreLabel}</h2>
                        <p className="text-zinc-400 text-lg max-w-md">
                            We found <span className="text-white font-medium">{analysis.filter(i => i.risk_level === 'High').length} High Risks</span> that require immediate attention.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                        <button
                            onClick={() => setIsPremium(true)}
                            className={`px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] ${isPremium ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-white hover:bg-zinc-200 text-black'}`}
                        >
                            {isPremium ? 'Premium Unlocked' : 'Unlock Full Report'}
                        </button>
                        <button onClick={onReset} className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg text-sm font-medium transition-colors border border-zinc-800">
                            Upload New
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* 2. Risk Cards Feed */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                <div className="flex items-center justify-between pb-4">
                    <h3 className="text-lg font-medium text-white tracking-tight">Detected Issues</h3>
                    <div className="flex gap-2">
                        {['All', 'High'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-colors border ${filter === f
                                    ? 'bg-zinc-100 text-black border-zinc-100'
                                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredAnalysis.map((item, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        className="group relative rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:border-zinc-700"
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-4">
                                <h4 className="font-bold text-white text-lg leading-tight">{item.translation}</h4>
                                <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${item.risk_level === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {item.risk_level}
                                </span>
                            </div>

                            {/* Content Area - Conditional Rendering based on isPremium */}
                            <div className="relative mt-2">
                                <p className={`text-sm text-zinc-500 italic font-serif leading-relaxed ${!isPremium ? 'blur-sm select-none opacity-50' : 'opacity-100'}`}>
                                    "{item.clause}"
                                </p>

                                {!isPremium && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                                            Premium Feature
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Footer with Action Button - Only visible when Premium */}
                            {isPremium && (
                                <div className="flex justify-end mt-4 pt-4 border-t border-zinc-800">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedOffer(item.counter_offer || "AI is generating a counter-offer for this clause. (If this persists, try re-analyzing the contract).");
                                        }}
                                        className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border border-white/20 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors z-10 relative"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                                        Fix This Clause
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Upsell / Gradient Fade at bottom */}
                <div className="sticky bottom-0 w-full h-32 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none flex items-end justify-center pb-8">
                    <span className="text-zinc-500 text-xs tracking-widest uppercase">Scroll for more</span>
                </div>
            </motion.div>

            {/* Permanent Footer Disclaimer */}
            <div className="text-xs text-zinc-500 text-center mt-12 pb-8 opacity-70">
                Disclaimer: This tool is powered by AI (Gemini 1.5 Pro) and can make mistakes. This analysis is for educational purposes only and is not legal advice. Always verify important clauses with a qualified attorney.
            </div>

            {/* Counter Offer Modal */}
            <AnimatePresence>
                {selectedOffer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedOffer(null)}
                                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>

                            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Counter-Offer Draft</h3>
                                    <p className="text-xs text-zinc-500">Generated by AI Legal Assistant</p>
                                </div>
                            </div>

                            <div className="text-sm text-zinc-400 mb-4 flex-shrink-0">
                                Copy this text and paste it into your email to the client to negotiate this clause safely.
                            </div>

                            <div className="text-xs font-bold text-amber-500 mb-2 uppercase tracking-wide">
                                ⚠️ DRAFT ONLY - Review carefully before sending
                            </div>

                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-zinc-300 font-mono text-sm leading-relaxed mb-6 whitespace-pre-wrap overflow-y-auto flex-1">
                                {selectedOffer}
                            </div>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedOffer);
                                    setSelectedOffer(null);
                                }}
                                className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                Copy to Clipboard
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
