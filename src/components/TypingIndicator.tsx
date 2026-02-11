'use client';

interface TypingIndicatorProps {
  text?: string;
}

export default function TypingIndicator({ text }: TypingIndicatorProps) {
  return (
    <div className="flex gap-2 justify-start animate-fade-in-up">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white text-sm">
        🌾
      </div>
      <div className="bg-secondary text-foreground border-l-4 border-primary rounded-2xl rounded-bl-sm px-4 py-3">
        {text ? (
          <p className="text-sm text-muted-foreground">{text}</p>
        ) : (
          <div className="flex gap-1 py-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>
    </div>
  );
}