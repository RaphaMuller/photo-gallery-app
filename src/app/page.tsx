"use client";

import { motion } from 'motion/react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PHOTOS } from '@/constants/data';

const supabase = createClient();

export default function LandingPage() {
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

  // Duplicar a lista de fotos para dar a ilusão de rolagem infinita sem espaços em branco
  const displayPhotos = [...PHOTOS.slice(0, 8), ...PHOTOS.slice(0, 8)];

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-screen overflow-hidden bg-app-gradient font-inter">
      
      {/* Efeitos de fundo (Lado Esquerdo e Geral) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-primary/[0.05] blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.05] blur-[100px]" />
      </div>

      {/* Lado Esquerdo: Card Centralizado */}
      <div className="relative z-10 flex flex-col justify-center items-center px-4 py-16 min-h-[50vh] lg:min-h-screen">
        
        {/* Conteiner Lado Esquerdo sem bordas de Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[40rem] min-h-[600px] p-4 md:p-10 flex flex-col items-start justify-center text-left bg-transparent"
        >
          {/* Nova Logo Alinhada à Esquerda */}
          <div className="w-20 h-20 mb-8 rounded-3xl overflow-hidden relative shadow-glow-cyan-lg border border-cyan-400/20 ring-1 ring-cyan-500/20">
            <Image 
              src="/logo.png" 
              alt="Neon Camera Logo" 
              fill 
              className="object-cover"
              sizes="80px"
            />
          </div>

          {/* Headline */}
          <h1 className="font-inter font-black text-4xl md:text-5xl lg:text-hero text-foreground tracking-tight leading-[1.1]">
            Eternize Seus <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Momentos.</span>
          </h1>
          
          <p className="text-muted-foreground mt-6 mb-10 text-base leading-relaxed max-w-[28rem] pl-1 border-l-2 border-cyan-500/30 ml-1">
            Um espaço privado e moderno para organizar, visualizar e compartilhar suas fotos e eventos.
          </p>

          {/* Botão de Login */}
          <div className="flex flex-col w-full max-w-[22rem]">
            {error && (
              <p className="text-sm w-full text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-3 py-3 mb-4">
                {error}
              </p>
            )}

            <motion.button
              onClick={handleGoogleLogin}
              disabled={loading}
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={cn(
                "w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-base transition-colors",
                loading
                  ? "bg-cyan-primary/15 text-cyan-primary cursor-not-allowed border border-cyan-primary/20"
                  : "bg-white text-primary-foreground hover:bg-white/90 shadow-glow-white-md"
              )}
            >
              {loading ? (
                <>
                  <LoadingSpinner size={20} />
                  <span className="text-cyan-primary">Conectando...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar com o Google
                </>
              )}
            </motion.button>
            
            <div className="mt-10 font-inter text-xs text-muted-foreground/50 leading-relaxed">
              <p>&copy; {new Date().getFullYear()} Galeria Fotográfica.</p>
              <p>Autenticado com segurança pelo Supabase.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lado Direito: Marquee Infinito de Fotos */}
      <div className="relative z-0 h-[50vh] lg:h-screen w-full overflow-hidden bg-black/20 group">
        
        {/* Gradientes Superior e Inferior para esmaecer a galeria nas bordas */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-surface-deep to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-surface-deep to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 35, 
            repeat: Infinity,
          }}
          className="flex flex-col gap-4 p-4 md:p-8 pt-[20vh] group-hover:[animation-play-state:paused]"
        >
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {displayPhotos.map((photo, i) => (
              <div 
                key={`${photo.id}-${i}`}
                className={cn(
                  "relative rounded-3xl overflow-hidden glass-card transition-all duration-500 hover:scale-105 hover:shadow-glow-cyan-strong hover:z-20 cursor-pointer",
                  i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"
                )}
              >
                <Image 
                  src={photo.url} 
                  alt={photo.title} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 hover:scale-110 opacity-70 hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="font-inter font-semibold text-sm text-white truncate drop-shadow-md">{photo.title}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
