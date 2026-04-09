export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_rgba(15,23,42,0.65)]">
            TR
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-950">TreeRisk</p>
            <p className="text-xs text-slate-500">Analyze Tree Risk</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-transparent px-3 py-2 font-medium transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-950"
            href="https://github.com/mpushkaproxyroxy/TreeStormDMV"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
