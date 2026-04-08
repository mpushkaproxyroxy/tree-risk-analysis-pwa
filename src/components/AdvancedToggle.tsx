import type { ReactNode } from 'react';

interface AdvancedToggleProps {
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function AdvancedToggle({ open, onToggle, children }: AdvancedToggleProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={onToggle}
        type="button"
      >
        <div>
          <h3 className="text-base font-semibold text-slate-900">Advanced parameters</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">Hidden by default to keep the first run simple.</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>

      {open ? <div className="mt-4 border-t border-slate-200 pt-4">{children}</div> : null}
    </div>
  );
}
