import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Award, Grid3x3, Vote, CreditCard, ArrowLeftRight,
  Handshake, Newspaper, ImageIcon, CalendarDays, Settings2, BarChart3,
  FileText, ScrollText, Shield, DatabaseBackup, ChevronRight, Bell, Search,
  Menu, X, Headphones, MessageSquare,
} from 'lucide-react';

const NAV = [
  {
    section: 'MANAGEMENT',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      { label: 'Users', icon: Users, href: '/admin/users' },
      { label: 'Nominees', icon: Award, href: '/admin/nominees' },
      { label: 'Categories', icon: Grid3x3, href: '/admin/categories' },
      { label: 'Votes', icon: Vote, href: '/admin/votes' },
      { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
      { label: 'Transactions', icon: ArrowLeftRight, href: '/admin/transactions' },
      { label: 'Sponsors', icon: Handshake, href: '/admin/sponsors' },
      { label: 'News & Updates', icon: Newspaper, href: '/admin/news' },
      { label: 'Gallery', icon: ImageIcon, href: '/admin/gallery' },
      { label: 'Events', icon: CalendarDays, href: '/admin/events' },
      { label: 'Settings', icon: Settings2, href: '/admin/settings' },
    ],
  },
  {
    section: 'REPORTS & ANALYTICS',
    items: [
      { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
      { label: 'Reports', icon: FileText, href: '/admin/reports' },
      { label: 'Audit Logs', icon: ScrollText, href: '/admin/audit-logs' },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      { label: 'Roles & Permissions', icon: Shield, href: '/admin/roles' },
      { label: 'Backup & Restore', icon: DatabaseBackup, href: '/admin/backup' },
    ],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-body text-brand-ink">
      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-[230px] bg-white border-r border-black/5 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center px-5 py-4 border-b border-black/5">
          <img src="/nduthi-logo.png" alt="Nduthi Festival" className="h-10 w-auto object-contain" />
          <button className="ml-auto text-brand-ink/40 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {NAV.map((group) => (
            <div key={group.section}>
              <p className="text-[10px] font-extrabold text-brand-ink/40 tracking-wider uppercase px-2 mb-2">
                {group.section}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => navigate(item.href)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                          active
                            ? 'bg-[#0B8E36] text-white shadow-sm font-bold'
                            : 'text-brand-ink/75 hover:bg-black/[0.03] hover:text-brand-ink font-semibold'
                        }`}
                      >
                        <Icon size={16} className={`shrink-0 ${active ? 'text-white' : 'text-brand-ink/60'}`} />
                        <span className="flex-1 text-xs truncate">{item.label}</span>
                        <ChevronRight size={12} className={`shrink-0 ${active ? 'text-white/80' : 'text-brand-ink/30'}`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Help box */}
        <div className="p-3 m-3 bg-[#F8FAFC] rounded-2xl border border-black/5 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 text-brand-green">
              <Headphones size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-ink">Need Help?</p>
              <p className="text-[10px] text-brand-ink/50 leading-tight">Contact support for assistance</p>
            </div>
          </div>
          <button className="w-full py-2 bg-[#0B8E36] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-brand-green-dark transition-all duration-150">
            Contact Support
          </button>
        </div>

        {/* Footer Logo */}
        <div className="px-5 py-3 border-t border-black/5 flex items-center justify-between">
          <img src="/nduthi-logo.png" alt="" className="h-7 w-auto object-contain" />
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[68px] bg-white border-b border-black/5 flex items-center gap-4 px-6 shrink-0 shadow-sm">
          <button className="text-brand-ink/60 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div>
            <h1 className="font-display text-base font-extrabold text-brand-ink leading-tight">Dashboard</h1>
            <p className="text-xs text-brand-ink/50">Welcome back, Admin 👋</p>
          </div>

          {/* Search bar */}
          <div className="hidden sm:flex ml-auto items-center gap-2.5 bg-black/[0.03] rounded-full px-4 py-2 min-w-[240px] border border-black/5">
            <Search size={14} className="text-brand-ink/40" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-xs text-brand-ink outline-none flex-1 placeholder:text-brand-ink/40 font-medium"
            />
          </div>

          {/* Action notification badges */}
          <div className="flex items-center gap-2.5 ml-2">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-black/[0.03] hover:bg-black/[0.06] transition-colors">
              <Bell size={17} className="text-brand-ink/70" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">8</span>
            </button>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-black/[0.03] hover:bg-black/[0.06] transition-colors">
              <MessageSquare size={17} className="text-brand-ink/70" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0B8E36] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">5</span>
            </button>
          </div>

          {/* Admin user dropdown */}
          <div className="flex items-center gap-2.5 ml-2 pl-2 border-l border-black/10 cursor-pointer">
            <img src="https://i.pravatar.cc/100?img=60" alt="Admin User" className="w-9 h-9 rounded-full object-cover border border-black/10" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-brand-ink leading-tight">Admin User</p>
              <p className="text-[10px] font-medium text-brand-ink/50">Super Admin</p>
            </div>
            <ChevronRight size={13} className="text-brand-ink/40 rotate-90" />
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          <Outlet />
        </main>

        {/* Admin Footer */}
        <footer className="border-t border-black/5 bg-white px-6 py-3 flex items-center justify-between text-[11px] text-brand-ink/50 shrink-0">
          <p>© 2025 Nduthi Festival & Awards Kenya. All rights reserved.</p>
          <p className="font-medium">Built with <span className="text-brand-red">♥</span> for Kenya's Riders</p>
        </footer>
      </div>
    </div>
  );
}
