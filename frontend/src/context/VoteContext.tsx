import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSocket, SOCKET_EVENTS } from '../lib/socket';
import { api } from '../lib/api';
import { OFFICIAL_CATEGORIES } from '../data/categoriesData';

// Flag to control voting status (Set to false to allow participants to register first)
export const VOTING_ENABLED = false;
export const VOTE_UNIT_PRICE_KES = 10; // 10 KES per vote

export interface NomineeVote {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  votes: number;
  rank: number;
  img?: string;
  county?: string;
  ownerName?: string;
  make?: string;
  model?: string;
  registrationPlate?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  nomineeCount?: number;
  totalVotes?: number;
}

export type PaymentStatusStep = 'idle' | 'initiating' | 'waiting_for_pin' | 'success' | 'failed';

interface VoteContextType {
  nominees: NomineeVote[];
  categories: CategoryItem[];
  totalVotes: number;
  loading: boolean;
  isVotingEnabled: boolean;
  castVote: (nomineeId: string, nomineeName?: string, categoryName?: string) => void;
  lastVotedNominee: string | null;
  toastMessage: string | null;
  toastType: 'success' | 'warning' | 'error' | 'info' | null;
  clearToast: () => void;
  userVotedIds: string[];
  refetchData: () => void;

  /* ── M-Pesa Modal State ── */
  paymentModalOpen: boolean;
  selectedNomineeForPayment: NomineeVote | null;
  closePaymentModal: () => void;
  submitMpesaPayment: (phone: string, amount: number) => Promise<void>;
  paymentLoading: boolean;
  paymentStep: PaymentStatusStep;
  paymentSuccessMessage: string | null;
  paymentErrorMessage: string | null;
  payerPhone: string;
  paymentMpesaRef: string | null;
  paidAmount: number;
  votesCastCount: number;
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

const DEFAULT_CATEGORY_ITEMS: CategoryItem[] = OFFICIAL_CATEGORIES.map((c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description,
  icon: c.icon,
  coverImage: c.coverImage,
  nomineeCount: 0,
  totalVotes: 0,
}));

