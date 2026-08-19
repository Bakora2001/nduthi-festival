import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import LiveResults from './pages/LiveResults';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import { VoteProvider, useVote } from './context/VoteContext';
import PaymentModal from './components/PaymentModal';
import { useEffect } from 'react';
import { X } from 'lucide-react';

function GlobalToast() {
  const { toastMessage, toastType, clearToast } = useVote();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  const bgStyle =
    toastType === 'warning'
      ? 'bg-amber-900/90 border-amber-500/50 text-amber-100'
      : toastType === 'error'
      ? 'bg-red-950/90 border-red-500/50 text-red-100'
      : toastType === 'info'
      ? 'bg-blue-950/90 border-blue-500/50 text-blue-100'
      : 'bg-brand-ink/95 border-brand-green/50 text-white';

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md max-w-md ${bgStyle}`}>
      <span className="text-base shrink-0">
        {toastType === 'warning' ? '🔒' : toastType === 'error' ? '⚠️' : toastType === 'info' ? '📲' : '🎉'}
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
        <PaymentModal />
        <Routes>
          {/* ── Public site (with Header + Footer) ── */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<Categories />} />
            <Route path="/nominees" element={<Categories />} />
            <Route path="/live-results" element={<LiveResults />} />
            <Route path="/sponsors" element={<PlaceholderPage title="Sponsors & Partners" description="Meet our proud sponsors who make the Nduthi Festival possible." />} />
            <Route path="/news" element={<PlaceholderPage title="News & Updates" description="Latest news from the Nduthi Festival & Awards Kenya." />} />
            <Route path="/gallery" element={<PlaceholderPage title="Gallery" description="Photos and videos from the festival." />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<PlaceholderPage title="Page Not Found" description="The page you're looking for doesn't exist." />} />
          </Route>

          {/* ── Auth pages (full-screen, no Header/Footer) ── */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* ── Admin Dashboard ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </VoteProvider>
  );
}
