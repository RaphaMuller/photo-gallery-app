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
  urban: 'text-cyan-primary bg-cyan-primary/[0.12] border-cyan-primary/[0.2]',
  portrait: 'text-[#a78bfa] bg-[#a78bfa]/[0.12] border-[#a78bfa]/[0.2]',
  nature: 'text-[#4ecdc4] bg-[#4ecdc4]/[0.12] border-[#4ecdc4]/[0.2]',
  architecture: 'text-[#fbbf24] bg-[#fbbf24]/[0.12] border-[#fbbf24]/[0.2]',
  abstract: 'text-[#fb7185] bg-[#fb7185]/[0.12] border-[#fb7185]/[0.2]',
  travel: 'text-[#34d399] bg-[#34d399]/[0.12] border-[#34d399]/[0.2]',
  night: 'text-[#818cf8] bg-[#818cf8]/[0.12] border-[#818cf8]/[0.2]',
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
        "relative overflow-hidden rounded-xl cursor-pointer mb-3 bg-[#14141a]/60 backdrop-blur-[16px] transition-[border-color,box-shadow] duration-250 ease-out border",
        hovered
          ? "border-cyan-primary/40 shadow-[0_0_24px_rgba(0,217,255,0.2),0_0_48px_rgba(0,217,255,0.08),inset_0_0_24px_rgba(0,217,255,0.03)]"
          : "border-cyan-primary/[0.12] shadow-[0_2px_16px_rgba(0,0,0,0.4)]"
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
              className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/95 via-[#0a0a0b]/40 to-transparent"
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
              <p className="truncate mb-1 font-bungee text-[0.8rem] tracking-[-0.01em] text-foreground">
                {photo.title}
              </p>
              <div className="flex items-center gap-1.5">
                <Calendar size={10} className="text-muted-foreground" />
                <span className="font-mono-tech text-[0.65rem] text-muted-foreground">
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
              "font-changa text-[0.6rem] tracking-[0.05em] px-1.5 py-[1px] rounded-full border",
              TAG_COLORS[tag] || "text-cyan-primary bg-cyan-primary/[0.12] border-cyan-primary/[0.2]"
            )}
          >
            {tag.toUpperCase()}
          </span>
        ))}
        <span className="ml-auto self-center font-mono-tech text-[0.6rem] text-muted-foreground">
          {photo.group_id.split(' ')[0]}
        </span>
      </div>
    </motion.div>
  );
}
