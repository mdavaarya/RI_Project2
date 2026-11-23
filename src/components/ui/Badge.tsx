import React from 'react';
import { cn } from '../../utils/cn';
import { MemberStatus } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#F1F5F9] text-[#17212B] border-[#E2E8F0]',
    success: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#A16207] border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
    info: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function MemberStatusBadge({ status, className }: { status: MemberStatus | string; className?: string }) {
  // AC-038: Must always contain descriptive text label, not solely color
  switch (status) {
    case 'aktif':
      return (
        <Badge variant="success" className={cn('gap-1', className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" aria-hidden="true"></span>
          Aktif
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="warning" className={cn('gap-1', className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#A16207]" aria-hidden="true"></span>
          Menunggu Verifikasi
        </Badge>
      );
    case 'nonaktif':
      return (
        <Badge variant="danger" className={cn('gap-1', className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" aria-hidden="true"></span>
          Nonaktif
        </Badge>
      );
    default:
      return <Badge variant="default" className={className}>{status}</Badge>;
  }
}
