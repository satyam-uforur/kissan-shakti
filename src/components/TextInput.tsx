'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface TextInputProps {
  onTextSend: (text: string) => void;
  isProcessing: boolean;
}

export default function TextInput({ onTextSend, isProcessing }: TextInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onTextSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="अपना सवाल लिखो..."
        disabled={isProcessing}
        className="flex-1 px-4 py-2 rounded-full bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm"
      />
      <button
        type="submit"
        disabled={isProcessing || !input.trim()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Send size={18} />
      </button>
    </form>
  );
}