export const VoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nominees, setNominees] = useState<NomineeVote[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORY_ITEMS);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [lastVotedNominee, setLastVotedNominee] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error' | 'info' | null>(null);
  const [userVotedIds, setUserVotedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nduthi_user_votes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  /* ── M-Pesa Modal State ── */
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedNomineeForPayment, setSelectedNomineeForPayment] = useState<NomineeVote | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<PaymentStatusStep>('idle');
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null);
  const [payerPhone, setPayerPhone] = useState<string>('');
  const [paymentMpesaRef, setPaymentMpesaRef] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number>(10);
  const [votesCastCount, setVotesCastCount] = useState<number>(1);

  const clearToast = () => {
    setToastMessage(null);
    setToastType(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, nomRes] = await Promise.all([
        api.get('/categories').catch(() => ({ data: [] })),
        api.get('/nominees').catch(() => ({ data: [] })),
      ]);

      const rawCategories = Array.isArray(catRes.data)
        ? catRes.data
        : (catRes.data?.data || []);

      if (rawCategories.length > 0) {
        const formattedCategories: CategoryItem[] = rawCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.id,
          description: c.description,
          icon: c.icon || '🏆',
          coverImage: c.coverImage || '/cat_rider_awards.jpg',
          nomineeCount: c._count?.nominees ?? (c.nominees ? c.nominees.length : 0),
          totalVotes: c.totalVotes || 0,
        }));
        setCategories(formattedCategories);
      } else {
        setCategories(DEFAULT_CATEGORY_ITEMS);
      }

      const rawNominees = Array.isArray(nomRes.data)
        ? nomRes.data
        : (nomRes.data?.data || []);

      const formattedNominees: NomineeVote[] = rawNominees.map((n: any, idx: number) => ({
        id: n.id,
        name: n.name || `${n.user?.firstName || ''} ${n.user?.lastName || ''}`.trim() || 'Nominee',
        categoryId: n.categoryId || '',
        categoryName: n.category?.name || 'Awards Category',
        votes: n.voteCount || 0,
        rank: idx + 1,
        img: n.imageUrl || n.img || '/cat_rider_awards.jpg',
        county: n.county || 'Kenya',
        ownerName: n.user ? `${n.user.firstName} ${n.user.lastName}` : (n.ownerName || 'Rider'),
        make: n.motorcycle?.make || n.make || 'Boda Boda',
        model: n.motorcycle?.model || n.model || '',
        registrationPlate: n.motorcycle?.registrationPlate || n.registrationPlate || '',
      }));

      formattedNominees.sort((a, b) => b.votes - a.votes);
      formattedNominees.forEach((n, idx) => { n.rank = idx + 1; });

      setNominees(formattedNominees);
      const sumVotes = formattedNominees.reduce((acc, curr) => acc + curr.votes, 0);
      setTotalVotes(sumVotes);
    } catch (err) {
      console.error('Failed to load live data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = getSocket();
    const handleVoteCast = (data: any) => {
      setNominees((prev) => {
        const updated = prev.map((nominee) => {
          if (nominee.id === data.nomineeId) {
            const added = data.votesAdded || 1;
            const newVotes = (data.voteCount !== undefined) ? data.voteCount : nominee.votes + added;
            return { ...nominee, votes: newVotes };
          }
          return nominee;
        });
        updated.sort((a, b) => b.votes - a.votes);
        updated.forEach((n, idx) => { n.rank = idx + 1; });
        return updated;
      });

      const addedTotal = data.votesAdded || 1;
      setTotalVotes((prev) => prev + addedTotal);
    };

    socket.on(SOCKET_EVENTS.VOTE_CAST, handleVoteCast);

    return () => {
      socket.off(SOCKET_EVENTS.VOTE_CAST, handleVoteCast);
    };
  }, []);

  const castVote = (nomineeId: string, targetName?: string, categoryName?: string) => {
    // If voting is disabled, show informative notice
    if (!VOTING_ENABLED) {
      setToastType('info');
      setToastMessage('⏳ Voting is currently closed while participant registration is ongoing. Register yourself or your bike to be nominated!');
      return;
    }

    const target = nominees.find((n) => n.id === nomineeId);

    // 1. Check if user is logged in
    const token = localStorage.getItem('nduthi_access_token');
    if (!token) {
      setToastType('warning');
      setToastMessage('🔒 Please create an account or sign in to vote.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    // 2. Open payment modal to initiate M-Pesa payment
    const selectedNominee = target || {
      id: nomineeId,
      name: targetName || 'Nominee',
      categoryId: '',
      categoryName: categoryName || 'Category',
      votes: 0,
      rank: 1,
    };

    setSelectedNomineeForPayment(selectedNominee);
    setPaymentSuccessMessage(null);
    setPaymentErrorMessage(null);
    setPaymentMpesaRef(null);
    setPaymentStep('idle');
    setPaymentModalOpen(true);
  };

  const submitMpesaPayment = async (phone: string, amount: number) => {
    if (!VOTING_ENABLED) {
      setToastType('warning');
      setToastMessage('⏳ Voting is currently closed while participant registration is ongoing.');
      return;
    }

    if (!selectedNomineeForPayment) return;

    const validatedAmount = Math.max(VOTE_UNIT_PRICE_KES, Number(amount) || VOTE_UNIT_PRICE_KES);
    const votesToCount = Math.floor(validatedAmount / VOTE_UNIT_PRICE_KES);

    setPaidAmount(validatedAmount);
    setVotesCastCount(votesToCount);
    setPaymentLoading(true);
    setPaymentStep('initiating');
    setPaymentSuccessMessage(null);
    setPaymentErrorMessage(null);
    setPaymentMpesaRef(null);
    setPayerPhone(phone);

    try {
      const initRes = await api.post('/payments/initiate', {
        nomineeId: selectedNomineeForPayment.id,
        phone,
        amount: validatedAmount,
        method: 'MPESA',
      });

      const paymentData = initRes.data?.data || initRes.data;
      const paymentId = paymentData.paymentId;

      setPaymentStep('waiting_for_pin');
      setToastType('info');
      setToastMessage(`📲 M-Pesa STK Push prompt for KES ${validatedAmount.toLocaleString()} (${votesToCount} Votes) sent to ${phone}! Enter PIN.`);

      // Poll real-time status from backend
      let attempts = 0;
      const maxAttempts = 35; // 35 * 2s = 70s window

      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await api.get(`/payments/${paymentId}/check?nomineeId=${selectedNomineeForPayment.id}`);
          const data = statusRes.data?.data || statusRes.data;

          if (data.status === 'SUCCESS') {
            clearInterval(pollInterval);
            setPaymentLoading(false);
            setPaymentStep('success');
            setPaymentMpesaRef(data.mpesaRef || 'M-PESA-STK-CONFIRMED');
            setPaymentSuccessMessage(`🎉 Payment of KES ${validatedAmount.toLocaleString()} confirmed via M-Pesa! ${votesToCount} votes recorded for ${selectedNomineeForPayment.name}.`);
            setToastType('success');
            setToastMessage(`🎉 Payment confirmed! (Ref: ${data.mpesaRef || 'M-Pesa'}). ${votesToCount} votes counted for ${selectedNomineeForPayment.name}!`);

            // Update local state tally
            setNominees((prev) => {
              const updated = prev.map((n) => {
                if (n.id === selectedNomineeForPayment.id) {
                  return { ...n, votes: n.votes + votesToCount };
                }
                return n;
              });
              updated.sort((a, b) => b.votes - a.votes);
              updated.forEach((n, idx) => { n.rank = idx + 1; });
              return updated;
            });

            setTotalVotes((t) => t + votesToCount);
            setLastVotedNominee(selectedNomineeForPayment.name);

            const newVoted = [...userVotedIds, selectedNomineeForPayment.id];
            setUserVotedIds(newVoted);
            localStorage.setItem('nduthi_user_votes', JSON.stringify(newVoted));

            // Emit WebSocket event
            const socket = getSocket();
            socket.emit(SOCKET_EVENTS.VOTE_CAST, {
              nomineeId: selectedNomineeForPayment.id,
              votesAdded: votesToCount,
            });
          } else if (data.status === 'FAILED') {
            clearInterval(pollInterval);
            setPaymentLoading(false);
            setPaymentStep('failed');
            setPaymentErrorMessage(data.reason || 'M-Pesa transaction was cancelled or timed out on your phone. No funds were deducted.');
            setToastType('error');
            setToastMessage(`⚠️ Payment not completed. No funds were deducted.`);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setPaymentLoading(false);
            setPaymentStep('failed');
            setPaymentErrorMessage('Verification timed out. If you already entered your PIN, your vote will be counted automatically once Safaricom processes the transaction.');
            setToastType('warning');
            setToastMessage(`⌛ Payment verification timed out. Vote will update once confirmed.`);
          }
        } catch {
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setPaymentLoading(false);
            setPaymentStep('failed');
            setPaymentErrorMessage('Network check timed out.');
          }
        }
      }, 2000);

    } catch (err: any) {
      setPaymentLoading(false);
      setPaymentStep('failed');
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to initiate M-Pesa STK Push. Please verify your phone number and try again.';
      setPaymentErrorMessage(msg);
      setToastType('error');
      setToastMessage(`⚠️ ${msg}`);
    }
  };

  const closePaymentModal = () => {
    if (!paymentLoading || paymentStep === 'failed' || paymentStep === 'success') {
      setPaymentModalOpen(false);
      setSelectedNomineeForPayment(null);
      setPaymentStep('idle');
      setPaymentErrorMessage(null);
      setPaymentMpesaRef(null);
    }
  };

  return (
    <VoteContext.Provider
      value={{
        nominees,
        categories,
        totalVotes,
        loading,
        isVotingEnabled: VOTING_ENABLED,
        castVote,
        lastVotedNominee,
        toastMessage,
        toastType,
        clearToast,
        userVotedIds,
        refetchData: fetchData,

        /* Payment modal */
        paymentModalOpen,
        selectedNomineeForPayment,
        closePaymentModal,
        submitMpesaPayment,
        paymentLoading,
        paymentStep,
        paymentSuccessMessage,
        paymentErrorMessage,
        payerPhone,
        paymentMpesaRef,
        paidAmount,
        votesCastCount,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};

export const useVote = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error('useVote must be used within a VoteProvider');
  }
  return context;
};
