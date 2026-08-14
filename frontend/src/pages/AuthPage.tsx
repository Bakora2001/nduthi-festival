import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ArrowRight, CheckCircle2, Phone, Mail,
  Lock, User, ChevronRight, Award, MapPin, Bike
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
  'Vote for your favourite riders & motorcycles',
  'Track live results in real-time',
  'Secure M-Pesa STK Push payment (KES 1)',
  'One vote per payment — fair & transparent',
];

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login');
  const [accountType, setAccountType] = useState<AccountType>('VOTER');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* ── Categories state for participant registration ── */
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  /* ── Login state ── */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd] = useState('');

  /* ── Register state ── */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Participant state ── */
  const [categoryId, setCategoryId] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [stageName, setStageName] = useState('');
  const [bikeMake, setBikeMake] = useState('TVS');
  const [bikeModel, setBikeModel] = useState('HLX 150');
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

  /* ── Validation ── */
  function validateRegister() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!regEmail.includes('@')) e.regEmail = 'Valid email is required';
    if (phone && !/^(\+254|0)\d{9}$/.test(phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid Kenyan phone number';
    if (regPwd.length < 6) e.regPwd = 'Password must be at least 6 characters';
    if (regPwd !== confirmPwd) e.confirmPwd = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must accept the terms';

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
        email: loginEmail,
        password: loginPwd,
      });

      const { accessToken, user } = res.data?.data || res.data;
      localStorage.setItem('nduthi_access_token', accessToken);
      localStorage.setItem('nduthi_user', JSON.stringify(user));

      setLoading(false);
      window.location.href = '/';
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to login. Please check your credentials.';
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
      if (accountType === 'VOTER') {
        const res = await api.post('/auth/register', {
          firstName,
          lastName,
          email: regEmail,
          phone,
          password: regPwd,
          roleName: 'REGISTERED_VOTER',
        });

        const { accessToken, user } = res.data?.data || res.data;
        localStorage.setItem('nduthi_access_token', accessToken);
        localStorage.setItem('nduthi_user', JSON.stringify(user));
      } else {
        // Register Participant in PostgreSQL DB
        const res = await api.post('/nominees/register', {
          firstName,
          lastName,
          email: regEmail,
          phone,
          password: regPwd,
          categoryId,
          county,
          stageName,
          make: bikeMake,
          model: bikeModel,
          registrationPlate,
          imageUrl: '/cat_rider_awards.jpg',
        });

        // Also log in automatically
        const loginRes = await api.post('/auth/login', {
          email: regEmail,
          password: regPwd,
        });

        const { accessToken, user } = loginRes.data?.data || loginRes.data;
        localStorage.setItem('nduthi_access_token', accessToken);
        localStorage.setItem('nduthi_user', JSON.stringify(user));
      }

      setLoading(false);
      setSuccess(true);
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.';
      setApiError(msg);
    }
  }

  /* ── Password strength ── */
  const strength = regPwd.length === 0 ? 0 : regPwd.length < 6 ? 1 : regPwd.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-brand-red', 'bg-amber-400', 'bg-brand-green'];

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── LEFT PANEL (hero) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden">
        {/* Flag background */}
        <img src="/hero_flag_bg.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#14231A]/90 via-[#14231A]/70 to-transparent" />

        {/* Motorcycle */}
        <img src="/hero_motorcycle.jpg" alt="" aria-hidden="true"
          className="absolute bottom-0 right-0 w-[80%] object-contain pointer-events-none select-none"
          style={{ mixBlendMode: 'luminosity', opacity: 0.35 }} />

        <div className="relative z-10 p-10 flex flex-col h-full">
          {/* Logo */}
          <img src="/nduthi-logo.png" alt="Nduthi Festival & Awards Kenya" className="h-12 w-auto object-contain self-start" />

          <div className="mt-auto mb-12">
            <h2 className="font-display font-extrabold text-3xl text-white leading-snug">
              Kenya's Premier<br />
              <span className="text-[#F5C542]">Motorcycle Awards</span><br />
              Voting & Registration
            </h2>
            <p className="mt-3 text-sm text-white/65 max-w-xs leading-relaxed">
              Register as a Voter or as a Participant to be voted for across Kenya's top motorcycle categories.
            </p>

            <ul className="mt-6 space-y-2.5">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-white/80">
                  <CheckCircle2 size={15} className="text-[#0B8E36] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-[11px] text-white/35">
            © 2025 Nduthi Festival & Awards Kenya. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden mb-6">
          <img src="/nduthi-logo.png" alt="Nduthi Festival" className="h-10 w-auto object-contain mx-auto" />
        </div>

        <div className="w-full max-w-[440px]">
          {/* Tab switcher */}
          <div className="flex bg-brand-ink/[0.04] rounded-xl p-1 mb-6">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); setApiError(null); setSuccess(false); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize ${
                  tab === t ? 'bg-white shadow-card text-brand-green' : 'text-brand-ink/60 hover:text-brand-ink'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {apiError && (
            <div className="mb-4 p-3 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <p>{apiError}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── LOGIN FORM ── */}
            {tab === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}>
                <h1 className="font-display text-2xl font-extrabold text-brand-ink">Welcome back! 👋</h1>
                <p className="text-sm text-brand-ink/55 mt-1">Sign in to cast your vote and track live results.</p>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <Field label="Email Address" icon={<Mail size={15} />}>
                    <input
                      id="login-email" type="email" required autoComplete="email"
                      value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  <Field label="Password" icon={<Lock size={15} />}
                    right={
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-brand-ink/35 hover:text-brand-ink transition-colors">
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  >
                    <input
                      id="login-pwd" type={showPwd ? 'text' : 'password'} required autoComplete="current-password"
                      value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)}
                      placeholder="Your password"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-green text-white text-sm font-bold py-3 rounded-xl shadow-card-lg hover:bg-[#076B29] transition-all duration-200 hover:scale-[1.01] disabled:opacity-70">
                    {loading ? <Spinner /> : <><span>Sign In</span><ArrowRight size={15} /></>}
                  </button>

                  <p className="text-center text-xs text-brand-ink/55 pt-2">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setTab('register')} className="font-bold text-brand-green hover:underline">
                      Create one for free →
                    </button>
                  </p>
                </form>
              </motion.div>
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 'register' && !success && (
              <motion.div key="register" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <h1 className="font-display text-2xl font-extrabold text-brand-ink">Join Nduthi Festival 🏍️</h1>
                <p className="text-sm text-brand-ink/55 mt-1">Choose how you want to join the festival below.</p>

                {/* Account Type Selector */}
                <div className="grid grid-cols-2 gap-2.5 my-4">
                  <button
                    type="button"
                    onClick={() => setAccountType('VOTER')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      accountType === 'VOTER'
                        ? 'border-brand-green bg-brand-green/5 text-brand-green shadow-sm'
                        : 'border-black/10 text-brand-ink/70 hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <span>🗳️ Voter</span>
                    </div>
                    <p className="text-[11px] text-brand-ink/50 mt-1">I want to vote for participants</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('PARTICIPANT')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      accountType === 'PARTICIPANT'
                        ? 'border-brand-green bg-brand-green/5 text-brand-green shadow-sm'
                        : 'border-black/10 text-brand-ink/70 hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <span>🏍️ Participant / Rider</span>
                    </div>
                    <p className="text-[11px] text-brand-ink/50 mt-1">I want to be voted for in awards</p>
                  </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First Name" icon={<User size={15} />} error={errors.firstName}>
                      <input id="firstName" type="text" required
                        value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                      />
                    </Field>
                    <Field label="Last Name" icon={<User size={15} />} error={errors.lastName}>
                      <input id="lastName" type="text" required
                        value={lastName} onChange={(e) => setLastName(e.target.value)}
                        placeholder="Mwangi"
                        className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                      />
                    </Field>
                  </div>

                  <Field label="Email Address" icon={<Mail size={15} />} error={errors.regEmail}>
                    <input id="regEmail" type="email" required
                      value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  <Field label="Phone Number (M-Pesa)" icon={<Phone size={15} />} error={errors.phone}>
                    <input id="phone" type="tel" required
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712 345 678"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  {/* ── PARTICIPANT EXTRA FIELDS ── */}
                  {accountType === 'PARTICIPANT' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-1 border-t border-black/5">
                      <div>
                        <label className="block text-xs font-bold text-brand-ink/60 mb-1">Award Category *</label>
                        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-brand-ink/[0.02] border-black/10">
                          <Award size={15} className="text-brand-ink/35 shrink-0" />
                          <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full bg-transparent text-xs font-semibold text-brand-ink outline-none"
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        {errors.categoryId && <p className="text-[11px] text-brand-red mt-1">{errors.categoryId}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="County / Region" icon={<MapPin size={15} />}>
                          <input
                            type="text"
                            value={county}
                            onChange={(e) => setCounty(e.target.value)}
                            placeholder="Nairobi, Nakuru..."
                            className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                          />
                        </Field>
                        <Field label="Stage / Club Name" icon={<Bike size={15} />}>
                          <input
                            type="text"
                            value={stageName}
                            onChange={(e) => setStageName(e.target.value)}
                            placeholder="Westlands Stage..."
                            className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                          />
                        </Field>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-brand-ink/60 mb-1">Make</label>
                          <input
                            type="text"
                            value={bikeMake}
                            onChange={(e) => setBikeMake(e.target.value)}
                            placeholder="TVS / Honda"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-xs text-brand-ink outline-none border-black/10"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-brand-ink/60 mb-1">Model</label>
                          <input
                            type="text"
                            value={bikeModel}
                            onChange={(e) => setBikeModel(e.target.value)}
                            placeholder="HLX 150"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-xs text-brand-ink outline-none border-black/10"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-brand-ink/60 mb-1">Plate Number</label>
                          <input
                            type="text"
                            value={registrationPlate}
                            onChange={(e) => setRegistrationPlate(e.target.value)}
                            placeholder="KMG 458X"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-xs text-brand-ink outline-none border-black/10"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Field label="Password" icon={<Lock size={15} />} error={errors.regPwd}
                    right={
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-brand-ink/35 hover:text-brand-ink">
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  >
                    <input id="regPwd" type={showPwd ? 'text' : 'password'} required
                      value={regPwd} onChange={(e) => setRegPwd(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  {/* Strength bar */}
                  {regPwd.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex gap-1 h-1">
                        {[1, 2, 3].map((s) => (
                          <div key={s} className={`flex-1 rounded-full transition-colors ${strength >= s ? strengthColor[strength] : 'bg-black/8'}`} />
                        ))}
                      </div>
                      <span className={`text-[10px] font-bold ${strength === 1 ? 'text-brand-red' : strength === 2 ? 'text-amber-500' : 'text-brand-green'}`}>
                        {strengthLabel[strength]}
                      </span>
                    </div>
                  )}

                  <Field label="Confirm Password" icon={<Lock size={15} />} error={errors.confirmPwd}
                    right={
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-brand-ink/35 hover:text-brand-ink">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  >
                    <input id="confirmPwd" type={showConfirm ? 'text' : 'password'} required
                      value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  <label className="flex items-start gap-2 cursor-pointer pt-1">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                      className="accent-brand-green w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-brand-ink/60 leading-snug">
                      I agree to the Terms & Privacy Policy
                    </span>
                  </label>
                  {errors.agreed && <p className="text-[11px] text-brand-red">{errors.agreed}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-green text-white text-sm font-bold py-3 rounded-xl shadow-card-lg hover:bg-[#076B29] transition-all duration-200 hover:scale-[1.01] disabled:opacity-70 mt-2">
                    {loading ? <Spinner /> : <><span>{accountType === 'PARTICIPANT' ? 'Register as Participant' : 'Create Voter Account'}</span><ArrowRight size={15} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── SUCCESS STATE ── */}
            {tab === 'register' && success && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-brand-green" />
                </div>
                <h2 className="font-display text-xl font-extrabold text-brand-ink">
                  {accountType === 'PARTICIPANT' ? 'Participant Registered! 🎉' : 'Account Created! 🎉'}
                </h2>
                <p className="text-sm text-brand-ink/60 mt-2 max-w-xs mx-auto leading-relaxed">
                  {accountType === 'PARTICIPANT'
                    ? 'Your name and details are now live on the voting pages! People can vote for you immediately.'
                    : 'Welcome to Nduthi Festival! You are logged in and ready to vote.'}
                </p>
                <a href="/categories"
                  className="mt-6 inline-flex items-center gap-2 bg-brand-green text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#076B29] transition-colors">
                  Go to Voting Pages <ChevronRight size={15} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, icon, right, error, children }: {
  label: string; icon: React.ReactNode; right?: React.ReactNode;
  error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-brand-ink/60 mb-1">{label}</label>
      <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2 bg-brand-ink/[0.02] transition-colors focus-within:border-brand-green ${error ? 'border-brand-red' : 'border-black/10'}`}>
        <span className="text-brand-ink/35 shrink-0">{icon}</span>
        {children}
        {right && <span className="shrink-0">{right}</span>}
      </div>
      {error && <p className="text-[11px] text-brand-red mt-1">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
