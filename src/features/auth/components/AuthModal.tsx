"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mail, Lock, User, X, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup';

function InputField({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Icon
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-primary/50 pointer-events-none"
      />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-2.5 pr-3 pl-10 rounded-xl text-[0.85rem] glass-input"
      />
    </div>
  );
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError(null);
    setSuccess(false);
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        });
        if (signUpError) throw signUpError;
        setSuccess(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ocorreu um erro.';
      setError(msg);
    } finally {
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
            <Dialog.Description className="sr-only">Faça login ou crie sua conta.</Dialog.Description>

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

              {/* Tab toggle */}
              <div
                className="flex border-b border-cyan-primary/10"
              >
                {(['login', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={cn(
                      "flex-1 py-2.5 text-[0.78rem] font-medium transition-colors border-b-2",
                      mode === m
                        ? "text-cyan-primary bg-cyan-primary/5 border-cyan-primary"
                        : "text-muted-foreground bg-transparent border-transparent hover:text-foreground"
                    )}
                  >
                    {m === 'login' ? 'Entrar' : 'Criar Conta'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-3 p-8"
                  >
                    <CheckCircle size={40} className="text-emerald-400" />
                    <p className="font-bungee text-[0.95rem] text-foreground text-center">
                      Verifique seu e-mail!
                    </p>
                    <p className="text-[0.78rem] text-muted-foreground text-center">
                      Enviamos um link de confirmação para <strong className="text-foreground">{email}</strong>. Confirme e faça login.
                    </p>
                    <button
                      onClick={() => switchMode('login')}
                      className="mt-2 w-full py-2.5 rounded-xl bg-cyan-primary/10 border border-cyan-primary/30 text-cyan-primary font-medium text-[0.82rem] hover:bg-cyan-primary/20 transition-colors"
                    >
                      Ir para Login
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key={mode}
                    initial={{ opacity: 0, x: mode === 'signup' ? 12 : -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSubmit}
                    className="p-5 space-y-3"
                  >
                    {mode === 'signup' && (
                      <InputField
                        icon={User}
                        type="text"
                        placeholder="Seu nome"
                        value={displayName}
                        onChange={setDisplayName}
                      />
                    )}
                    <InputField
                      icon={Mail}
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={setEmail}
                    />
                    <InputField
                      icon={Lock}
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={setPassword}
                    />

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[0.75rem] text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-2.5 py-1.5"
                      >
                        {error}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.97 } : {}}
                      className={cn(
                        "w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-[0.85rem] transition-colors mt-1",
                        loading
                          ? "bg-cyan-primary/15 text-cyan-primary cursor-not-allowed"
                          : "bg-gradient-to-br from-cyan-primary to-cyan-dim text-[#0A0A0B] shadow-[0_0_15px_rgba(0,217,255,0.4)]"
                      )}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader2 size={15} />
                          </motion.div>
                          Aguarde...
                        </>
                      ) : mode === 'login' ? 'Entrar' : 'Criar Conta'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
