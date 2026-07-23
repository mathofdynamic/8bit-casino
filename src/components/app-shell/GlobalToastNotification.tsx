/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, type LucideIcon } from 'lucide-react';
import type { ToastState } from '../../store';

interface GlobalToastNotificationProps {
  toast: ToastState;
  onAutoDismiss: () => void;
  onDismiss: () => void;
}

interface ToastPresentation {
  Icon: LucideIcon;
  label: string;
  accentText: string;
  accentBorder: string;
  accentSurface: string;
}

const getToastPresentation = (type: ToastState['type']): ToastPresentation => {
  switch (type) {
    case 'success':
      return {
        Icon: CheckCircle2,
        label: 'SUCCESS',
        accentText: 'text-[#66D18F]',
        accentBorder: 'border-[#66D18F]',
        accentSurface: 'bg-[#66D18F]',
      };
    case 'error':
      return {
        Icon: AlertTriangle,
        label: 'ERROR',
        accentText: 'text-[#E85D68]',
        accentBorder: 'border-[#E85D68]',
        accentSurface: 'bg-[#E85D68]',
      };
    case 'info':
    default:
      return {
        Icon: Info,
        label: 'NOTICE',
        accentText: 'text-[#54D6D9]',
        accentBorder: 'border-[#54D6D9]',
        accentSurface: 'bg-[#54D6D9]',
      };
  }
};

export const GlobalToastNotification: React.FC<GlobalToastNotificationProps> = ({
  toast,
  onAutoDismiss,
  onDismiss,
}) => {
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (dismissTimerRef.current !== null) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    if (!toast.visible) {
      return;
    }

    dismissTimerRef.current = setTimeout(() => {
      onAutoDismiss();
    }, 3500);

    return () => {
      if (dismissTimerRef.current !== null) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, [toast, onAutoDismiss]);

  if (!toast.visible) {
    return null;
  }

  const presentation = getToastPresentation(toast.type);
  const { Icon } = presentation;
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 inset-x-0 z-[90] px-4 flex justify-center pointer-events-none">
      <div
        role={isError ? 'alert' : 'status'}
        aria-live={isError ? 'assertive' : 'polite'}
        aria-atomic="true"
        className="w-full max-w-[520px] pointer-events-auto bg-[#15182A] border-2 border-[#44476B] p-3.5 relative flex flex-col gap-2 select-none"
        style={{
          clipPath:
            'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)',
          boxShadow: '4px 4px 0px #000000',
        }}
      >
        <div className="flex items-start gap-3 min-w-0 pr-6">
          {/* Icon Block */}
          <div
            className={`w-10 h-10 bg-[#0B0D18] border-2 ${presentation.accentBorder} flex items-center justify-center shrink-0`}
            style={{
              clipPath:
                'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)',
            }}
          >
            <Icon className={`w-5 h-5 ${presentation.accentText}`} aria-hidden="true" />
          </div>

          {/* Message Content */}
          <div className="flex flex-col min-w-0 text-left flex-1">
            <span className={`font-jersey text-xs uppercase tracking-wider font-bold ${presentation.accentText}`}>
              {presentation.label}
            </span>
            <p className="font-jersey text-sm md:text-base text-[#F3EBD8] uppercase leading-snug m-0 whitespace-normal break-words mt-0.5">
              {toast.message}
            </p>
          </div>
        </div>

        {/* Small static accent bar */}
        <div className="pt-2 border-t border-[#2E3150] flex justify-end">
          <div className={`h-1 w-12 ${presentation.accentSurface}`} />
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 bg-[#0B0D18] border border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B73C] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
