'use client';

import { useState, useRef, useCallback } from 'react';

interface Props {
    onRecordingComplete: (audioBase64: string) => void;
    isProcessing: boolean;
    isConnected: boolean;
}

export default function MicButton({ onRecordingComplete, isProcessing, isConnected }: Props) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000
                }
            });

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            audioChunksRef.current = [];
            setRecordingTime(0);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    onRecordingComplete(base64);
                };
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            // Timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Mic error:', error);
            alert('Microphone access denied!');
        }
    }, [onRecordingComplete]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    const handleClick = () => {
        if (isProcessing || !isConnected) return;
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isDisabled = isProcessing || !isConnected;

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Recording Time */}
            {isRecording && (
                <div className="text-red-400 text-sm font-mono animate-pulse">
                    🔴 {formatTime(recordingTime)}
                </div>
            )}

            {/* Button */}
            <button
                onClick={handleClick}
                disabled={isDisabled}
                className={`
                    relative w-16 h-16 rounded-full
                    flex items-center justify-center
                    transition-all duration-300 transform
                    ${isRecording 
                        ? 'bg-red-500 scale-110' 
                        : 'bg-gradient-to-br from-green-400 to-green-600 hover:scale-105'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed scale-100' : 'cursor-pointer shadow-lg hover:shadow-xl'}
                `}
            >
                {/* Pulse Ring */}
                {isRecording && (
                    <span className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring" />
                )}

                {/* Icon */}
                <span className="relative z-10 text-2xl">
                    {isProcessing ? '⏳' : isRecording ? '⏹️' : '🎤'}
                </span>
            </button>

            {/* Hint */}
            <p className="text-xs text-gray-400">
                {isProcessing ? 'Processing...' : isRecording ? 'Tap to stop' : 'Tap to speak'}
            </p>
        </div>
    );
}