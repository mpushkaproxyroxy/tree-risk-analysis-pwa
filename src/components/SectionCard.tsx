import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-app-line bg-app-card p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-app-text">{title}</h3>
        {description ? <p className="mt-1 text-sm text-app-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
