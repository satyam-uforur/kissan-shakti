'use client';

import { StreamMetrics } from '@/types';

interface Props {
    metrics: StreamMetrics | null;
    llmTTFT: number | null;
    currentSentence: number;
    isProcessing: boolean;
}

export default function MetricsPanel({ metrics, llmTTFT, currentSentence, isProcessing }: Props) {
    if (!metrics && !isProcessing) return null;

    return (
        <div className="glass rounded-xl p-4 animate-fade-in">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <span>📊</span> Performance Metrics
            </h3>

            {/* Live Processing */}
            {isProcessing && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {llmTTFT && (
                        <div className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                            ⚡ TTFT: {llmTTFT}ms
                        </div>
                    )}
                    {currentSentence > 0 && (
                        <div className="px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-300 text-xs animate-pulse">
                            🔊 Playing: Sentence {currentSentence}
                        </div>
                    )}
                </div>
            )}

            {/* Final Metrics */}
            {metrics && (
                <div className="space-y-3">
                    {/* Main Stats */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                            <div className="text-2xl font-bold text-green-400">{metrics.time_to_first_audio_ms}ms</div>
                            <div className="text-xs text-gray-400">First Audio</div>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                            <div className="text-2xl font-bold text-blue-400">{metrics.e2e_latency_ms}ms</div>
                            <div className="text-xs text-gray-400">Total Time</div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-4 gap-1">
                        {[
                            { label: 'STT', value: `${metrics.stt_ms}ms`, color: 'text-sky-400' },
                            { label: 'TTFT', value: `${metrics.llm_ttft_ms}ms`, color: 'text-purple-400' },
                            { label: 'LLM', value: `${metrics.llm_total_ms}ms`, color: 'text-pink-400' },
                            { label: 'TTS', value: `${metrics.tts_avg_ms}ms`, color: 'text-orange-400' },
                        ].map(item => (
                            <div key={item.label} className="p-2 rounded-lg bg-white/5 text-center">
                                <div className={`text-sm font-semibold ${item.color}`}>{item.value}</div>
                                <div className="text-xs text-gray-500">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Extra Stats */}
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
                        <span>🔢 Tokens: {metrics.llm_tokens}</span>
                        <span>⚡ {metrics.llm_tps.toFixed(1)} tok/s</span>
                        <span>📝 {metrics.total_sentences} sentences</span>
                    </div>
                </div>
            )}
        </div>
    );
}