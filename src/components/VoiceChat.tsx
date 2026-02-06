'use client';

import { useRef, useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

export default function VoiceChat() {
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
        stopAudio
    } = useSocket();

    const [started, setStarted] = useState(false);
    const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
    const [textInput, setTextInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto scroll
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, streamingText]);

    // Recording functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true }
            });

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            audioChunksRef.current = [];
            setRecordingTime(0);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    sendVoiceMessage(base64);
                };
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } catch (error) {
            alert('Microphone access denied!');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const handleMicClick = () => {
        if (isProcessing) return;
        if (isRecording) stopRecording();
        else startRecording();
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput.trim() && !isProcessing) {
            sendTextMessage(textInput);
            setTextInput('');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Welcome Screen
    if (!started) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-5xl shadow-2xl animate-bounce-slow">
                        🌾
                    </div>
                    <h1 className="text-4xl font-bold mb-2 text-green-400">किसान शक्ति</h1>
                    <p className="text-gray-400 mb-8">AI Voice Assistant for Farmers</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { icon: '🎤', label: 'Voice' },
                            { icon: '💬', label: 'Text' },
                            { icon: '🔊', label: 'Audio' },
                        ].map(item => (
                            <div key={item.label} className="p-3 rounded-xl glass">
                                <div className="text-2xl mb-1">{item.icon}</div>
                                <div className="text-xs text-gray-400">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setStarted(true)}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                    >
                        🚀 शुरू करें
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl">
                            🌾
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-green-400">किसान शक्ति</h1>
                            <p className="text-xs text-gray-400">by KissanAI</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
                            <span className={`w-2 h-2 rounded-full ${
                                connectionStatus === 'connected' ? 'bg-green-500' :
                                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            <span className="text-gray-300">{connectionStatus}</span>
                        </div>
                        <button onClick={clearHistory} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
                            🗑️
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
                <div ref={chatBoxRef} className="flex-1 overflow-y-auto mb-4 space-y-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`flex items-end gap-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                                    msg.type === 'user' ? 'bg-blue-500/20 text-blue-400' :
                                    msg.type === 'system' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                    {msg.type === 'user' ? '👤' : msg.type === 'system' ? '⚠️' : '🌾'}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl ${
                                    msg.type === 'user' ? 'bg-blue-600 text-white rounded-br-sm' :
                                    msg.type === 'system' ? 'bg-red-500/20 text-red-300' : 'glass text-gray-100 rounded-bl-sm'
                                }`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Streaming */}
                    {streamingText && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="flex items-end gap-2 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm">🌾</div>
                                <div className="px-4 py-3 rounded-2xl rounded-bl-sm glass">
                                    <p className="text-sm text-gray-100">{streamingText}<span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse"></span></p>
                                    <div className="flex gap-2 mt-2 text-xs">
                                        {llmTTFT && <span className="text-purple-400">⚡ {llmTTFT}ms</span>}
                                        {currentSentence > 0 && <span className="text-orange-400">🔊 {currentSentence}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Processing */}
                    {isProcessing && !streamingText && status.step !== 'complete' && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm animate-bounce-slow">🌾</div>
                                <div className="px-4 py-3 rounded-2xl rounded-bl-sm glass">
                                    <p className="text-sm text-gray-400">{status.text}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Metrics */}
                {metrics && (
                    <div className="glass rounded-xl p-4 mb-4 animate-fade-in">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <div className="text-lg font-bold text-green-400">{metrics.time_to_first_audio_ms}ms</div>
                                <div className="text-xs text-gray-400">First Audio</div>
                            </div>
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <div className="text-lg font-bold text-blue-400">{metrics.e2e_latency_ms}ms</div>
                                <div className="text-xs text-gray-400">Total</div>
                            </div>
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <div className="text-lg font-bold text-purple-400">{metrics.llm_ttft_ms}ms</div>
                                <div className="text-xs text-gray-400">TTFT</div>
                            </div>
                            <div className="p-2 rounded-lg bg-orange-500/10">
                                <div className="text-lg font-bold text-orange-400">{metrics.llm_tps.toFixed(0)}</div>
                                <div className="text-xs text-gray-400">tok/s</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="glass rounded-2xl p-4">
                    {/* Mode Toggle */}
                    <div className="flex justify-center gap-2 mb-4">
                        <button
                            onClick={() => setInputMode('voice')}
                            className={`px-4 py-2 rounded-lg text-sm transition ${
                                inputMode === 'voice' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-gray-400 hover:bg-white/5'
                            }`}
                        >
                            🎤 Voice
                        </button>
                        <button
                            onClick={() => setInputMode('text')}
                            className={`px-4 py-2 rounded-lg text-sm transition ${
                                inputMode === 'text' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-gray-400 hover:bg-white/5'
                            }`}
                        >
                            ⌨️ Text
                        </button>
                        {isProcessing && (
                            <button onClick={stopAudio} className="px-4 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/50">
                                ⏹️ Stop
                            </button>
                        )}
                    </div>

                    {/* Voice Input */}
                    {inputMode === 'voice' && (
                        <div className="flex flex-col items-center gap-2">
                            {isRecording && <div className="text-red-400 text-sm animate-pulse">🔴 {formatTime(recordingTime)}</div>}
                            <button
                                onClick={handleMicClick}
                                disabled={isProcessing || connectionStatus !== 'connected'}
                                className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                                    isRecording ? 'bg-red-500 scale-110' : 'bg-gradient-to-br from-green-400 to-green-600 hover:scale-105'
                                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'shadow-lg'}`}
                            >
                                {isRecording && <span className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring" />}
                                <span className="relative z-10">{isProcessing ? '⏳' : isRecording ? '⏹️' : '🎤'}</span>
                            </button>
                            <p className="text-xs text-gray-400">{isProcessing ? 'Processing...' : isRecording ? 'Tap to stop' : 'Tap to speak'}</p>
                        </div>
                    )}

                    {/* Text Input */}
                    {inputMode === 'text' && (
                        <form onSubmit={handleTextSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="अपना सवाल लिखो..."
                                disabled={isProcessing}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                            />
                            <button
                                type="submit"
                                disabled={isProcessing || !textInput.trim()}
                                className="px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium disabled:opacity-50"
                            >
                                भेजो
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}