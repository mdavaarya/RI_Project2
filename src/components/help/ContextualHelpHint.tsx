import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ContextualHelpHintProps {
  title: string;
  content: string;
  className?: string;
}

export function ContextualHelpHint({ title, content, className }: ContextualHelpHintProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center text-[#526170] hover:text-[#176B52] focus:outline-none focus:ring-2 focus:ring-[#176B52] rounded-full p-0.5 ml-1"
        aria-label={`Bantuan untuk ${title}`}
        aria-expanded={isOpen}
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={title}
          className="absolute right-0 top-full mt-2 w-72 p-3 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-center justify-between font-semibold text-[#17212B] mb-1.5 pb-1 border-b border-[#E2E8F0]">
            <span>{title}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#718096] hover:text-[#17212B] p-0.5 rounded focus:outline-none"
              aria-label="Tutup petunjuk"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[#526170] leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
}
