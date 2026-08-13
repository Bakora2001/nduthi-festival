import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import LiveResults from './pages/LiveResults';
import AuthPage from './pages/AuthPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import { VoteProvider, useVote } from './context/VoteContext';
import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

function GlobalToast() {
  const { toastMessage, toastType, clearToast } = useVote();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  const bgStyle =
    toastType === 'warning'
      ? 'bg-amber-900/90 border-amber-500/50 text-amber-100'
      : toastType === 'error'
      ? 'bg-red-950/90 border-red-500/50 text-red-100'
      : 'bg-brand-ink/95 border-brand-green/50 text-white';

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md max-w-md ${bgStyle}`}>
      <span className="text-base shrink-0">
        {toastType === 'warning' ? '🔒' : toastType === 'error' ? '⚠️' : '🎉'}
      </span>
      <p className="text-xs font-bold leading-relaxed flex-1">{toastMessage}</p>
      <button onClick={clearToast} className="opacity-60 hover:opacity-100 ml-2">
        <X size={16} />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <VoteProvider>
      <BrowserRouter>
        <GlobalToast />
        <Routes>
          {/* ── Public site (with Header + Footer) ── */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<PlaceholderPage title="Category Voting Page" description="Nominee cards with motorcycle/number plate images and Vote Now buttons." />} />
            <Route path="/nominees" element={<PlaceholderPage title="Nominees" description="Browse all nominees across every award category." />} />
            <Route path="/live-results" element={<LiveResults />} />
            <Route path="/sponsors" element={<PlaceholderPage title="Sponsors & Partners" description="Meet our proud sponsors who make the Nduthi Festival possible." />} />
            <Route path="/news" element={<PlaceholderPage title="News & Updates" description="Latest news from the Nduthi Festival & Awards Kenya." />} />
            <Route path="/gallery" element={<PlaceholderPage title="Gallery" description="Photos and videos from the festival." />} />
            <Route path="/contact" element={<PlaceholderPage title="Contact Us" description="Get in touch with the Nduthi Festival team." />} />
            <Route path="*" element={<PlaceholderPage title="Page Not Found" description="The page you're looking for doesn't exist." />} />
          </Route>

          {/* ── Auth pages (full-screen, no Header/Footer) ── */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* ── Admin Dashboard (own layout with sidebar) ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<PlaceholderPage title="User Management" description="View and manage all registered users and their roles." />} />
            <Route path="nominees" element={<PlaceholderPage title="Nominees Management" description="Add, edit and manage all award nominees and their motorcycle images." />} />
            <Route path="categories" element={<PlaceholderPage title="Categories Management" description="Create and manage all award categories." />} />
            <Route path="votes" element={<PlaceholderPage title="Votes" description="View all votes cast across all categories." />} />
            <Route path="payments" element={<PlaceholderPage title="Payments" description="View and manage all payments and transactions." />} />
            <Route path="transactions" element={<PlaceholderPage title="Transactions" description="Detailed transaction logs for all payments." />} />
            <Route path="sponsors" element={<PlaceholderPage title="Sponsors" description="Manage festival sponsors and their profiles." />} />
            <Route path="news" element={<PlaceholderPage title="News & Updates" description="Publish and manage news articles." />} />
            <Route path="gallery" element={<PlaceholderPage title="Gallery" description="Manage festival photo gallery." />} />
            <Route path="events" element={<PlaceholderPage title="Events" description="Manage festival events and schedules." />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" description="Configure system settings." />} />
            <Route path="analytics" element={<PlaceholderPage title="Analytics" description="Deep analytics and voting statistics." />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" description="Generate and download system reports." />} />
            <Route path="audit-logs" element={<PlaceholderPage title="Audit Logs" description="Full system audit trail of all admin actions." />} />
            <Route path="roles" element={<PlaceholderPage title="Roles & Permissions" description="Manage user roles and access permissions." />} />
            <Route path="backup" element={<PlaceholderPage title="Backup & Restore" description="Backup and restore system data." />} />
            <Route path="*" element={<PlaceholderPage title="Admin Page" description="This admin section is under construction." />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </VoteProvider>
  );
}
