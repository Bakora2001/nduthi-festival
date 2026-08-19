import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Bike, Trophy, Users, Cog, Camera, Star, ChevronLeft, ChevronRight,
  Vote as VoteIcon, ZoomIn
} from 'lucide-react';
import { NomineeVote, CategoryItem } from '../context/VoteContext';
import ImageModal, { ImageModalData } from './ImageModal';

const CATEGORY_ICONS: Record<string, string> = {
  rider: '🏍️',
  trophy: '🏆',
  club: '👥',
  industry: '🔧',
  camera: '📸',
  star: '⭐',
  bike: '🏍️',
  motorcycle: '🏍️',
  sport: '🏁',
  cruiser: '🛵',
  scooter: '🛴',
  other: '🔧',
};

// Ribbon Medal SVGs matching the uploaded design
function RibbonMedal({ rank }: { rank: 1 | 2 | 3 }) {
  if (rank === 1) {
    return (
      <div className="flex flex-col items-center mb-1">
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Blue Ribbon */}
          <path d="M10 0L17 12L24 0H30L20 18L26 30H19L17 25L15 30H8L14 18L4 0H10Z" fill="#3B82F6" />
          <path d="M13 0L17 8L21 0H25L18 14L22 24H18L17 21L16 24H12L16 14L9 0H13Z" fill="#2563EB" />
          {/* Gold Coin */}
          <circle cx="17" cy="27" r="11" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="17" cy="27" r="8.5" fill="#FBBF24" />
          {/* Number 1 */}
          <text x="17" y="31.5" textAnchor="middle" fill="#78350F" fontSize="11" fontWeight="900" fontFamily="sans-serif">1</text>
        </svg>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="flex flex-col items-center mb-1">
        <svg width="30" height="38" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Blue Ribbon */}
          <path d="M10 0L17 12L24 0H30L20 18L26 30H19L17 25L15 30H8L14 18L4 0H10Z" fill="#60A5FA" />
          <path d="M13 0L17 8L21 0H25L18 14L22 24H18L17 21L16 24H12L16 14L9 0H13Z" fill="#3B82F6" />
          {/* Silver Coin */}
          <circle cx="17" cy="27" r="10" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="17" cy="27" r="7.5" fill="#CBD5E1" />
          {/* Number 2 */}
          <text x="17" y="31" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="900" fontFamily="sans-serif">2</text>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-1">
      <svg width="30" height="38" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Blue Ribbon */}
        <path d="M10 0L17 12L24 0H30L20 18L26 30H19L17 25L15 30H8L14 18L4 0H10Z" fill="#60A5FA" />
        <path d="M13 0L17 8L21 0H25L18 14L22 24H18L17 21L16 24H12L16 14L9 0H13Z" fill="#3B82F6" />
        {/* Bronze Coin */}
        <circle cx="17" cy="27" r="10" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
        <circle cx="17" cy="27" r="7.5" fill="#F59E0B" />
        {/* Number 3 */}
        <text x="17" y="31" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="900" fontFamily="sans-serif">3</text>
      </svg>
    </div>
  );
}

