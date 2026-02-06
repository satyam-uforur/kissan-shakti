'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid hydration issues
const VoiceChat = dynamic(() => import('@/components/VoiceChat'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🌾</div>
                <p className="text-gray-400">Loading...</p>
            </div>
        </div>
    ),
});

export default function Home() {
    return <VoiceChat />;
}