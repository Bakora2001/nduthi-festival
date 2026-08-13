import { useState, useEffect } from 'react';
import { Menu, Search, X, User, LogOut } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Nominees', href: '/nominees' },
  { label: 'Live Results', href: '/live-results' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'News', href: '/news' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ firstName?: string; email?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nduthi_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nduthi_user');
    localStorage.removeItem('nduthi_access_token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="container-nd flex items-center justify-between h-[72px]">
        <Logo />

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-brand-ink/80">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative py-2 transition-colors hover:text-brand-green ${
                i === 0 ? 'text-brand-red' : ''
              }`}
            >
              {link.label}
              {i === 0 && <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-brand-red rounded-full" />}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            aria-label="Search"
            className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-brand-ink/70 hover:border-brand-green hover:text-brand-green transition-colors"
          >
            <Search size={16} />
          </button>

          {user ? (
            <div className="flex items-center gap-2.5 bg-brand-green/10 px-3 py-1.5 rounded-full border border-brand-green/20">
              <div className="w-6 h-6 rounded-full bg-brand-green text-white font-bold text-xs flex items-center justify-center">
                {user.firstName ? user.firstName[0] : 'U'}
              </div>
              <span className="text-xs font-bold text-brand-ink truncate max-w-[100px]">
                {user.firstName || 'Voter'}
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-brand-ink/50 hover:text-brand-red transition-colors ml-1"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-black/10 text-brand-ink hover:border-brand-green hover:text-brand-green transition-colors"
              >
                Login
              </a>
              <a
                href="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-dark transition-colors shadow-card"
              >
                Register
              </a>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden w-10 h-10 flex items-center justify-center text-brand-ink"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-black/5 bg-white px-5 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="block text-sm font-medium text-brand-ink/80 py-1.5">
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-red"
              >
                Logout ({user.firstName})
              </button>
            ) : (
              <>
                <a href="/login" className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold border border-black/10">
                  Login
                </a>
                <a href="/register" className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-green">
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
