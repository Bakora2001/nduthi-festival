import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ArrowRight, CheckCircle2, Phone, Mail,
  Lock, User, ChevronRight,
} from 'lucide-react';

type Tab = 'login' | 'register';

const FEATURES = [
  'Vote for your favourite riders & motorcycles',
  'Track live results in real-time',
  'Secure M-Pesa & card payment integration',
  'One vote per payment — fair & transparent',
];

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  /* ── Validation ── */
  function validateRegister() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!regEmail.includes('@')) e.regEmail = 'Valid email is required';
    if (phone && !/^(\+254|0)\d{9}$/.test(phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid Kenyan phone number';
    if (regPwd.length < 8) e.regPwd = 'Password must be at least 8 characters';
    if (regPwd !== confirmPwd) e.confirmPwd = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── Submit handlers ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem(
      'nduthi_user',
      JSON.stringify({ email: loginEmail || 'voter@nduthiawards.co.ke', firstName: 'Brian', lastName: 'Mwangi' })
    );
    localStorage.setItem('nduthi_access_token', 'session_token_authenticated');
    setLoading(false);
    window.location.href = '/';
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem(
      'nduthi_user',
      JSON.stringify({ email: regEmail, firstName, lastName, phone })
    );
    localStorage.setItem('nduthi_access_token', 'session_token_authenticated');
    setLoading(false);
    setSuccess(true);
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
              Voting Platform
            </h2>
            <p className="mt-3 text-sm text-white/65 max-w-xs leading-relaxed">
              Join thousands of riders, fans and partners celebrating excellence in the motorcycle community.
            </p>

            <ul className="mt-6 space-y-2.5">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-white/80">
                  <CheckCircle2 size={15} className="text-[#0B8E36] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="mt-8 flex gap-6">
              {[{ v: '24,560', l: 'Total Votes' }, { v: '5,432', l: 'Voters' }, { v: '87', l: 'Nominees' }].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-xl font-black text-[#F5C542]">{s.v}</p>
                  <p className="text-[11px] text-white/50">{s.l}</p>
                </div>
              ))}
            </div>
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

        <div className="w-full max-w-[420px]">
          {/* Tab switcher */}
          <div className="flex bg-brand-ink/[0.04] rounded-xl p-1 mb-7">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); setSuccess(false); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize ${
                  tab === t ? 'bg-white shadow-card text-brand-green' : 'text-brand-ink/60 hover:text-brand-ink'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

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

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-brand-green w-3.5 h-3.5" />
                      <span className="text-brand-ink/60">Remember me</span>
                    </label>
                    <a href="/forgot-password" className="font-semibold text-brand-green hover:underline">Forgot password?</a>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-green text-white text-sm font-bold py-3 rounded-xl shadow-card-lg hover:bg-[#076B29] transition-all duration-200 hover:scale-[1.01] disabled:opacity-70">
                    {loading ? <Spinner /> : <><span>Sign In</span><ArrowRight size={15} /></>}
                  </button>

                  <div className="relative flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-black/8" />
                    <span className="text-[11px] text-brand-ink/40 font-semibold">OR</span>
                    <div className="flex-1 h-px bg-black/8" />
                  </div>

                  <p className="text-center text-xs text-brand-ink/55">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setTab('register')} className="font-bold text-brand-green hover:underline">
                      Create one for free →
                    </button>
                  </p>
                </form>

                {/* Info banner */}
                <div className="mt-6 rounded-xl bg-brand-green/5 border border-brand-green/15 px-4 py-3 flex items-start gap-2.5">
                  <span className="text-brand-green text-base shrink-0 mt-0.5">ℹ️</span>
                  <p className="text-xs text-brand-ink/70 leading-relaxed">
                    <strong className="text-brand-ink">Browsing is free.</strong> You only need to log in when you're ready to cast your vote after completing payment.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 'register' && !success && (
              <motion.div key="register" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <h1 className="font-display text-2xl font-extrabold text-brand-ink">Join Nduthi Festival 🏍️</h1>
                <p className="text-sm text-brand-ink/55 mt-1">Create your account to vote and participate in the awards.</p>

                <form onSubmit={handleRegister} className="mt-6 space-y-3.5">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Field label="First Name" icon={<User size={15} />} error={errors.firstName}>
                        <input id="firstName" type="text" autoComplete="given-name"
                          value={firstName} onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                        />
                      </Field>
                    </div>
                    <div>
                      <Field label="Last Name" icon={<User size={15} />} error={errors.lastName}>
                        <input id="lastName" type="text" autoComplete="family-name"
                          value={lastName} onChange={(e) => setLastName(e.target.value)}
                          placeholder="Mwangi"
                          className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                        />
                      </Field>
                    </div>
                  </div>

                  <Field label="Email Address" icon={<Mail size={15} />} error={errors.regEmail}>
                    <input id="regEmail" type="email" autoComplete="email"
                      value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  <Field label="Phone Number (optional)" icon={<Phone size={15} />} error={errors.phone}>
                    <input id="phone" type="tel" autoComplete="tel"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  <Field label="Password" icon={<Lock size={15} />} error={errors.regPwd}
                    right={
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-brand-ink/35 hover:text-brand-ink">
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  >
                    <input id="regPwd" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                      value={regPwd} onChange={(e) => setRegPwd(e.target.value)}
                      placeholder="Min. 8 characters"
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
                    <input id="confirmPwd" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
                      value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/35"
                    />
                  </Field>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                      className="accent-brand-green w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-brand-ink/60 leading-snug">
                      I agree to the{' '}
                      <a href="/terms" className="font-semibold text-brand-green hover:underline">Terms & Conditions</a>
                      {' '}and{' '}
                      <a href="/privacy" className="font-semibold text-brand-green hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.agreed && <p className="text-[11px] text-brand-red -mt-2">{errors.agreed}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-green text-white text-sm font-bold py-3 rounded-xl shadow-card-lg hover:bg-[#076B29] transition-all duration-200 hover:scale-[1.01] disabled:opacity-70">
                    {loading ? <Spinner /> : <><span>Create Account</span><ArrowRight size={15} /></>}
                  </button>

                  <p className="text-center text-xs text-brand-ink/55">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setTab('login')} className="font-bold text-brand-green hover:underline">
                      Sign in →
                    </button>
                  </p>
                </form>
              </motion.div>
            )}

            {/* ── SUCCESS STATE ── */}
            {tab === 'register' && success && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-brand-green" />
                </div>
                <h2 className="font-display text-xl font-extrabold text-brand-ink">Account Created! 🎉</h2>
                <p className="text-sm text-brand-ink/60 mt-2 max-w-xs mx-auto leading-relaxed">
                  Welcome to Nduthi Festival! Check your email to verify your account, then you're ready to vote.
                </p>
                <a href="/"
                  className="mt-6 inline-flex items-center gap-2 bg-brand-green text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#076B29] transition-colors">
                  Go to Homepage <ChevronRight size={15} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Field wrapper ─────────────────────────────── */
function Field({ label, icon, right, error, children }: {
  label: string; icon: React.ReactNode; right?: React.ReactNode;
  error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-brand-ink/60 mb-1.5">{label}</label>
      <div className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-brand-ink/[0.02] transition-colors focus-within:border-brand-green focus-within:bg-brand-green/[0.02] ${error ? 'border-brand-red' : 'border-black/10'}`}>
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
