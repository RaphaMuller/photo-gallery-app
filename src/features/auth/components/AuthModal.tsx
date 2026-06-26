"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'motion/react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const supabase = createClient();

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/gallery`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ocorreu um erro ao fazer login.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
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
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Dialog.Title className="sr-only">Autenticação</Dialog.Title>
            <Dialog.Description className="sr-only">Faça login na sua conta.</Dialog.Description>

            <div
              className="w-full max-w-sm rounded-2xl overflow-hidden glass-modal shadow-[0_0_80px_rgba(0,217,255,0.08),_0_32px_64px_rgba(0,0,0,0.7)]"
            >
              {/* Header */}
              <div
                className="relative flex items-center justify-center px-5 py-5 border-b border-cyan-primary/10"
              >
                {/* Logo mark */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-primary/20 to-purple-500/20 border border-cyan-primary/30 shadow-[0_0_20px_rgba(0,217,255,0.15)]"
                  >
                    <span className="font-bungee text-base text-cyan-primary">G</span>
                  </div>
                  <span className="font-bungee text-xs text-foreground tracking-tight">
                    GALERIA
                  </span>
                </div>

                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </Dialog.Close>
              </div>

              <div className="p-6 flex flex-col items-center gap-4">
                <p className="text-[0.85rem] text-muted-foreground text-center font-inter">
                  Conecte-se para acessar a galeria e os eventos exclusivos do grupo.
                </p>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[0.75rem] w-full text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-2.5 py-1.5 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className={cn(
                    "w-full py-3 rounded-xl flex items-center justify-center gap-3 font-semibold text-[0.85rem] transition-colors",
                    loading
                      ? "bg-cyan-primary/15 text-cyan-primary cursor-not-allowed"
                      : "bg-white text-[#0A0A0B] hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  )}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size={16} />
                      Conectando...
                    </>
                  ) : (
                    <>
                      {/* Google G icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continuar com Google
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
