'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';

interface VoiceInputProps {
  isProcessing: boolean;
  onVoiceSend: (audioBase64: string) => void;
}

export default function VoiceInput({
  isProcessing,
  onVoiceSend,
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(
        () => setRecordingTime((prev) => prev + 1),
        1000
      );
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      chunksRef.current = [];
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          onVoiceSend(base64);
        };
        stream.getTracks().forEach((track) => track.stop());
        setRecordingTime(0);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch {
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

  const handleClick = () => {
    if (isProcessing) return;
    if (isRecording) stopRecording();
    else startRecording();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 animate-recording-pulse scale-110'
            : 'bg-gradient-to-br from-green-500 to-green-600 hover:scale-105 shadow-lg'
        } ${isProcessing && !isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRecording ? (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs">🔴</span>
            <span className="text-[10px]">{formatTime(recordingTime)}</span>
          </div>
        ) : isProcessing ? (
          <div className="animate-spin text-xl">⏳</div>
        ) : (
          <Mic size={24} />
        )}
      </button>
      <p className="text-xs text-muted-foreground">
        {isRecording
          ? 'Tap to stop'
          : isProcessing
          ? 'Processing...'
          : 'Tap to speak'}
      </p>
    </div>
  );
}