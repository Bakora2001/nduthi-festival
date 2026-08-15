import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, CheckCircle2, ShieldCheck, ArrowRight, Loader2, AlertCircle, RefreshCw, Receipt, Mail, User, Coins } from 'lucide-react';
import { useVote } from '../context/VoteContext';

const PRESET_AMOUNTS = [10, 50, 100, 200, 500, 1000];

export default function PaymentModal() {
  const {
    paymentModalOpen,
    selectedNomineeForPayment,
    closePaymentModal,
    submitMpesaPayment,
    paymentLoading,
    paymentStep,
    paymentErrorMessage,
    payerPhone,
    paymentMpesaRef,
    paidAmount,
    votesCastCount,
  } = useVote();

  const [phone, setPhone] = useState('');
  const [voteAmount, setVoteAmount] = useState<number>(10);
  const [customAmountStr, setCustomAmountStr] = useState<string>('10');
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ email?: string; firstName?: string; lastName?: string; phone?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nduthi_user');
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        if (u.phone) setPhone(u.phone);
      }
    } catch {
      // ignore
    }
  }, [paymentModalOpen]);

  if (!paymentModalOpen || !selectedNomineeForPayment) return null;

  const currentVotesCount = Math.max(1, Math.floor(voteAmount / 10));

  const handleAmountSelect = (amt: number) => {
    setVoteAmount(amt);
    setCustomAmountStr(String(amt));
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmountStr(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setVoteAmount(parsed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^(\+254|0)\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid Kenyan phone number (e.g. 0712345678 or +254712345678)');
      return;
    }

    if (!voteAmount || voteAmount < 10) {
      setError('Minimum vote amount is KES 10 (1 vote = KES 10)');
      return;
    }

    await submitMpesaPayment(cleanPhone, voteAmount);
  };

  const voterDisplayName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Registered Voter' : 'Registered Voter';
  const voterEmailAddress = currentUser?.email || 'voter@nduthiawards.co.ke';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/10"
        >
          {/* Header */}
          <div className="bg-[#076B29] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <button
              onClick={closePaymentModal}
              disabled={paymentStep === 'waiting_for_pin'}
              className="absolute top-4 right-4 text-white/70 hover:text-white disabled:opacity-20"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-display font-extrabold text-xl">Cast Your Vote</h3>
            <p className="text-xs text-white/80 mt-1">
              Rate: <strong className="text-[#F5C542]">KES 10 per Vote</strong>
            </p>
          </div>

          <div className="p-6">
            {/* Nominee details banner */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-brand-green/5 border border-brand-green/15 mb-5">
              <img
                src={selectedNomineeForPayment.img || '/cat_rider_awards.jpg'}
                alt={selectedNomineeForPayment.name}
                className="w-12 h-12 rounded-xl object-cover border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-brand-green uppercase tracking-wide">
                  {selectedNomineeForPayment.categoryName}
                </p>
                <h4 className="font-bold text-sm text-brand-ink truncate">
                  {selectedNomineeForPayment.name}
                </h4>
                <p className="text-[11px] text-brand-ink/50 truncate">
                  {selectedNomineeForPayment.county || 'Kenya'} • {selectedNomineeForPayment.make || 'Boda Boda'}
                </p>
              </div>
            </div>

            {/* State 1: SUCCESS RECEIPT */}
            {paymentStep === 'success' && (
              <div className="text-center py-2 space-y-3.5 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto text-brand-green">
                  <CheckCircle2 size={38} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-brand-ink">M-Pesa Payment Confirmed! 🎉</h4>
                  <p className="text-xs text-brand-ink/70 mt-0.5">
                    Your payment of <strong>KES {paidAmount.toLocaleString()}.00</strong> was received and <strong>{votesCastCount} vote(s)</strong> have been recorded.
                  </p>
                </div>

                {/* Receipt summary box */}
                <div className="bg-brand-ink/[0.03] border border-black/10 rounded-2xl p-4 text-left space-y-2.5 text-xs shadow-inner">
                  <div className="flex items-center justify-between border-b border-black/5 pb-2">
                    <span className="text-brand-ink/60 flex items-center gap-1.5 font-bold">
                      <Receipt size={14} className="text-brand-green" /> M-Pesa Transaction Ref
                    </span>
                    <strong className="text-brand-green font-mono uppercase bg-brand-green/10 border border-brand-green/20 px-2.5 py-0.5 rounded-md text-xs tracking-wider">
                      {paymentMpesaRef || 'M-PESA-CONFIRMED'}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-brand-ink/55 flex items-center gap-1">
                      <User size={12} className="text-brand-ink/40" /> Voter Name:
                    </span>
                    <strong className="text-brand-ink font-semibold">{voterDisplayName}</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-brand-ink/55 flex items-center gap-1">
                      <Mail size={12} className="text-brand-ink/40" /> Signed-In Email:
                    </span>
                    <strong className="text-brand-ink font-mono text-[11px] truncate max-w-[200px]">{voterEmailAddress}</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-brand-ink/55 flex items-center gap-1">
                      <Phone size={12} className="text-brand-ink/40" /> M-Pesa Phone:
                    </span>
                    <strong className="text-brand-ink font-mono text-[11px]">{payerPhone || phone}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-brand-ink/55">Candidate Voted:</span>
                    <strong className="text-brand-green font-bold">{selectedNomineeForPayment.name}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-brand-ink/55">Category:</span>
                    <strong className="text-brand-ink">{selectedNomineeForPayment.categoryName}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-brand-ink/55">Votes Added:</span>
                    <strong className="text-brand-green font-black">{votesCastCount} Votes</strong>
                  </div>

                  <div className="flex justify-between border-t border-black/5 pt-2">
                    <span className="text-brand-ink/55">Amount Paid:</span>
                    <strong className="text-brand-ink font-bold text-sm">KES {paidAmount.toLocaleString()}.00</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-brand-ink/55">Payment Status:</span>
                    <span className="text-brand-green bg-brand-green/10 px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 size={11} /> PAID & RECORDED
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-brand-green/5 border border-brand-green/20 text-left flex items-start gap-2.5">
                  <Mail size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <div className="text-[11px] text-brand-ink/70 leading-relaxed">
                    A confirmation receipt has been sent to your registered account: <strong className="text-brand-ink">{voterEmailAddress}</strong>.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="w-full py-3.5 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark shadow-lg transition-all duration-150"
                >
                  Done & View Results
                </button>
              </div>
            )}

            {/* State 2: WAITING FOR M-PESA PIN */}
            {paymentStep === 'waiting_for_pin' && (
              <div className="text-center py-6 space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-green/20 border-t-brand-green animate-spin" />
                  <span className="text-2xl">📲</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-brand-ink">Enter M-Pesa PIN on Your Phone</h4>
                  <p className="text-xs text-brand-ink/65 mt-1">
                    An STK prompt for <strong className="text-brand-green font-bold">KES {voteAmount.toLocaleString()} ({currentVotesCount} Votes)</strong> has been sent to <strong className="text-brand-ink">{payerPhone || phone}</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-center justify-center gap-2">
                  <Loader2 size={15} className="animate-spin text-amber-700 shrink-0" />
                  <span>Waiting for M-Pesa confirmation callback...</span>
                </div>

                <p className="text-[11px] text-brand-ink/40">
                  Your {currentVotesCount} vote(s) will only be counted once the payment is confirmed.
                </p>
              </div>
            )}

            {/* State 3: FAILED */}
            {paymentStep === 'failed' && (
              <div className="text-center py-4 space-y-3 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                  <AlertCircle size={32} />
                </div>
                <h4 className="font-display font-bold text-base text-brand-ink">Payment Incomplete</h4>
                <p className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200/50 leading-relaxed">
                  {paymentErrorMessage || 'The payment prompt was cancelled or timed out. No vote was counted and no money was deducted.'}
                </p>
                <p className="text-[11px] text-brand-ink/50">
                  A notification has also been sent to your email.
                </p>

                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                  className="w-full flex items-center justify-center gap-2 bg-[#076B29] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#05521F] transition-all"
                >
                  <RefreshCw size={14} /> Try Paying Again
                </button>
              </div>
            )}

            {/* State 4: IDLE / FORM */}
            {(paymentStep === 'idle' || paymentStep === 'initiating') && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vote Amount Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-brand-ink/70">
                      Select or Enter Voting Amount (KES) *
                    </label>
                    <span className="text-[11px] font-black text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                      {currentVotesCount} {currentVotesCount === 1 ? 'Vote' : 'Votes'}
                    </span>
                  </div>

                  {/* Preset chips */}
                  <div className="grid grid-cols-3 gap-2 mb-2.5">
                    {PRESET_AMOUNTS.map((amt) => {
                      const votes = Math.floor(amt / 10);
                      const isSelected = voteAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAmountSelect(amt)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            isSelected
                              ? 'border-brand-green bg-brand-green text-white shadow-sm'
                              : 'border-black/10 bg-white text-brand-ink hover:border-black/20'
                          }`}
                        >
                          <div>KES {amt.toLocaleString()}</div>
                          <div className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-brand-ink/50'}`}>
                            {votes} {votes === 1 ? 'Vote' : 'Votes'}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom input */}
                  <div className="flex items-center gap-2 border rounded-xl px-3.5 py-2.5 bg-brand-ink/[0.02] border-black/10 focus-within:border-brand-green">
                    <Coins size={16} className="text-brand-ink/40 shrink-0" />
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={customAmountStr}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="Enter custom amount (e.g. 300)"
                      disabled={paymentLoading}
                      className="w-full bg-transparent text-sm text-brand-ink font-bold outline-none placeholder:text-brand-ink/30"
                    />
                    <span className="text-xs font-semibold text-brand-ink/40 shrink-0">KES</span>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-brand-ink/70 mb-1.5">
                    M-Pesa Phone Number *
                  </label>
                  <div className="flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-brand-ink/[0.02] border-black/10 focus-within:border-brand-green">
                    <Phone size={16} className="text-brand-ink/40 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712345678 or 0700000000"
                      disabled={paymentLoading}
                      className="w-full bg-transparent text-sm text-brand-ink font-semibold outline-none placeholder:text-brand-ink/30"
                    />
                  </div>
                  {error && <p className="text-[11px] text-brand-red font-semibold mt-1">{error}</p>}
                </div>

                <div className="p-3 rounded-xl bg-black/[0.03] text-[11px] text-brand-ink/65 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <span>
                    When you click below, an M-Pesa STK Push prompt for <strong>KES {voteAmount.toLocaleString()}</strong> ({currentVotesCount} votes) will be sent to your phone. Enter your PIN to complete.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#076B29] text-white text-sm font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#05521F] transition-all duration-200 disabled:opacity-60"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending M-Pesa Prompt...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed & Pay KES {voteAmount.toLocaleString()} ({currentVotesCount} {currentVotesCount === 1 ? 'Vote' : 'Votes'})</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
