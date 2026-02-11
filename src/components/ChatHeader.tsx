'use client';

import { forwardRef } from 'react';
import { X, Minus, Settings } from 'lucide-react';
import { ConnectionStatus } from '@/types';

type CornerPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'free';

interface ChatHeaderProps {
  connectionStatus: ConnectionStatus;
  cornerPosition: CornerPosition;
  onMinimize: () => void;
  onToggleCorner: () => void;
  onSettings: () => void;
  onClose: () => void;
}

const ChatHeader = forwardRef<HTMLDivElement, ChatHeaderProps>(
  (
    {
      connectionStatus,
      cornerPosition,
      onMinimize,
      onToggleCorner,
      onSettings,
      onClose,
    },
    ref
  ) => {
    const getCornerLabel = () => {
      const labels: Record<CornerPosition, string> = {
        'bottom-right': 'BR',
        'bottom-left': 'BL',
        'top-right': 'TR',
        'top-left': 'TL',
        free: 'Free',
      };
      return labels[cornerPosition];
    };

    return (
      <div
        ref={ref}
        className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 flex items-center justify-between cursor-move select-none rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <h2 className="text-white font-semibold">Kisaan Shakti</h2>
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-white animate-pulse'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-300 animate-pulse'
                : 'bg-red-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors text-white"
            title="Minimize"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCorner();
            }}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors text-white text-xs font-bold"
            title={`Position: ${getCornerLabel()}`}
          >
            {getCornerLabel()}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSettings();
            }}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors text-white"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors text-white"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }
);

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;