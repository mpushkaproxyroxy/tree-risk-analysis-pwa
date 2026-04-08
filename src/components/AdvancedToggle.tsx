import type { ReactNode } from 'react';

interface AdvancedToggleProps {
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function AdvancedToggle({ open, onToggle, children }: AdvancedToggleProps) {
  return (
    <div className="rounded-2xl border border-app-line bg-app-card p-5 shadow-sm">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={onToggle}
        type="button"
      >
        <div>
          <h3 className="text-sm font-semibold text-app-text">Advanced Parameters</h3>
          <p className="mt-1 text-sm text-app-muted">Hidden by default to keep the first run simple.</p>
        </div>
        <span className="text-sm font-medium text-app-accent">{open ? 'Hide' : 'Show'}</span>
      </button>

      {open ? <div className="mt-4 border-t border-app-line pt-4">{children}</div> : null}
    </div>
  );
}
