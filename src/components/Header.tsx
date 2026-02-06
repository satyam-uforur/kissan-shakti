'use client';

import { ConnectionStatus } from '@/types';

interface Props {
    connectionStatus: ConnectionStatus;
    onClear: () => void;
}

export default function Header({ connectionStatus, onClear }: Props) {
    const statusConfig = {
        connected: { color: 'bg-green-500', text: 'Connected', icon: '🟢' },
        connecting: { color: 'bg-yellow-500', text: 'Connecting...', icon: '🟡' },
        disconnected: { color: 'bg-red-500', text: 'Disconnected', icon: '🔴' }
    };

    const status = statusConfig[connectionStatus];

    return (
        <header className="sticky top-0 z-50 glass border-b border-white/10">
            <div className="max-w-4xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl shadow-lg">
                            🌾
                        </div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text">किसान शक्ति</h1>
                            <p className="text-xs text-gray-400">by KissanAI</p>
                        </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3">
                        {/* Connection Status */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
                            <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                            <span className="text-gray-300 hidden sm:inline">{status.text}</span>
                        </div>

                        {/* Clear Button */}
                        <button
                            onClick={onClear}
                            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                            title="Clear Chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}