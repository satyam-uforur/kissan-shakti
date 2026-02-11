'use client';

import { StreamMetrics } from '@/types';

interface MetricsPanelProps {
  metrics: StreamMetrics;
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="px-4 py-3 border-t border-border bg-card/80 animate-fade-in-up">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded-lg bg-green-50">
          <div className="text-sm font-bold text-green-700">
            {metrics.time_to_first_audio_ms}ms
          </div>
          <div className="text-[10px] text-muted-foreground">First Audio</div>
        </div>
        <div className="p-2 rounded-lg bg-blue-50">
          <div className="text-sm font-bold text-blue-700">
            {metrics.e2e_latency_ms}ms
          </div>
          <div className="text-[10px] text-muted-foreground">E2E</div>
        </div>
        <div className="p-2 rounded-lg bg-purple-50">
          <div className="text-sm font-bold text-purple-700">
            {metrics.llm_ttft_ms}ms
          </div>
          <div className="text-[10px] text-muted-foreground">TTFT</div>
        </div>
        <div className="p-2 rounded-lg bg-orange-50">
          <div className="text-sm font-bold text-orange-700">
            {metrics.llm_tps.toFixed(0)}
          </div>
          <div className="text-[10px] text-muted-foreground">tok/s</div>
        </div>
      </div>
    </div>
  );
}