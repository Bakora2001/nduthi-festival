import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ArrowRight, CheckCircle2, Phone,
  Lock, User, Award, MapPin, Bike, Sparkles, Loader2,
  AlertCircle, Receipt, RefreshCw, Upload, Image as ImageIcon, X
} from 'lucide-react';
import { api } from '../lib/api';
import { OFFICIAL_CATEGORIES, getCategoryFeeByObject } from '../data/categoriesData';

type Tab = 'login' | 'register';
type AccountType = 'VOTER' | 'PARTICIPANT';
type RegPaymentStep = 'idle' | 'initiating' | 'waiting_for_pin' | 'success' | 'failed';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const FEATURES = [
  'Vote for your favourite riders & motorcycles in Eldoret',
  'Track live results in real-time on the leaderboard',
  'Fast & Secure M-Pesa STK Push payment',
  'Instant voter confirmation & live leaderboard tally',
];

export function getCategoryFee(category: CategoryItem | undefined): number {
  return getCategoryFeeByObject(category);
}

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login');
  const [accountType, setAccountType] = useState<AccountType>('VOTER');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* ── Categories state for participant registration (initialized with 10 official categories) ── */
  const [categories, setCategories] = useState<CategoryItem[]>(OFFICIAL_CATEGORIES);

  /* ── Login state ── */
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPwd, setLoginPwd] = useState('');

  /* ── Register state ── */
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Participant state ── */
  const [categoryId, setCategoryId] = useState(OFFICIAL_CATEGORIES[0].id);
  const [county, setCounty] = useState('Eldoret, Kenya');
  const [stageName, setStageName] = useState('');
  const [bikeMake, setBikeMake] = useState('Boxer');
  const [bikeModel, setBikeModel] = useState('BM 150');
  const [registrationPlate, setRegistrationPlate] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Participant Payment Modal State ── */
  const [regPaymentStep, setRegPaymentStep] = useState<RegPaymentStep>('idle');
  const [regPaymentId, setRegPaymentId] = useState<string | null>(null);
  const [regPaymentFee, setRegPaymentFee] = useState<number>(1000);
  const [regPaymentError, setRegPaymentError] = useState<string | null>(null);
  const [regPaymentMpesaRef, setRegPaymentMpesaRef] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories dynamically from backend
    api.get('/categories')
      .then((res) => {
        const raw = res.data?.data || res.data;
        if (Array.isArray(raw) && raw.length > 0) {
          setCategories(raw);
          setCategoryId(raw[0].id);
        }
      })
      .catch((err) => console.log('Using default official categories:', err));
  }, []);

  const selectedCategoryObj = categories.find((c) => c.id === categoryId) || OFFICIAL_CATEGORIES[0];
  const currentParticipantFee = getCategoryFee(selectedCategoryObj);

  /* ── Handle Image Selection ── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      alert('Photo is too large. Please upload an image smaller than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        setLoading(false);
        window.location.href = '/';
      } else {
        // ── PARTICIPANT REGISTRATION WITH M-PESA PAYMENT (STK PUSH) ──
        const initRes = await api.post('/nominees/initiate-registration', {
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
          imageUrl: photoPreview || '/cat_motorcycle.jpg',
        });

        const data = initRes.data?.data || initRes.data;
        const paymentId = data.paymentId;
        const feeAmount = data.amount || currentParticipantFee;

        setRegPaymentId(paymentId);
        setRegPaymentFee(feeAmount);
        setRegPaymentStep('waiting_for_pin');
        setLoading(false);

        // Start Polling for Payment Confirmation
        let attempts = 0;
        const maxAttempts = 40; // 40 * 2s = 80s window

        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const checkRes = await api.get(`/nominees/check-registration/${paymentId}`);
            const checkData = checkRes.data?.data || checkRes.data;

            if (checkData.status === 'SUCCESS') {
              clearInterval(pollInterval);
              setRegPaymentStep('success');
              setRegPaymentMpesaRef(checkData.mpesaRef || 'M-PESA-CONFIRMED');

              if (checkData.accessToken) {
                localStorage.setItem('nduthi_access_token', checkData.accessToken);
              }
              if (checkData.user) {
                localStorage.setItem('nduthi_user', JSON.stringify(checkData.user));
              }
            } else if (checkData.status === 'FAILED') {
              clearInterval(pollInterval);
              setRegPaymentStep('failed');
              setRegPaymentError(checkData.reason || 'Payment was cancelled or timed out before PIN was entered.');
            } else if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
              setRegPaymentStep('failed');
              setRegPaymentError('Payment confirmation timed out. If you paid, please sign in.');
            }
          } catch (err: any) {
            if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
              setRegPaymentStep('failed');
              setRegPaymentError('Failed to verify payment status. Please try again.');
            }
          }
        }, 2000);
      }
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check your details and try again.';
      setApiError(msg);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left panel - Branding and Features */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-[#14231A] overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background flag banner image */}
        <img
          src="/hero_flag_bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#14231A]/95 via-[#14231A]/80 to-transparent pointer-events-none" />

        {/* Hero Motorcycle Accent Graphic */}
        <img
          src="/hero_motorcycle.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -bottom-6 -right-6 w-[85%] object-contain pointer-events-none select-none"
          style={{ mixBlendMode: 'luminosity', opacity: 0.35 }}
        />

        <div className="relative z-10">
          <a href="/" className="inline-block mb-10">
            <img src="/nduthi-logo.png" alt="Nduthi Festival & Awards Kenya" className="h-12 w-auto object-contain" />
          </a>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-bold tracking-wide uppercase mb-4">
            <Sparkles size={13} /> Official Platform • Eldoret, Kenya
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
                <span className="text-xs text-white/85 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-[11px] text-white/45 font-medium">
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
                ? 'Enter your phone number & password to sign in.'
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
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
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
                    <p className="text-[10px] text-brand-ink/50 leading-tight">Vote for your favorite riders</p>
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
                    <p className="text-[10px] text-brand-ink/50 leading-tight">Register to receive votes</p>
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
                <div className="space-y-3.5 p-4 rounded-2xl bg-brand-green/5 border border-brand-green/20">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-brand-green uppercase tracking-wide flex items-center gap-1.5">
                      <Award size={14} /> Participant Registration
                    </p>
                    <span className="bg-brand-green text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                      Fee: KES {currentParticipantFee.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-ink/70 mb-1">
                      Award Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs font-bold text-brand-ink bg-white border-brand-green/30 outline-none focus:border-brand-green"
                    >
                      {categories.map((c) => {
                        const fee = getCategoryFee(c);
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name} — (KES {fee.toLocaleString()})
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-[10px] text-brand-ink/50 mt-1">
                      • 001 Kenya, Rider of the Year, Best Motorcycle dealer: <strong>KES 1,000</strong><br />
                      • Best Rider group: <strong>KES 5,000</strong><br />
                      • Other categories: <strong>KES 500</strong>
                    </p>
                  </div>

                  {/* ── Optional Motorcycle Photo Upload ── */}
                  <div>
                    <label className="block text-[11px] font-bold text-brand-ink/70 mb-1">
                      Motorcycle / Rider Photo (Optional)
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {photoPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-brand-green/30 bg-white p-2 flex items-center gap-3">
                        <img
                          src={photoPreview}
                          alt="Uploaded motorcycle preview"
                          className="w-16 h-16 rounded-xl object-cover border border-black/10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-brand-ink truncate">Photo attached ✓</p>
                          <p className="text-[10px] text-brand-green font-semibold">Will be displayed on ballot</p>
                        </div>
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Remove photo"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-dashed border-brand-green/40 bg-white hover:bg-brand-green/5 transition-all text-xs font-bold text-brand-green"
                      >
                        <Upload size={14} />
                        <span>Upload Photo of Motorcycle / Rider</span>
                      </button>
                    )}
                    <p className="text-[10px] text-brand-ink/50 mt-1">
                      Upload clear photo of your motorcycle to appear on the awards voting page and leaderboard.
                    </p>
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
                    ? 'Processing...'
                    : accountType === 'VOTER'
                    ? 'Create Voter Account'
                    : `Register & Pay KES ${currentParticipantFee.toLocaleString()}`}
                </span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ────────────────── PARTICIPANT M-PESA STK PUSH MODAL ────────────────── */}
      <AnimatePresence>
        {regPaymentStep !== 'idle' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/10"
            >
              {/* Modal Header */}
              <div className="bg-[#076B29] p-6 text-white text-center relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🏍️</span>
                </div>
                <h3 className="font-display font-extrabold text-xl">Participant Registration</h3>
                <p className="text-xs text-white/80 mt-1">
                  Category: <strong className="text-[#F5C542]">{selectedCategoryObj?.name || 'Awards'}</strong>
                </p>
                <p className="text-xs text-white/90 mt-0.5">
                  Registration Fee: <strong className="text-[#F5C542] text-sm">KES {regPaymentFee.toLocaleString()}</strong>
                </p>
              </div>

              <div className="p-6">
                {/* 1. WAITING FOR M-PESA PIN */}
                {regPaymentStep === 'waiting_for_pin' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-brand-green/20 border-t-brand-green animate-spin" />
                      <span className="text-2xl">📲</span>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-brand-ink">Enter M-Pesa PIN on Your Phone</h4>
                      <p className="text-xs text-brand-ink/65 mt-1">
                        An STK Push prompt for <strong className="text-brand-ink font-bold">KES {regPaymentFee.toLocaleString()}</strong> has been sent to <strong className="text-brand-green font-bold">{phone}</strong>.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-center justify-center gap-2 font-medium">
                      <Loader2 size={15} className="animate-spin text-amber-700 shrink-0" />
                      <span>Waiting for payment confirmation from M-Pesa...</span>
                    </div>

                    <p className="text-[11px] text-brand-ink/50 leading-relaxed">
                      ⚠️ Note: Registration will be completed and your profile added to the awards immediately upon successful payment confirmation.
                    </p>
                  </div>
                )}

                {/* 2. SUCCESS CONFIRMATION */}
                {regPaymentStep === 'success' && (
                  <div className="text-center py-2 space-y-3.5 animate-in fade-in">
                    <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto text-brand-green">
                      <CheckCircle2 size={38} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-brand-ink">Registration Confirmed! 🎉</h4>
                      <p className="text-xs text-brand-ink/70 mt-0.5">
                        Your payment of <strong>KES {regPaymentFee.toLocaleString()}</strong> was received. You are now registered and ready to receive votes!
                      </p>
                    </div>

                    <div className="bg-brand-ink/[0.03] border border-black/10 rounded-2xl p-4 text-left space-y-2 text-xs shadow-inner">
                      <div className="flex items-center justify-between border-b border-black/5 pb-2">
                        <span className="text-brand-ink/60 flex items-center gap-1.5 font-bold">
                          <Receipt size={14} className="text-brand-green" /> M-Pesa Reference
                        </span>
                        <strong className="text-brand-green font-mono uppercase bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-md text-xs">
                          {regPaymentMpesaRef || 'M-PESA-CONFIRMED'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-ink/55">Participant Name:</span>
                        <strong className="text-brand-ink font-semibold">{fullName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-ink/55">Category:</span>
                        <strong className="text-brand-green font-bold">{selectedCategoryObj?.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-ink/55">Amount Paid:</span>
                        <strong className="text-brand-ink font-bold">KES {regPaymentFee.toLocaleString()}.00</strong>
                      </div>
                      <div className="flex justify-between items-center border-t border-black/5 pt-2">
                        <span className="text-brand-ink/55">Status:</span>
                        <span className="text-brand-green bg-brand-green/10 px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 size={11} /> REGISTERED & ACTIVE
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { window.location.href = '/categories'; }}
                      className="w-full py-3.5 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark shadow-lg transition-all"
                    >
                      View Category & Start Receiving Votes →
                    </button>
                  </div>
                )}

                {/* 3. FAILED */}
                {regPaymentStep === 'failed' && (
                  <div className="text-center py-4 space-y-3 animate-in fade-in">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                      <AlertCircle size={32} />
                    </div>
                    <h4 className="font-display font-bold text-base text-brand-ink">Payment Incomplete</h4>
                    <p className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200/50 leading-relaxed">
                      {regPaymentError || 'The M-Pesa prompt was cancelled or timed out. Registration cannot be completed without confirmed payment.'}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setRegPaymentStep('idle')}
                        className="flex-1 py-3 rounded-xl bg-black/5 text-brand-ink text-xs font-bold hover:bg-black/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { setRegPaymentStep('idle'); handleRegister(e); }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#076B29] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#05521F] transition-all"
                      >
                        <RefreshCw size={13} /> Retry Payment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
