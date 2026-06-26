import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import Image from 'next/image';
import {
  X, Download, Calendar, Sticker, ChevronLeft, ChevronRight,
  Scissors, Square, Circle, Triangle, Star, Zap, Layers,
} from 'lucide-react';
import { Photo } from '@/types/types';
import { cn } from '@/lib/utils';

interface PhotoModalProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
}

const TAG_COLORS: Record<string, string> = {
  urban: 'text-cyan-primary bg-cyan-primary/[0.12] border-cyan-primary/[0.2]',
  portrait: 'text-[#a78bfa] bg-[#a78bfa]/[0.12] border-[#a78bfa]/[0.2]',
  nature: 'text-[#4ecdc4] bg-[#4ecdc4]/[0.12] border-[#4ecdc4]/[0.2]',
  architecture: 'text-[#fbbf24] bg-[#fbbf24]/[0.12] border-[#fbbf24]/[0.2]',
  abstract: 'text-[#fb7185] bg-[#fb7185]/[0.12] border-[#fb7185]/[0.2]',
  travel: 'text-[#34d399] bg-[#34d399]/[0.12] border-[#34d399]/[0.2]',
  night: 'text-[#818cf8] bg-[#818cf8]/[0.12] border-[#818cf8]/[0.2]',
};

const STICKER_FRAMES = [
  { id: 'cyber', label: 'CYBER', icon: Zap,
    text: 'text-cyan-primary',
    borderMarker: 'border-cyan-primary',
    borderSelected: 'border-cyan-primary',
    bgSelected: 'bg-cyan-primary/15',
    shadowSmall: 'shadow-[0_0_12px_rgba(0,217,255,0.5)]',
    shadowLarge: 'shadow-[0_0_24px_rgba(0,217,255,0.5),0_0_48px_rgba(0,217,255,0.25)]',
    gradient: 'from-cyan-primary/20 to-transparent',
    bgSolid: 'bg-cyan-primary',
    bgGradient: 'from-cyan-primary to-cyan-primary/80',
  },
  { id: 'neon', label: 'NEON', icon: Square,
    text: 'text-[#a78bfa]',
    borderMarker: 'border-[#a78bfa]',
    borderSelected: 'border-[#a78bfa]',
    bgSelected: 'bg-[#a78bfa]/15',
    shadowSmall: 'shadow-[0_0_12px_rgba(167,139,250,0.5)]',
    shadowLarge: 'shadow-[0_0_24px_rgba(167,139,250,0.5),0_0_48px_rgba(167,139,250,0.25)]',
    gradient: 'from-[#a78bfa]/20 to-transparent',
    bgSolid: 'bg-[#a78bfa]',
    bgGradient: 'from-[#a78bfa] to-[#a78bfa]/80',
  },
  { id: 'retro', label: 'RETRO', icon: Circle,
    text: 'text-[#fb7185]',
    borderMarker: 'border-[#fb7185]',
    borderSelected: 'border-[#fb7185]',
    bgSelected: 'bg-[#fb7185]/15',
    shadowSmall: 'shadow-[0_0_12px_rgba(251,113,133,0.5)]',
    shadowLarge: 'shadow-[0_0_24px_rgba(251,113,133,0.5),0_0_48px_rgba(251,113,133,0.25)]',
    gradient: 'from-[#fb7185]/20 to-transparent',
    bgSolid: 'bg-[#fb7185]',
    bgGradient: 'from-[#fb7185] to-[#fb7185]/80',
  },
  { id: 'sharp', label: 'SHARP', icon: Triangle,
    text: 'text-[#fbbf24]',
    borderMarker: 'border-[#fbbf24]',
    borderSelected: 'border-[#fbbf24]',
    bgSelected: 'bg-[#fbbf24]/15',
    shadowSmall: 'shadow-[0_0_12px_rgba(251,191,36,0.5)]',
    shadowLarge: 'shadow-[0_0_24px_rgba(251,191,36,0.5),0_0_48px_rgba(251,191,36,0.25)]',
    gradient: 'from-[#fbbf24]/20 to-transparent',
    bgSolid: 'bg-[#fbbf24]',
    bgGradient: 'from-[#fbbf24] to-[#fbbf24]/80',
  },
  { id: 'glitch', label: 'GLITCH', icon: Layers,
    text: 'text-[#4ecdc4]',
    borderMarker: 'border-[#4ecdc4]',
    borderSelected: 'border-[#4ecdc4]',
    bgSelected: 'bg-[#4ecdc4]/15',
    shadowSmall: 'shadow-[0_0_12px_rgba(78,205,196,0.5)]',
    shadowLarge: 'shadow-[0_0_24px_rgba(78,205,196,0.5),0_0_48px_rgba(78,205,196,0.25)]',
    gradient: 'from-[#4ecdc4]/20 to-transparent',
    bgSolid: 'bg-[#4ecdc4]',
    bgGradient: 'from-[#4ecdc4] to-[#4ecdc4]/80',
  },
  { id: 'star', label: 'STAR', icon: Star,
    text: 'text-[#34d399]',
    borderMarker: 'border-[#34d399]',
    borderSelected: 'border-[#34d399]',
    bgSelected: 'bg-[#34d399]/15',
    shadowSmall: 'shadow-[0_0_12px_rgba(52,211,153,0.5)]',
    shadowLarge: 'shadow-[0_0_24px_rgba(52,211,153,0.5),0_0_48px_rgba(52,211,153,0.25)]',
    gradient: 'from-[#34d399]/20 to-transparent',
    bgSolid: 'bg-[#34d399]',
    bgGradient: 'from-[#34d399] to-[#34d399]/80',
  },
];

