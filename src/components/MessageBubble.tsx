'use client';

import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  streaming?: boolean;
  llmTTFT?: number | null;
  currentSentence?: number;
}

export default function MessageBubble({
  message,
  streaming,
  llmTTFT,
  currentSentence,
}: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div
      className={`flex gap-2 animate-fade-in-up ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* AI / System Avatar */}
      {!isUser && (
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm ${
            isSystem ? 'bg-red-500' : 'bg-primary'
          }`}
        >
          {isSystem ? '⚠️' : '🌾'}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white rounded-br-sm'
            : isSystem
            ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
            : 'bg-secondary text-foreground border-l-4 border-primary rounded-bl-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
          {streaming && (
            <span className="inline-block ml-1 w-2 h-4 bg-primary animate-pulse" />
          )}
        </p>

        {/* Streaming metrics */}
        {streaming && (llmTTFT || (currentSentence && currentSentence > 0)) && (
          <div className="flex gap-3 mt-2 text-xs">
            {llmTTFT && (
              <span className="text-purple-600">⚡ {llmTTFT}ms</span>
            )}
            {currentSentence !== undefined && currentSentence > 0 && (
              <span className="text-orange-500">
                🔊 Sentence {currentSentence}
              </span>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white text-sm">
          👤
        </div>
      )}
    </div>
  );
}