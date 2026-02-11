'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MetricsPanel from './MetricsPanel';
import VoiceInput from './VoiceInput';
import TextInput from './TextInput';
import SettingsPanel from './SettingsPanel';
import { useSocket } from '@/hooks/useSocket';
import { Square } from 'lucide-react';

interface ChatWidgetProps {
  onClose: () => void;
}

type CornerPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'free';

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const {
    connectionStatus,
    messages,
    status,
    metrics,
    isProcessing,
    streamingText,
    llmTTFT,
    currentSentence,
    sendVoiceMessage,
    sendTextMessage,
    clearHistory,
    stopAudio,
  } = useSocket();

  const [isMinimized, setIsMinimized] = useState(false);
  const [cornerPosition, setCornerPosition] =
    useState<CornerPosition>('bottom-right');
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const WIDTH = 400;
  const HEIGHT = 620;

  // Calculate corner positions
  const getCornerPosition = useCallback(
    (corner: CornerPosition) => {
      const padding = 16;
      const w = typeof window !== 'undefined' ? window.innerWidth : 800;
      const h = typeof window !== 'undefined' ? window.innerHeight : 600;

      switch (corner) {
        case 'bottom-right':
          return { x: w - WIDTH - padding, y: h - HEIGHT - padding };
        case 'bottom-left':
          return { x: padding, y: h - HEIGHT - padding };
        case 'top-right':
          return { x: w - WIDTH - padding, y: padding };
        case 'top-left':
          return { x: padding, y: padding };
        default:
          return position;
      }
    },
    [position]
  );

  // Initialize position
  useEffect(() => {
    setPosition(getCornerPosition('bottom-right'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync ref
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Drag handling
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        headerRef.current?.contains(e.target as Node) &&
        cornerPosition === 'free'
      ) {
        setIsDragging(true);
        dragOffsetRef.current = {
          x: e.clientX - positionRef.current.x,
          y: e.clientY - positionRef.current.y,
        };
        e.preventDefault();
      }
    },
    [cornerPosition]
  );

  useEffect(() => {
    if (!isDragging || cornerPosition !== 'free') return;

    let raf: number;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(
        0,
        Math.min(e.clientX - dragOffsetRef.current.x, window.innerWidth - WIDTH)
      );
      const newY = Math.max(
        0,
        Math.min(
          e.clientY - dragOffsetRef.current.y,
          window.innerHeight - HEIGHT
        )
      );

      if (
        newX !== positionRef.current.x ||
        newY !== positionRef.current.y
      ) {
        positionRef.current = { x: newX, y: newY };
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setPosition({ x: newX, y: newY }));
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(raf);
    };
  }, [isDragging, cornerPosition]);

  const toggleCornerPosition = () => {
    const corners: CornerPosition[] = [
      'bottom-right',
      'bottom-left',
      'top-right',
      'top-left',
      'free',
    ];
    const idx = corners.indexOf(cornerPosition);
    const next = corners[(idx + 1) % corners.length];
    setCornerPosition(next);
    if (next !== 'free') {
      setPosition(getCornerPosition(next));
    }
  };

  const currentPosition =
    cornerPosition !== 'free' ? getCornerPosition(cornerPosition) : position;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 rounded-lg shadow-2xl overflow-hidden bg-card border border-border flex flex-col"
      style={{
        width: `${WIDTH}px`,
        height: isMinimized ? 'auto' : `${HEIGHT}px`,
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <ChatHeader
        ref={headerRef}
        connectionStatus={connectionStatus}
        cornerPosition={cornerPosition}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onToggleCorner={toggleCornerPosition}
        onSettings={() => setShowSettings(!showSettings)}
        onClose={onClose}
      />

      {!isMinimized && (
        <>
          {showSettings ? (
            <SettingsPanel
              connectionStatus={connectionStatus}
              onClearHistory={clearHistory}
              onClose={() => setShowSettings(false)}
            />
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* Streaming bubble */}
                {streamingText && (
                  <MessageBubble
                    message={{
                      id: 'streaming',
                      type: 'ai',
                      text: streamingText,
                      timestamp: Date.now(),
                    }}
                    streaming={true}
                    llmTTFT={llmTTFT}
                    currentSentence={currentSentence}
                  />
                )}

                {/* Typing indicator */}
                {isProcessing &&
                  !streamingText &&
                  status.step !== 'complete' && (
                    <TypingIndicator text={status.text} />
                  )}

                <div ref={messagesEndRef} />
              </div>

              {/* Metrics */}
              {metrics && <MetricsPanel metrics={metrics} />}

              {/* Input Area */}
              <div className="border-t border-border p-4 bg-card/50 backdrop-blur">
                <VoiceInput
                  isProcessing={isProcessing}
                  onVoiceSend={sendVoiceMessage}
                />

                {/* Stop button when processing */}
                {isProcessing && (
                  <div className="flex justify-center my-2">
                    <button
                      onClick={stopAudio}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-xs font-medium"
                    >
                      <Square size={12} />
                      Stop Audio
                    </button>
                  </div>
                )}

                <div className="my-3 flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                    or type below
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <TextInput
                  onTextSend={sendTextMessage}
                  isProcessing={isProcessing}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}