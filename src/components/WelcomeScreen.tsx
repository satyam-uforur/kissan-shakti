'use client';

interface Props {
    onStart: () => void;
}

export default function WelcomeScreen({ onStart }: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900">
            <div className="text-center max-w-md mx-auto">
                {/* Logo */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-5xl shadow-2xl animate-bounce-slow">
                    🌾
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-2 gradient-text">किसान शक्ति</h1>
                <p className="text-gray-400 mb-8">AI Voice Assistant for Farmers</p>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: '🎤', label: 'Voice Input' },
                        { icon: '💬', label: 'Text Chat' },
                        { icon: '🔊', label: 'Audio Reply' },
                    ].map(item => (
                        <div key={item.label} className="p-3 rounded-xl glass">
                            <div className="text-2xl mb-1">{item.icon}</div>
                            <div className="text-xs text-gray-400">{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* Start Button */}
                <button
                    onClick={onStart}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                    🚀 शुरू करें
                </button>

                {/* Footer */}
                <p className="mt-6 text-xs text-gray-500">
                    Powered by Sarvam AI + Groq
                </p>
            </div>
        </div>
    );
}