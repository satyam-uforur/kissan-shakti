'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
    onSend: (text: string) => void;
    isProcessing: boolean;
    isConnected: boolean;
}

export default function TextInput({ onSend, isProcessing, isConnected }: Props) {
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isProcessing && isConnected) {
            onSend(text);
            setText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const isDisabled = isProcessing || !isConnected;

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="अपना सवाल लिखो..."
                disabled={isDisabled}
                className={`
                    flex-1 px-4 py-3 rounded-xl
                    bg-white/5 border border-white/10
                    text-white placeholder-gray-500
                    focus:outline-none focus:border-green-500/50 focus:bg-white/10
                    transition-all
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            />
            <button
                type="submit"
                disabled={isDisabled || !text.trim()}
                className={`
                    px-5 py-3 rounded-xl
                    bg-gradient-to-r from-green-500 to-green-600
                    text-white font-medium
                    hover:from-green-600 hover:to-green-700
                    transition-all
                    ${isDisabled || !text.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                `}
            >
                भेजो
            </button>
        </form>
    );
}