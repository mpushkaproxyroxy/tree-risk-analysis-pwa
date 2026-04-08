interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-app-line/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-app-accent text-sm font-semibold text-white">
            TR
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-app-text">TreeRisk</p>
            <p className="text-xs text-app-muted">Analyze Tree Risk</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-app-muted">
          <a className="hidden transition hover:text-app-text sm:inline-flex" href="#docs">
            Docs
          </a>
          <button
            className="rounded-full border border-app-line px-3 py-1.5 text-app-text transition hover:border-app-accent hover:text-app-accent"
            onClick={onToggleTheme}
            type="button"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <a
            className="hidden transition hover:text-app-text sm:inline-flex"
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
