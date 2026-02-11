export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  text: string;
  timestamp: number;
}

export interface StatusUpdate {
  step: 'listening' | 'thinking' | 'speaking' | 'complete';
  text: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface StreamMetrics {
  e2e_latency_ms: number;
  time_to_first_audio_ms: number;
  stt_ms: number;
  llm_ttft_ms: number;
  llm_total_ms: number;
  llm_tokens: number;
  llm_tps: number;
  tts_avg_ms: number;
  total_sentences: number;
}

export interface AudioChunk {
  audio: string;
  sentenceNumber: number;
  text: string;
}