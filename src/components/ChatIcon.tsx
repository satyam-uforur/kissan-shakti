'use client';

import { useState } from 'react';
import ChatWidget from './ChatWidget';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform duration-300 ${
          isOpen ? 'hidden' : 'animate-float'
        }`}
        aria-label="Open chat"
      >
        🌾
      </button>

      {/* Chat Widget */}
      {isOpen && <ChatWidget onClose={() => setIsOpen(false)} />}
    </>
  );
}