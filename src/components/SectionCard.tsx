import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/30 sm:p-5">
      <header className="mb-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-white">{title}</h3>
        {description ? (
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
