'use client';

import { ConnectionStatus } from '@/types';
import { X, Trash2 } from 'lucide-react';

interface SettingsPanelProps {
  connectionStatus: ConnectionStatus;
  onClearHistory: () => void;
  onClose: () => void;
}

export default function SettingsPanel({
  connectionStatus,
  onClearHistory,
  onClose,
}: SettingsPanelProps) {
  return (
    <div className="flex-1 p-5 bg-card overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground text-lg">Settings</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-secondary rounded-md transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5">
        {/* Connection Status */}
        <div className="p-4 rounded-lg border border-border bg-secondary/50">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Connection
          </h4>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-500'
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-foreground capitalize">
              {connectionStatus}
            </span>
          </div>
        </div>

       

        {/* Clear History */}
        <button
          onClick={() => {
            onClearHistory();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
        >
          <Trash2 size={16} />
          Clear Chat History
        </button>

        {/* Info */}
        <div className="p-4 rounded-lg border border-border bg-secondary/50">
          <h4 className="text-sm font-medium text-foreground mb-2">About</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kisaan Shakti is an AI Voice Assistant for Indian farmers. It
            supports voice input in Hindi and provides agricultural guidance
            with real-time audio responses.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Built by KissanAI 🌾
          </p>
        </div>
      </div>
    </div>
  );
}