interface PodiumLeaderboardProps {
  categories: CategoryItem[];
  nominees: NomineeVote[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  isVotingEnabled: boolean;
  onCastVote: (nomineeId: string, name?: string, categoryName?: string) => void;
}

export default function PodiumLeaderboard({
  categories,
  nominees,
  selectedCategoryId,
  onSelectCategory,
  isVotingEnabled,
  onCastVote,
}: PodiumLeaderboardProps) {
  const [selectedImageNominee, setSelectedImageNominee] = useState<ImageModalData | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter and sort nominees for current selection
  const filteredNominees = (
    selectedCategoryId
      ? nominees.filter((n) => n.categoryId === selectedCategoryId)
      : nominees
  ).sort((a, b) => b.votes - a.votes);

  // Re-assign ranks 1..N based on current filtered order
  const rankedNominees = filteredNominees.map((n, idx) => ({
    ...n,
    currentRank: idx + 1,
  }));

  // Top 3 Podium participants:
  // Layout in the reference image: [2nd Place (Left)] - [1st Place (Center)] - [3rd Place (Right)]
  const firstPlace = rankedNominees[0];  // Center (Leader)
  const secondPlace = rankedNominees[1]; // Left
  const thirdPlace = rankedNominees[2];  // Right

  // Rank 4 and onwards
  const remainingNominees = rankedNominees.slice(3);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const openImageModal = (nom: NomineeVote) => {
    setSelectedImageNominee({
      imageUrl: nom.img || '/cat_rider_awards.jpg',
      name: nom.name,
      categoryName: nom.categoryName,
      county: nom.county,
      make: nom.make,
      model: nom.model,
      registrationPlate: nom.registrationPlate,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER TITLE & SUBTITLE
      ───────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          Nduthi Awards
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
          Vote for your favorite nduthi! Register your bike or cast your votes now.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HORIZONTAL CATEGORIES PILLS (Exact design as image)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center">
        {/* Left Arrow on overflow */}
        <button
          onClick={() => scrollCategories('left')}
          className="hidden sm:flex absolute -left-4 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2.5 overflow-x-auto py-2 px-2 scrollbar-none w-full max-w-full justify-start sm:justify-center scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* All Categories Tab */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedCategoryId === null
                ? 'bg-[#E5A914] text-white font-bold shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>🏁</span>
            <span>All Categories</span>
            <span className={`text-[11px] ${selectedCategoryId === null ? 'text-white/90 font-bold' : 'text-gray-400'}`}>
              ({nominees.length})
            </span>
          </button>

          {/* Category Tabs */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count = nominees.filter((n) => n.categoryId === cat.id).length;
            const iconEmoji = CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS[cat.icon || ''] || '🏆';

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#E5A914] text-white font-bold shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{iconEmoji}</span>
                <span>{cat.name}</span>
                <span className={`text-[11px] ${isSelected ? 'text-white/90 font-bold' : 'text-gray-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow on overflow */}
        <button
          onClick={() => scrollCategories('right')}
          className="hidden sm:flex absolute -right-4 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TOP 3 PODIUM CARDS (Exact match of attached screenshot)
          [ 2nd Place (Left) ] - [ 1st Place (Center - Leader) ] - [ 3rd Place (Right) ]
      ───────────────────────────────────────────────────────────── */}
      {rankedNominees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 items-end pt-4 max-w-3xl mx-auto">
          {/* ── #2 SILVER (2nd Place - Left) ── */}
          {secondPlace ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="bg-white rounded-[22px] border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center relative hover:shadow-md transition-shadow"
            >
              {/* Ribbon Medal #2 */}
              <RibbonMedal rank={2} />

              {/* Circular Avatar */}
              <div
                onClick={() => openImageModal(secondPlace)}
                className="relative cursor-pointer group my-2.5"
                title="Click to view photo"
              >
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#FBBF24]">
                  <img
                    src={secondPlace.img || '/cat_rider_awards.jpg'}
                    alt={secondPlace.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <ZoomIn size={16} />
                </div>
              </div>

              {/* Name */}
              <h3
                onClick={() => openImageModal(secondPlace)}
                className="text-base font-bold text-[#111827] mt-1 cursor-pointer hover:text-[#E5A914] transition-colors leading-tight"
              >
                {secondPlace.name}
              </h3>

              {/* Username / Handle */}
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-full">
                @{secondPlace.name.toLowerCase().replace(/\s+/g, '_')}
              </p>

              {/* Votes */}
              <p className="text-xs font-semibold text-gray-500 mt-2">
                {secondPlace.votes} votes
              </p>

              {/* Vote button if voting enabled */}
              {isVotingEnabled && (
                <button
                  onClick={() => onCastVote(secondPlace.id, secondPlace.name, secondPlace.categoryName)}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-[#E5A914] text-white hover:bg-[#d49b10] transition-colors flex items-center justify-center gap-1"
                >
                  <VoteIcon size={12} /> Vote
                </button>
              )}
            </motion.div>
          ) : (
            <div className="hidden sm:block" />
          )}

          {/* ── #1 GOLD (1st Place / Champion - Center) ── */}
          {firstPlace && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-[#FEFBF2] rounded-[24px] border-2 border-[#F5C542] shadow-md p-7 flex flex-col items-center text-center relative hover:shadow-lg transition-shadow sm:-translate-y-3"
            >
              {/* Ribbon Medal #1 */}
              <RibbonMedal rank={1} />

              {/* Circular Avatar */}
              <div
                onClick={() => openImageModal(firstPlace)}
                className="relative cursor-pointer group my-2.5"
                title="Click to view photo"
              >
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-full overflow-hidden border-3 border-white shadow-lg bg-[#F59E0B]">
                  <img
                    src={firstPlace.img || '/cat_rider_awards.jpg'}
                    alt={firstPlace.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <ZoomIn size={18} />
                </div>
              </div>

              {/* Name */}
              <h3
                onClick={() => openImageModal(firstPlace)}
                className="text-lg font-extrabold text-[#111827] mt-1 cursor-pointer hover:text-[#E5A914] transition-colors leading-tight"
              >
                {firstPlace.name}
              </h3>

              {/* Username / Handle */}
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-full">
                @{firstPlace.name.toLowerCase().replace(/\s+/g, '_')}
              </p>

              {/* Votes */}
              <p className="text-sm font-bold text-gray-700 mt-2">
                {firstPlace.votes} votes
              </p>

              {/* Vote button if voting enabled */}
              {isVotingEnabled && (
                <button
                  onClick={() => onCastVote(firstPlace.id, firstPlace.name, firstPlace.categoryName)}
                  className="mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold bg-[#E5A914] text-white hover:bg-[#d49b10] transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <VoteIcon size={13} /> Vote
                </button>
              )}
            </motion.div>
          )}

          {/* ── #3 BRONZE (3rd Place - Right) ── */}
          {thirdPlace ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="bg-white rounded-[22px] border border-orange-200/80 shadow-sm p-6 flex flex-col items-center text-center relative hover:shadow-md transition-shadow"
            >
              {/* Ribbon Medal #3 */}
              <RibbonMedal rank={3} />

              {/* Circular Avatar */}
              <div
                onClick={() => openImageModal(thirdPlace)}
                className="relative cursor-pointer group my-2.5"
                title="Click to view photo"
              >
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#FBBF24]">
                  <img
                    src={thirdPlace.img || '/cat_rider_awards.jpg'}
                    alt={thirdPlace.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <ZoomIn size={16} />
                </div>
              </div>

              {/* Name */}
              <h3
                onClick={() => openImageModal(thirdPlace)}
                className="text-base font-bold text-[#111827] mt-1 cursor-pointer hover:text-[#E5A914] transition-colors leading-tight"
              >
                {thirdPlace.name}
              </h3>

              {/* Username / Handle */}
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-full">
                @{thirdPlace.name.toLowerCase().replace(/\s+/g, '_')}
              </p>

              {/* Votes */}
              <p className="text-xs font-semibold text-gray-500 mt-2">
                {thirdPlace.votes} votes
              </p>

              {/* Vote button if voting enabled */}
              {isVotingEnabled && (
                <button
                  onClick={() => onCastVote(thirdPlace.id, thirdPlace.name, thirdPlace.categoryName)}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-[#E5A914] text-white hover:bg-[#d49b10] transition-colors flex items-center justify-center gap-1"
                >
                  <VoteIcon size={12} /> Vote
                </button>
              )}
            </motion.div>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-md mx-auto">
          <p className="text-3xl mb-2">🏍️</p>
          <h3 className="font-bold text-gray-900 text-base">No participants in this category yet</h3>
          <p className="text-xs text-gray-500 mt-1">
            Register your bike or motorcycle club to be the first in this category!
          </p>
          <a
            href="/login"
            className="inline-block mt-4 px-5 py-2 rounded-full text-xs font-bold bg-[#E5A914] text-white hover:bg-[#d49b10] transition-colors shadow-sm"
          >
            Register Now
          </a>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. RANK 4 AND DOWNWARDS LIST (Exact match of attached screenshot)
      ───────────────────────────────────────────────────────────── */}
      {remainingNominees.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden max-w-3xl mx-auto divide-y divide-gray-100">
          {remainingNominees.map((nom) => (
            <div
              key={nom.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/70 transition-colors"
            >
              {/* Left: Rank + Avatar + Name + Handle */}
              <div className="flex items-center gap-5 min-w-0">
                {/* Rank Number */}
                <span className="text-xs font-semibold text-gray-400 w-4 text-center">
                  {nom.currentRank}
                </span>

                {/* Avatar with Zoom */}
                <div
                  onClick={() => openImageModal(nom)}
                  className="relative cursor-pointer group shrink-0"
                  title="Click to view photo"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FBBF24] border border-gray-100">
                    <img
                      src={nom.img || '/cat_rider_awards.jpg'}
                      alt={nom.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <ZoomIn size={12} />
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h4
                    onClick={() => openImageModal(nom)}
                    className="text-sm font-bold text-[#111827] truncate cursor-pointer hover:text-[#E5A914] transition-colors leading-tight"
                  >
                    {nom.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    @{nom.name.toLowerCase().replace(/\s+/g, '_')}
                  </p>
                </div>
              </div>

              {/* Right: Votes and Vote CTA */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm font-bold text-gray-800">
                  {nom.votes}
                </span>

                {isVotingEnabled && (
                  <button
                    onClick={() => onCastVote(nom.id, nom.name, nom.categoryName)}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-[#E5A914] text-white hover:bg-[#d49b10] transition-colors"
                  >
                    Vote
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Resolution Photo Lightbox Modal */}
      <ImageModal
        isOpen={!!selectedImageNominee}
        data={selectedImageNominee}
        onClose={() => setSelectedImageNominee(null)}
      />
    </div>
  );
}
