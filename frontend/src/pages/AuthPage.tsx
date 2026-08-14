import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ArrowRight, CheckCircle2, Phone,
  Lock, User, Award, MapPin, Bike, Sparkles
} from 'lucide-react';
import { api } from '../lib/api';

type Tab = 'login' | 'register';
type AccountType = 'VOTER' | 'PARTICIPANT';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const FEATURES = [
  'Vote for your favourite riders & motorcycles in Eldoret',
  'Track live results in real-time on the leaderboard',
  'Fast M-Pesa STK Push payment (KES 1)',
  'Instant voter confirmation & leaderboard tally',
];

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login');
  const [accountType, setAccountType] = useState<AccountType>('VOTER');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* ── Categories state for participant registration ── */
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  /* ── Login state ── */
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPwd, setLoginPwd] = useState('');

  /* ── Register state ── */
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Participant state ── */
  const [categoryId, setCategoryId] = useState('');
  const [county, setCounty] = useState('Eldoret, Kenya');
  const [stageName, setStageName] = useState('');
  const [bikeMake, setBikeMake] = useState('Boxer');
  const [bikeModel, setBikeModel] = useState('BM 150');
  const [registrationPlate, setRegistrationPlate] = useState('');

  useEffect(() => {
    // Fetch categories dynamically from backend
    api.get('/categories')
      .then((res) => {
        const cats = res.data?.data || res.data || [];
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  /* ── Quick Validation ── */
  function validateRegister() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Please enter your name';
    const cleanPhone = phone.replace(/\s/g, '');
    if (!cleanPhone || !/^(\+254|0)\d{9}$/.test(cleanPhone)) {
      e.phone = 'Enter a valid Kenyan phone number (e.g. 0712345678)';
    }
    if (!regPwd || regPwd.length < 4) {
      e.regPwd = 'Password must be at least 4 characters';
    }

    if (accountType === 'PARTICIPANT') {
      if (!categoryId) e.categoryId = 'Please select an award category';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── Login Handler ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        phone: loginIdentifier,
        password: loginPwd,
      });

      const { accessToken, user } = res.data?.data || res.data;
      localStorage.setItem('nduthi_access_token', accessToken);
      localStorage.setItem('nduthi_user', JSON.stringify(user));

      setLoading(false);
      window.location.href = '/';
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to login. Please check your phone number and password.';
      setApiError(msg);
    }
  }

  /* ── Register Handler ── */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validateRegister()) return;
    setLoading(true);

    try {
      const [firstName, ...rest] = fullName.trim().split(' ');
      const lastName = rest.join(' ') || '';

      if (accountType === 'VOTER') {
        const res = await api.post('/auth/register', {
          firstName: firstName || 'Voter',
          lastName,
          name: fullName.trim(),
          phone,
          password: regPwd,
          roleName: 'REGISTERED_VOTER',
        });

        const { accessToken, user } = res.data?.data || res.data;
        localStorage.setItem('nduthi_access_token', accessToken);
        localStorage.setItem('nduthi_user', JSON.stringify(user));
      } else {
        // Register Participant in PostgreSQL DB
        await api.post('/nominees/register', {
          firstName: firstName || 'Participant',
          lastName,
          name: fullName.trim(),
          phone,
          password: regPwd,
          categoryId,
          county: county || 'Eldoret, Kenya',
          stageName: stageName || fullName.trim(),
          make: bikeMake,
          model: bikeModel,
          registrationPlate,
          imageUrl: '/cat_motorcycle.jpg',
        });

        // Automatically log in
        const loginRes = await api.post('/auth/login', {
          phone,
          password: regPwd,
        });

        const { accessToken, user } = loginRes.data?.data || loginRes.data;
        localStorage.setItem('nduthi_access_token', accessToken);
        localStorage.setItem('nduthi_user', JSON.stringify(user));
      }

      setLoading(false);
      window.location.href = accountType === 'PARTICIPANT' ? '/categories' : '/';
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check your details and try again.';
      setApiError(msg);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left panel - Branding and Features */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0C1A10] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#076B29_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10">
          <a href="/" className="inline-block mb-10">
            <img src="/nduthi-logo.png" alt="Nduthi Festival & Awards Kenya" className="h-12 w-auto object-contain" />
          </a>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-bold tracking-wide uppercase mb-4">
            <Sparkles size={13} /> Official Voting Platform • Eldoret, Kenya
          </span>

          <h2 className="font-display font-extrabold text-3xl xl:text-4xl text-white leading-tight">
            Kenya's Premier<br />
            <span className="text-[#F5C542]">Motorcycle Awards</span>
          </h2>

          <p className="text-white/70 text-sm mt-3 leading-relaxed max-w-sm">
            Sign in with your phone number to vote for your favorite riders or register as a participant in Eldoret, Kenya.
          </p>

          <div className="mt-8 space-y-3.5 border-t border-white/10 pt-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-xs text-white/80 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} Nduthi Festival & Awards Kenya. Eldoret Edition.
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6 text-center sm:text-left">
            <h1 className="font-display font-black text-2xl text-brand-ink">
              {tab === 'login' ? 'Welcome Back 👋' : 'Create an Account'}
            </h1>
            <p className="text-xs text-brand-ink/60 mt-1">
              {tab === 'login'
                ? 'Enter your phone number & password to sign in and vote.'
                : 'Fast registration — sign up in 10 seconds!'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-black/[0.04] p-1 rounded-2xl mb-6">
            <button
              onClick={() => { setTab('login'); setApiError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-white text-brand-ink shadow-sm'
                  : 'text-brand-ink/50 hover:text-brand-ink'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setApiError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-white text-brand-ink shadow-sm'
                  : 'text-brand-ink/50 hover:text-brand-ink'
              }`}
            >
              Register
            </button>
          </div>

          {apiError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-700 font-medium">
              ⚠️ {apiError}
            </div>
          )}

          {/* ────────────────── LOGIN FORM ────────────────── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-ink/70 mb-1.5">
                  Phone Number (or Email) *
                </label>
                <div className="flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-white border-black/10 focus-within:border-brand-green">
                  <Phone size={16} className="text-brand-ink/40 shrink-0" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="0712345678 or +254712345678"
                    className="w-full bg-transparent text-sm text-brand-ink font-semibold outline-none placeholder:text-brand-ink/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink/70 mb-1.5">
                  Password *
                </label>
                <div className="flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-white border-black/10 focus-within:border-brand-green">
                  <Lock size={16} className="text-brand-ink/40 shrink-0" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm text-brand-ink font-semibold outline-none placeholder:text-brand-ink/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="text-brand-ink/40 hover:text-brand-ink/70"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#076B29] text-white text-sm font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#05521F] transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Signing In...' : 'Sign In & Vote'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ────────────────── REGISTER FORM ────────────────── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Account Type Selector */}
              <div>
                <label className="block text-xs font-bold text-brand-ink/70 mb-2">
                  Choose Account Type:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAccountType('VOTER')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      accountType === 'VOTER'
                        ? 'border-brand-green bg-brand-green/5 shadow-sm ring-1 ring-brand-green/30'
                        : 'border-black/10 bg-white hover:border-black/20'
                    }`}
                  >
                    <div className="text-lg mb-1">🗳️</div>
                    <p className="font-bold text-xs text-brand-ink">Voter</p>
                    <p className="text-[10px] text-brand-ink/50 leading-tight">Vote for riders</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('PARTICIPANT')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      accountType === 'PARTICIPANT'
                        ? 'border-brand-green bg-brand-green/5 shadow-sm ring-1 ring-brand-green/30'
                        : 'border-black/10 bg-white hover:border-black/20'
                    }`}
                  >
                    <div className="text-lg mb-1">🏍️</div>
                    <p className="font-bold text-xs text-brand-ink">Participant / Rider</p>
                    <p className="text-[10px] text-brand-ink/50 leading-tight">To be voted for</p>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-brand-ink/70 mb-1.5">
                  Full Name *
                </label>
                <div className="flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-white border-black/10 focus-within:border-brand-green">
                  <User size={16} className="text-brand-ink/40 shrink-0" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maxwell Omwoyo"
                    className="w-full bg-transparent text-sm text-brand-ink font-semibold outline-none placeholder:text-brand-ink/30"
                  />
                </div>
                {errors.fullName && <p className="text-[11px] text-brand-red font-semibold mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-brand-ink/70 mb-1.5">
                  Phone Number (M-Pesa) *
                </label>
                <div className="flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-white border-black/10 focus-within:border-brand-green">
                  <Phone size={16} className="text-brand-ink/40 shrink-0" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712345678 or 0700000000"
                    className="w-full bg-transparent text-sm text-brand-ink font-semibold outline-none placeholder:text-brand-ink/30"
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-brand-red font-semibold mt-1">{errors.phone}</p>}
              </div>

              {/* Participant Additional Fields */}
              {accountType === 'PARTICIPANT' && (
                <div className="space-y-3.5 p-3.5 rounded-2xl bg-brand-green/5 border border-brand-green/20">
                  <p className="text-xs font-bold text-brand-green uppercase tracking-wide flex items-center gap-1.5">
                    <Award size={14} /> Participant Award Category
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-ink/70 mb-1">
                      Award Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs font-bold text-brand-ink bg-white border-brand-green/30 outline-none focus:border-brand-green"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-brand-ink/70 mb-1">
                        Location / County
                      </label>
                      <input
                        type="text"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        placeholder="Eldoret, Kenya"
                        className="w-full border rounded-xl px-3 py-2 text-xs font-semibold text-brand-ink bg-white border-black/10 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-ink/70 mb-1">
                        Stage / Club Name
                      </label>
                      <input
                        type="text"
                        value={stageName}
                        onChange={(e) => setStageName(e.target.value)}
                        placeholder="e.g. Eldoret Stage"
                        className="w-full border rounded-xl px-3 py-2 text-xs font-semibold text-brand-ink bg-white border-black/10 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-brand-ink/70 mb-1">
                        Motorcycle Make
                      </label>
                      <input
                        type="text"
                        value={bikeMake}
                        onChange={(e) => setBikeMake(e.target.value)}
                        placeholder="Boxer, TVS, Yamaha..."
                        className="w-full border rounded-xl px-3 py-2 text-xs font-semibold text-brand-ink bg-white border-black/10 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-ink/70 mb-1">
                        Number Plate (Optional)
                      </label>
                      <input
                        type="text"
                        value={registrationPlate}
                        onChange={(e) => setRegistrationPlate(e.target.value)}
                        placeholder="KMDF 123A"
                        className="w-full border rounded-xl px-3 py-2 text-xs font-semibold text-brand-ink bg-white border-black/10 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-brand-ink/70 mb-1.5">
                  Password *
                </label>
                <div className="flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-white border-black/10 focus-within:border-brand-green">
                  <Lock size={16} className="text-brand-ink/40 shrink-0" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={regPwd}
                    onChange={(e) => setRegPwd(e.target.value)}
                    placeholder="Create a password (min 4 characters)"
                    className="w-full bg-transparent text-sm text-brand-ink font-semibold outline-none placeholder:text-brand-ink/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="text-brand-ink/40 hover:text-brand-ink/70"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.regPwd && <p className="text-[11px] text-brand-red font-semibold mt-1">{errors.regPwd}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#076B29] text-white text-sm font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#05521F] transition-all disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Creating Account...'
                    : accountType === 'VOTER'
                    ? 'Create Voter Account'
                    : 'Register as Participant'}
                </span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
