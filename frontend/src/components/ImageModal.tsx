import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, MapPin, Bike, Award } from 'lucide-react';

export interface ImageModalData {
  imageUrl: string;
  name: string;
  categoryName?: string;
  county?: string;
  make?: string;
  model?: string;
  registrationPlate?: string;
}

interface ImageModalProps {
  isOpen: boolean;
  data: ImageModalData | null;
  onClose: () => void;
}

export default function ImageModal({ isOpen, data, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full bg-[#14231A] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90 border border-white/15"
            aria-label="Close image preview"
          >
            <X size={20} />
          </button>

          {/* Top header badge */}
          <div className="p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 inset-x-0 z-10 pointer-events-none flex items-center justify-between pr-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/30 text-[#F5C542] text-xs font-extrabold uppercase tracking-wide border border-brand-green/40 backdrop-blur-sm">
              <Award size={13} /> {data.categoryName || 'Award Participant'}
            </span>
          </div>

          {/* Full Image Container */}
          <div className="relative flex-1 bg-black/40 flex items-center justify-center overflow-hidden min-h-[320px] max-h-[68vh] p-2">
            <img
              src={data.imageUrl}
              alt={data.name}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-lg select-none"
            />
          </div>

          {/* Bottom metadata footer */}
          <div className="p-5 bg-[#14231A] border-t border-white/10 text-white space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white leading-tight">
                  {data.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/70 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-brand-green" /> {data.county || 'Eldoret, Kenya'}
                  </span>
                  {(data.make || data.model) && (
                    <span className="flex items-center gap-1">
                      <Bike size={13} className="text-brand-green" /> {data.make} {data.model || ''}
                    </span>
                  )}
                </div>
              </div>

              {data.registrationPlate && data.registrationPlate !== 'N/A' && (
                <span className="shrink-0 bg-white/10 border border-white/20 font-mono font-bold text-xs px-2.5 py-1 rounded-lg text-[#F5C542]">
                  {data.registrationPlate}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
