import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return (
    <motion.div
      className={cn("rounded-full border-2 border-cyan-primary/20", className)}
      style={{
        width: size,
        height: size,
        borderTopColor: 'rgba(0,217,255,0.9)',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}
