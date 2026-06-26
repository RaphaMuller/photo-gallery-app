import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Sticker, Eye } from 'lucide-react';
import { Photo } from '@/types/types';
import { cn } from '@/lib/utils';

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
}

const TAG_COLORS: Record<string, string> = {
  urban: 'text-cyan-primary bg-cyan-primary/12 border-cyan-primary/20',
  portrait: 'text-purple bg-purple/12 border-purple/20',
  nature: 'text-teal bg-teal/12 border-teal/20',
  architecture: 'text-amber bg-amber/12 border-amber/20',
  abstract: 'text-rose bg-rose/12 border-rose/20',
  travel: 'text-green bg-green/12 border-green/20',
  night: 'text-indigo bg-indigo/12 border-indigo/20',
};

export function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const aspectRatio = photo.height / photo.width;
  const isPortrait = aspectRatio > 1.2;

  const formattedDate = new Date(photo.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  });

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer mb-3 bg-surface-card/60 backdrop-blur-[16px] transition-[border-color,box-shadow] duration-250 ease-out border",
        hovered
          ? "border-cyan-primary/40 shadow-card-glow"
          : "border-cyan-primary/12 shadow-card"
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(photo)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ minHeight: isPortrait ? 280 : 180 }}>
        <Image
          src={photo.url}
          alt={photo.title}
          width={photo.width}
          height={photo.height}
          className="w-full h-full object-cover block"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
        )}

        {/* Gradient overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-surface-deep/95 via-surface-deep/40 to-transparent"
            />
          )}
        </AnimatePresence>

        {/* Cyan scan-line effect on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ top: '-100%' }}
              animate={{ top: '110%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-[1px] pointer-events-none bg-gradient-to-r from-transparent via-cyan-primary/60 to-transparent"
            />
          )}
        </AnimatePresence>

        {/* View icon */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center bg-cyan-primary/15 border border-cyan-primary/40"
            >
              <Eye size={13} className="text-cyan-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom info overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8"
            >
              <p className="truncate mb-1 font-bungee text-sm tracking-[-0.01em] text-foreground">
                {photo.title}
              </p>
              <div className="flex items-center gap-1.5">
                <Calendar size={10} className="text-muted-foreground" />
                <span className="font-mono-tech text-2xs text-muted-foreground">
                  {formattedDate}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer tags */}
      <div className="px-2.5 py-2 flex flex-wrap gap-1">
        {photo.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className={cn(
              "font-changa text-2xs tracking-[0.05em] px-1.5 py-[1px] rounded-full border",
              TAG_COLORS[tag] || "text-cyan-primary bg-cyan-primary/12 border-cyan-primary/20"
            )}
          >
            {tag.toUpperCase()}
          </span>
        ))}
        <span className="ml-auto self-center font-mono-tech text-2xs text-muted-foreground">
          {photo.group_id.split(' ')[0]}
        </span>
      </div>
    </motion.div>
  );
}
