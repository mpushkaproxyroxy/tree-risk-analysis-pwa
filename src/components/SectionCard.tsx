import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5">
      <header className="mb-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">{title}</h3>
        {description ? (
          <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
