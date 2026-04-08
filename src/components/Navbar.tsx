export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            TR
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">TreeRisk</p>
            <p className="text-xs text-slate-500">Analyze Tree Risk</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 py-2 font-medium transition hover:bg-slate-100 hover:text-slate-900"
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