function StickerCreator({ photo }: { photo: Photo }) {
  const [selectedFrame, setSelectedFrame] = useState(STICKER_FRAMES[0]);
  const [step, setStep] = useState<'choose' | 'preview'>('choose');

  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-4">
        {(['choose', 'preview'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer border",
                step === s ? "bg-cyan-primary/15 border-cyan-primary" : "bg-transparent border-white/10"
              )}
              onClick={() => setStep(s)}
            >
              <span className={cn("font-mono-tech text-[0.6rem]", step === s ? "text-cyan-primary" : "text-muted-foreground")}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={cn("font-inter text-[0.7rem] font-medium capitalize", step === s ? "text-foreground" : "text-muted-foreground")}>
                {s}
              </span>
            </div>
            {i < 1 && <div className="w-4 h-[1px] bg-white/10" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1"
          >
            <p className="mb-3 font-inter text-[0.75rem] text-muted-foreground">
              Choose a frame style for your sticker:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {STICKER_FRAMES.map((frame) => {
                const Icon = frame.icon;
                const isSelected = selectedFrame.id === frame.id;
                return (
                  <motion.button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200",
                      isSelected ? `${frame.bgSelected} ${frame.borderSelected} ${frame.shadowSmall}` : "bg-white/[0.03] border-white/[0.08]"
                    )}
                  >
                    <Icon size={18} className={isSelected ? frame.text : "text-muted-foreground"} />
                    <span className={cn("font-changa text-[0.6rem] tracking-[0.05em]", isSelected ? frame.text : "text-muted-foreground")}>
                      {frame.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <motion.button
              onClick={() => setStep('preview')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 py-2.5 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-br from-cyan-primary to-cyan-dim text-[#0A0A0B] font-inter font-semibold text-[0.8rem]"
            >
              <Scissors size={14} />
              Preview Sticker
            </motion.button>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 items-center"
          >
            {/* Sticker preview */}
            <div className="relative mb-4">
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl w-[140px] h-[140px] border-[3px] -rotate-3",
                  selectedFrame.borderSelected,
                  selectedFrame.shadowLarge
                )}
              >
                <Image
                  src={photo.url}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-full object-cover"
                />
                <div
                  className={cn("absolute inset-0 bg-gradient-to-br", selectedFrame.gradient)}
                />
                {/* Corner markers */}
                {[
                  'top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1',
                ].map((pos) => (
                  <div
                    key={pos}
                    className={cn(
                      `absolute ${pos} w-3 h-3`,
                      pos.includes('top') && `border-t-[2px] ${selectedFrame.borderMarker}`,
                      pos.includes('bottom') && `border-b-[2px] ${selectedFrame.borderMarker}`,
                      pos.includes('left') && `border-l-[2px] ${selectedFrame.borderMarker}`,
                      pos.includes('right') && `border-r-[2px] ${selectedFrame.borderMarker}`
                    )}
                  />
                ))}
              </div>
              <div
                className={cn(
                  "absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[#0A0A0B] font-bungee text-[0.55rem] tracking-[0.04em] whitespace-nowrap",
                  selectedFrame.bgSolid
                )}
              >
                {photo.title.toUpperCase()}
              </div>
            </div>

            <p className="text-center mb-4 font-inter text-[0.72rem] text-muted-foreground max-w-[200px]">
              {selectedFrame.label} frame · Ready to download
            </p>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => setStep('choose')}
                className="flex-1 py-2 rounded-xl font-inter text-[0.78rem] font-medium text-muted-foreground bg-white/5 border border-white/10"
              >
                Change Frame
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={cn("flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-[#0A0A0B] font-inter font-semibold text-[0.78rem] bg-gradient-to-br", selectedFrame.bgGradient)}
              >
                <Download size={13} />
                Download
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PhotoModal({ photo, photos, onClose }: PhotoModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'sticker'>('info');

  const currentIdx = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < photos.length - 1;

  if (!photo) return null;

  const formattedDate = new Date(photo.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog.Root open={!!photo} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 glass-overlay"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <Dialog.Title className="sr-only">Photo details</Dialog.Title>
            <Dialog.Description className="sr-only">View and download photo details or create a sticker.</Dialog.Description>
            <div
              className="relative w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl bg-[#0f0f12]/95 border border-cyan-primary/20 shadow-[0_0_60px_rgba(0,217,255,0.1),0_32px_64px_rgba(0,0,0,0.6)] max-h-[90vh]"
            >
              {/* Close button */}
              <Dialog.Close asChild>
                <button
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-white/[0.08] border border-white/[0.12] text-muted-foreground hover:text-foreground hover:bg-white/[0.14]"
                >
                  <X size={15} />
                </button>
              </Dialog.Close>

              {/* Left: Image */}
              <div className="relative flex-1 min-h-[260px] md:min-h-0 bg-black overflow-hidden">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-full object-cover max-h-[90vh]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent from-70% to-[#0f0f12]/80"
                />

                {/* Prev/Next navigation */}
                {canPrev && (
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 border border-white/15 text-foreground"
                    onClick={() => {
                      /* Navigation handled at parent level */
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                {canNext && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 border border-white/15 text-foreground"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}

                {/* Position indicator */}
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono-tech text-[0.65rem] text-white/50 bg-black/40 px-2 py-[2px] rounded-full"
                >
                  {currentIdx + 1} / {photos.length}
                </div>
              </div>

              {/* Right: Info + Sticker panel */}
              <div
                className="w-full md:w-72 flex flex-col overflow-hidden border-l border-cyan-primary/10"
              >
                {/* Tabs */}
                <div className="flex border-b border-cyan-primary/10">
                  {(['info', 'sticker'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-3 transition-colors font-inter text-[0.75rem] font-medium capitalize border-b-2",
                        activeTab === tab ? "text-cyan-primary bg-cyan-primary/[0.06] border-cyan-primary" : "text-muted-foreground bg-transparent border-transparent"
                      )}
                    >
                      {tab === 'sticker' ? <Sticker size={13} /> : <Calendar size={13} />}
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Panel content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <AnimatePresence mode="wait">
                    {activeTab === 'info' ? (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.18 }}
                      >
                        <h2 className="mb-1 font-bungee text-[1.1rem] tracking-[-0.02em] text-foreground leading-[1.2]">
                          {photo.title}
                        </h2>
                        <p className="mb-4 font-mono-tech text-[0.68rem] text-muted-foreground">
                          by {photo.uploader_id}
                        </p>

                        <div className="space-y-3 mb-4">
                          <InfoRow label="DATE" value={formattedDate} />
                          <InfoRow label="UPLOADER" value={photo.uploader_id} />
                          <InfoRow label="RES" value={`${photo.width} × ${photo.height}`} />
                        </div>

                        {/* Tags */}
                        <div className="mb-4">
                          <p className="mb-2 font-mono-tech text-[0.6rem] tracking-[0.08em] text-muted-foreground">
                            TAGS
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {photo.tags.map((tag) => (
                              <span
                                key={tag}
                                className={cn(
                                  "font-changa text-[0.62rem] tracking-[0.04em] px-2 py-[2px] rounded-full border",
                                  TAG_COLORS[tag] || "text-cyan-primary bg-cyan-primary/[0.12] border-cyan-primary/[0.2]"
                                )}
                              >
                                {tag.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Download */}
                        <a
                          href={photo.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 bg-cyan-primary/10 border border-cyan-primary/30 text-cyan-primary font-inter font-medium text-[0.8rem]"
                          >
                            <Download size={14} />
                            Download Original
                          </motion.button>
                        </a>

                        <motion.button
                          onClick={() => setActiveTab('sticker')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full mt-2 py-2.5 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-br from-cyan-primary to-cyan-dim text-[#0A0A0B] font-inter font-semibold text-[0.8rem]"
                        >
                          <Sticker size={14} />
                          Create Sticker
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sticker"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.18 }}
                        className="h-full"
                      >
                        <StickerCreator photo={photo} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="font-mono-tech text-[0.6rem] tracking-[0.08em] text-muted-foreground min-w-[40px] pt-[1px]">
        {label}
      </span>
      <span className="font-inter text-[0.75rem] text-foreground leading-[1.4]">
        {value}
      </span>
    </div>
  );
}
