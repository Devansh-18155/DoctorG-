import React from 'react';
import { QueueStatus } from '../../types';

interface StatusBadgeProps {
  status: string;
  type?: 'queue' | 'booking' | 'payment' | 'order';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'booking' }) => {
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';

  const normalized = status.toUpperCase();

  if (['PAID', 'COMPLETED', 'DELIVERED', 'REPORT_READY'].includes(normalized)) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['WAITING', 'CALLED', 'OUT_FOR_DELIVERY', 'IN_TRANSIT', 'ASSIGNED'].includes(normalized)) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['IN CONSULTATION', 'PROCESSING', 'PREPARING', 'VERIFYING_RX', 'REQUESTED'].includes(normalized)) {
    colorClass = 'bg-sky-50 text-sky-700 border-sky-200';
  } else if (['CANCELLED', 'FAILED', 'NO SHOW', 'OUT OF STOCK'].includes(normalized)) {
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['UPCOMING', 'BOOKED', 'AVAILABLE'].includes(normalized)) {
    colorClass = 'bg-teal-50 text-teal-700 border-teal-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${colorClass}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};
