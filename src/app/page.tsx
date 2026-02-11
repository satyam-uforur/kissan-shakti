'use client';

import dynamic from 'next/dynamic';

const ChatIcon = dynamic(() => import('@/components/ChatIcon'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Kisaan Shakti
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            आपके खेत के लिए AI सहायक
          </p>
          <p className="text-muted-foreground">
            Voice-powered agricultural guidance in Hindi and local languages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-3">🎤</div>
            <h3 className="font-semibold text-foreground mb-2">Voice Input</h3>
            <p className="text-sm text-muted-foreground">
              Ask questions in your native language
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-3">🌾</div>
            <h3 className="font-semibold text-foreground mb-2">
              Farm Guidance
            </h3>
            <p className="text-sm text-muted-foreground">
              Expert advice for crop cultivation
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-3">🔊</div>
            <h3 className="font-semibold text-foreground mb-2">
              Audio Responses
            </h3>
            <p className="text-sm text-muted-foreground">
              Get answers you can hear clearly
            </p>
          </div>
        </div>

        <div className="bg-card border border-primary/30 rounded-lg p-8">
          <p className="text-muted-foreground mb-4">
            Click the green chat icon in the bottom-right corner to get started!
          </p>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl shadow-lg mx-auto animate-float">
            🌾
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatIcon />
    </main>
  );
}