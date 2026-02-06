'use client';

import { Message } from '@/types';

interface Props {
    message: Message;
}

export default function ChatMessage({ message }: Props) {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('hi-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isSystem) {
        return (
            <div className="flex justify-center my-3 animate-fade-in">
                <div className="px-4 py-2 rounded-full bg-red-500/20 text-red-300 text-sm">
                    ⚠️ {message.text}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
                    ${isUser 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-green-500/20 text-green-400'
                    }
                `}>
                    {isUser ? '👤' : '🌾'}
                </div>

                {/* Message Bubble */}
                <div className={`
                    px-4 py-3 rounded-2xl
                    ${isUser 
                        ? 'bg-blue-600 text-white rounded-br-md' 
                        : 'glass text-gray-100 rounded-bl-md'
                    }
                `}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.text}
                    </p>
                    <p className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                    </p>
                </div>
            </div>
        </div>
    );
}