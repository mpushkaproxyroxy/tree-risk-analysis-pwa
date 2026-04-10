import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-[26px] border border-slate-200/90 bg-white p-4 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.4)] sm:p-5 lg:p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold tracking-tight text-slate-950 sm:text-lg">{title}</h3>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
