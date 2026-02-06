'use client';

import { StatusUpdate, ConnectionStatus } from '@/types';

interface Props {
    connectionStatus: ConnectionStatus;
    status: StatusUpdate;
}

export default function StatusBar({ connectionStatus, status }: Props) {
    const badge = {
        connected: <span className="text-green-400">🟢 Connected</span>,
        connecting: <span className="text-yellow-400">🟡 Connecting...</span>,
        disconnected: <span className="text-red-400">🔴 Disconnected</span>
    };

    return (
        <div className="text-center text-sm">
            {badge[connectionStatus]}
        </div>
    );
}