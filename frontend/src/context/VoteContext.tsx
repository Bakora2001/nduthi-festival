import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSocket, SOCKET_EVENTS } from '../lib/socket';
import { liveResultsPreview as initialNominees, stats as initialStats } from '../data/mockData';

export interface NomineeVote {
  id: string;
  name: string;
  categoryName: string;
  votes: number;
  rank: number;
  img?: string;
}

interface VoteContextType {
  nominees: NomineeVote[];
  totalVotes: number;
  castVote: (nomineeId: string, nomineeName?: string, categoryName?: string) => void;
  lastVotedNominee: string | null;
  toastMessage: string | null;
  toastType: 'success' | 'warning' | 'error' | null;
  clearToast: () => void;
  userVotedIds: string[];
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

const NOMINEE_IMAGES: Record<string, string> = {
  n1: '/nominee_rider_1.jpg',
  n2: '/nominee_bike_2.jpg',
  n3: '/nominee_rider_3.jpg',
  n4: '/nominee_riders_club.jpg',
};

export const VoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nominees, setNominees] = useState<NomineeVote[]>(() =>
    initialNominees.map((n) => ({
      ...n,
      img: NOMINEE_IMAGES[n.id] || '/cat_rider_awards.jpg',
    }))
  );

  const [totalVotes, setTotalVotes] = useState(initialStats.totalVotes);
  const [lastVotedNominee, setLastVotedNominee] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error' | null>(null);

  // Track votes cast by the current user locally
  const [userVotedIds, setUserVotedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nduthi_user_votes') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const socket = getSocket();

    const handleVoteEvent = (data: { nomineeId: string; newVoteCount?: number }) => {
      setNominees((prev) => {
        const updated = prev.map((n) => {
          if (n.id === data.nomineeId) {
            return { ...n, votes: data.newVoteCount ?? n.votes + 1 };
          }
          return n;
        });

        return updated
          .sort((a, b) => b.votes - a.votes)
          .map((n, index) => ({ ...n, rank: index + 1 }));
      });

      setTotalVotes((t) => t + 1);
    };

    socket.on(SOCKET_EVENTS.VOTE_CAST, handleVoteEvent);

    return () => {
      socket.off(SOCKET_EVENTS.VOTE_CAST, handleVoteEvent);
    };
  }, []);

  const castVote = (nomineeId: string, nomineeName?: string, categoryName?: string) => {
    const targetName = nomineeName || nominees.find((n) => n.id === nomineeId)?.name || 'Nominee';

    // 1. Check if user is logged in
    const currentUser = localStorage.getItem('nduthi_user') || localStorage.getItem('nduthi_access_token');
    if (!currentUser) {
      setToastType('warning');
      setToastMessage(`🔒 Login Required: Please sign in or create an account to vote for ${targetName}!`);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1800);
      return;
    }

    // 2. Prevent duplicate voting
    if (userVotedIds.includes(nomineeId)) {
      setToastType('error');
      setToastMessage(`⚠️ Single Vote Policy: You have already voted for ${targetName}. Duplicate voting is disabled for fairness!`);
      return;
    }

    // 3. Register the vote
    setNominees((prev) => {
      const updated = prev.map((n) => {
        if (n.id === nomineeId) {
          return { ...n, votes: n.votes + 1 };
        }
        return n;
      });

      return updated
        .sort((a, b) => b.votes - a.votes)
        .map((n, index) => ({ ...n, rank: index + 1 }));
    });

    setTotalVotes((t) => t + 1);
    setLastVotedNominee(targetName);

    const newVoted = [...userVotedIds, nomineeId];
    setUserVotedIds(newVoted);
    localStorage.setItem('nduthi_user_votes', JSON.stringify(newVoted));

    setToastType('success');
    setToastMessage(`🎉 Vote Successfully Cast for ${targetName}${categoryName ? ` (${categoryName})` : ''}!`);

    // 4. Emit WebSocket event to update all clients live
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.VOTE_CAST, { nomineeId });
  };

  const clearToast = () => {
    setToastMessage(null);
    setToastType(null);
  };

  return (
    <VoteContext.Provider
      value={{
        nominees,
        totalVotes,
        castVote,
        lastVotedNominee,
        toastMessage,
        toastType,
        clearToast,
        userVotedIds,
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
