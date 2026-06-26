import { Camera, Upload, CalendarDays, Search, X, LogIn, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

interface NavBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onUploadClick: () => void;
  activeView: 'gallery' | 'events';
  onViewChange: (v: 'gallery' | 'events') => void;
  user: User | null;
  onLoginClick: () => void;
}

export function NavBar({ searchQuery, onSearchChange, onUploadClick, activeView, onViewChange, user, onLoginClick }: NavBarProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-5 h-14 glass-nav">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded flex items-center justify-center bg-cyan-primary/10 border border-cyan-primary/30">
          <Camera size={15} className="text-cyan-primary" />
        </div>
        <span className="font-bungee tracking-tight select-none hidden sm:block text-[0.9rem] text-foreground">
          PHOTO<span className="text-cyan-primary">VAULT</span>
        </span>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center gap-1 ml-2">
        {(['gallery', 'events'] as const).map((view) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={cn(
              "relative px-3 py-1 rounded-md transition-colors font-inter text-[0.8rem] font-medium capitalize",
              activeView === view ? "text-cyan-primary bg-cyan-primary/10" : "text-muted-foreground bg-transparent"
            )}
          >
            {view === 'gallery' ? (
              <span className="flex items-center gap-1.5">
                <Camera size={13} />
                Gallery
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} />
                Events
              </span>
            )}
            {activeView === view && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-md border border-cyan-primary/25"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 max-w-xs relative ml-auto sm:ml-0">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search photos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-8 py-1.5 rounded-lg text-[0.8rem] glass-input"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Upload CTA — only shown when logged in as editor/admin */}
      {user && (
        <motion.button
          onClick={onUploadClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 bg-gradient-to-br from-cyan-primary to-cyan-dim text-[#0A0A0B] font-inter text-[0.8rem] font-semibold"
        >
          <Upload size={13} />
          <span className="hidden sm:inline">Upload</span>
        </motion.button>
      )}

      {/* Auth button */}
      {user ? (
        <motion.button
          onClick={() => supabase.auth.signOut()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          title={`Sair (${user.email})`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 bg-white/5 border border-white/10 text-muted-foreground font-inter text-[0.8rem] font-medium hover:bg-white/10 transition-colors"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Sair</span>
        </motion.button>
      ) : (
        <motion.button
          onClick={onLoginClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 bg-cyan-primary/10 border border-cyan-primary/25 text-cyan-primary font-inter text-[0.8rem] font-medium hover:bg-cyan-primary/20 transition-colors"
        >
          <LogIn size={13} />
          <span className="hidden sm:inline">Entrar</span>
        </motion.button>
      )}
    </header>
  );
}
