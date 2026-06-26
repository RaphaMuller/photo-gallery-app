import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { AnimatePresence, motion } from 'motion/react';
import { Photo } from '@/types/types';
import { PhotoCard } from './PhotoCard';
import { ImageOff } from 'lucide-react';

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export function PhotoGallery({ photos, onPhotoClick }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }}
        >
          <ImageOff size={24} style={{ color: 'rgba(0,217,255,0.4)' }} />
        </div>
        <p style={{ fontFamily: "'Bungee', sans-serif", fontSize: '0.9rem', color: '#9A9AA2', letterSpacing: '-0.01em' }}>
          No photos found
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9A9AA2' }}>
          Try adjusting your filters or upload new photos
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={photos.map((p) => p.id).join(',')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 0: 1, 480: 2, 768: 2, 1024: 3 }}
        >
          <Masonry gutter="12px">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <PhotoCard photo={photo} onClick={onPhotoClick} />
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </motion.div>
    </AnimatePresence>
  );
}
