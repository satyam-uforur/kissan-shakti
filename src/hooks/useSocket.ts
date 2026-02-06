'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, StatusUpdate, ConnectionStatus, StreamMetrics, AudioChunk } from '@/types';

const BACKEND_URL = 'https://thesatyam12-kisaan-shakti-api.hf.space';

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);
    const audioQueueRef = useRef<AudioChunk[]>([]);
    const isPlayingRef = useRef(false);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<StatusUpdate>({ step: 'complete', text: 'Ready' });
    const [metrics, setMetrics] = useState<StreamMetrics | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [llmTTFT, setLlmTTFT] = useState<number | null>(null);
    const [currentSentence, setCurrentSentence] = useState<number>(0);

    const generateId = useCallback(() => {
        return `msg-${Math.random().toString(36).substring(2, 11)}`;
    }, []);

    const playNextInQueue = useCallback(async () => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0) return;

        isPlayingRef.current = true;
        const chunk = audioQueueRef.current.shift()!;
        setCurrentSentence(chunk.sentenceNumber);

        try {
            const audio = new Audio(`data:audio/wav;base64,${chunk.audio}`);
            currentAudioRef.current = audio;

            audio.onended = () => {
                isPlayingRef.current = false;
                currentAudioRef.current = null;
                playNextInQueue();
            };

            audio.onerror = () => {
                isPlayingRef.current = false;
                currentAudioRef.current = null;
                playNextInQueue();
            };

            await audio.play();
        } catch (error) {
            console.error('Audio error:', error);
            isPlayingRef.current = false;
            playNextInQueue();
        }
    }, []);

    const addToAudioQueue = useCallback((chunk: AudioChunk) => {
        if (chunk.audio && chunk.audio.length > 0) {
            audioQueueRef.current.push(chunk);
            playNextInQueue();
        }
    }, [playNextInQueue]);

    const stopAudio = useCallback(() => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }
        audioQueueRef.current = [];
        isPlayingRef.current = false;
        setCurrentSentence(0);
    }, []);

    useEffect(() => {
        socketRef.current = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
        });

        const socket = socketRef.current;

        socket.on('connect', () => setConnectionStatus('connected'));
        socket.on('disconnect', () => setConnectionStatus('disconnected'));
        socket.on('connect_error', () => setConnectionStatus('disconnected'));

        socket.on('welcome', (data: { message: string }) => {
            setMessages([{
                id: generateId(),
                type: 'ai',
                text: data.message,
                timestamp: Date.now()
            }]);
        });

        socket.on('status', (data: StatusUpdate) => {
            setStatus(data);
            setIsProcessing(data.step !== 'complete');
            if (data.step === 'complete') setCurrentSentence(0);
        });

        socket.on('user_text', (data: { text: string }) => {
            setStreamingText('');
            setLlmTTFT(null);
            setCurrentSentence(0);
            stopAudio();
            setMessages(prev => [...prev, {
                id: generateId(),
                type: 'user',
                text: data.text,
                timestamp: Date.now()
            }]);
        });

        socket.on('ai_text_chunk', (data: { chunk: string }) => {
            setStreamingText(prev => prev + data.chunk + ' ');
        });

        socket.on('llm_ttft', (data: { ttft_ms: number }) => {
            setLlmTTFT(data.ttft_ms);
        });

        socket.on('ai_voice_chunk', (data: { audio: string; sentence_number: number; sentence_text: string }) => {
            if (data.audio) {
                addToAudioQueue({
                    audio: data.audio,
                    sentenceNumber: data.sentence_number,
                    text: data.sentence_text
                });
            }
        });

        socket.on('stream_complete', (data: { full_text: string }) => {
            setMessages(prev => [...prev, {
                id: generateId(),
                type: 'ai',
                text: data.full_text,
                timestamp: Date.now()
            }]);
            setStreamingText('');
        });

        socket.on('metrics_report', (data: StreamMetrics) => setMetrics(data));

        socket.on('error', (data: { message: string }) => {
            setMessages(prev => [...prev, {
                id: generateId(),
                type: 'system',
                text: data.message,
                timestamp: Date.now()
            }]);
            setIsProcessing(false);
            setStreamingText('');
            stopAudio();
        });

        return () => {
            socket.disconnect();
            stopAudio();
        };
    }, [generateId, addToAudioQueue, stopAudio]);

    const sendVoiceMessage = useCallback((audioBase64: string) => {
        if (socketRef.current?.connected) {
            setIsProcessing(true);
            setStreamingText('');
            setMetrics(null);
            setLlmTTFT(null);
            stopAudio();
            socketRef.current.emit('voice_message', { audioBase64 });
        }
    }, [stopAudio]);

    const sendTextMessage = useCallback((text: string) => {
        if (socketRef.current?.connected && text.trim()) {
            setIsProcessing(true);
            setStreamingText('');
            setMetrics(null);
            setLlmTTFT(null);
            stopAudio();
            setMessages(prev => [...prev, {
                id: generateId(),
                type: 'user',
                text: text.trim(),
                timestamp: Date.now()
            }]);
            socketRef.current.emit('text_message', { text: text.trim() });
        }
    }, [stopAudio, generateId]);

    const clearHistory = useCallback(() => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('clear_history');
            setMessages([]);
            setMetrics(null);
            stopAudio();
        }
    }, [stopAudio]);

    return {
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
    };
}