import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
}

export function Alert({ variant = 'info', title, className, children, ...props }: AlertProps) {
  const variants = {
    info: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    success: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#A16207] border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
  };

  const icons = {
    info: <Info className="w-5 h-5 flex-shrink-0 text-[#0369A1]" aria-hidden="true" />,
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#15803D]" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#A16207]" aria-hidden="true" />,
    danger: <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#B91C1C]" aria-hidden="true" />,
  };

  return (
    <div
      role="alert"
      className={cn('flex gap-3 p-4 rounded-lg border text-sm', variants[variant], className)}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-1 leading-tight">{title}</h5>}
        <div className="text-sm opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
