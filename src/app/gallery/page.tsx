"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { NavBar } from '@/components/layout/NavBar';
import { FilterBar } from '@/features/gallery/components/FilterBar';
import dynamic from 'next/dynamic';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

const PhotoGallery = dynamic(
  () => import('@/features/gallery/components/PhotoGallery').then((mod) => mod.PhotoGallery),
  { ssr: false }
);
import { EventsPanel } from '@/features/events/components/EventsPanel';
import { PhotoModal } from '@/features/gallery/components/PhotoModal';
import { UploadModal } from '@/features/gallery/components/UploadModal';
import { EventFormModal } from '@/features/events/components/EventFormModal';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { Photo, Tag, SortOption, CalendarEvent } from '@/types/types';
import { PHOTOS, ALBUMS, EVENTS } from '@/constants/data';

export default function Page() {
  // Gallery state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<Tag | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Panel / view state
  const [activeView, setActiveView] = useState<'gallery' | 'events'>('gallery');

  // Modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState(false);

  // Data state
  const [events, setEvents] = useState<CalendarEvent[]>(EVENTS);

  // Derived: filtered & sorted photos
  const filteredPhotos = useMemo(() => {
    let photos = PHOTOS;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      photos = photos.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t: string) => t.includes(q)) ||
          p.group_id.toLowerCase().includes(q) ||
          p.uploader_id.toLowerCase().includes(q)
      );
    }

    if (activeTag !== 'all') {
      photos = photos.filter((p) => p.tags.includes(activeTag));
    }

    return [...photos].sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.title.localeCompare(b.title);
    });
  }, [searchQuery, activeTag, sortOption]);

  const handleEventCreated = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1B1B1E 0%, #0D0D10 50%, #0A0A0B 100%)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Ambient background glows */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      >
        <div
          className="absolute"
          style={{
            top: '-10%',
            right: '-5%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,217,255,0.04) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-10%',
            left: '-5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,94,167,0.05) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Nav */}
      <NavBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUploadClick={() => setUploadOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
        user={user}
        onLoginClick={() => setAuthOpen(true)}
      />

      {/* Filter bar — only shown in gallery view */}
      {activeView === 'gallery' && (
        <FilterBar
          activeTag={activeTag}
          onTagChange={setActiveTag}
          sortOption={sortOption}
          onSortChange={setSortOption}
          totalCount={PHOTOS.length}
          filteredCount={filteredPhotos.length}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* Gallery column */}
        <main
          className="flex-1 overflow-y-auto px-4 pt-4 pb-8 lg:px-5"
          style={{ minWidth: 0 }}
        >
          {activeView === 'gallery' ? (
            <PhotoGallery
              photos={filteredPhotos}
              onPhotoClick={setSelectedPhoto}
            />
          ) : (
            <MobileEventsView
              events={events}
              onNewEvent={() => setEventFormOpen(true)}
            />
          )}
        </main>

        {/* Events sidebar — desktop only */}
        <aside
          className="hidden lg:flex flex-col w-72 overflow-y-auto px-4 pt-4 pb-8 shrink-0"
          style={{
            borderLeft: '1px solid rgba(0,217,255,0.08)',
            background: 'rgba(10,10,11,0.4)',
          }}
        >
          <EventsPanel
            events={events}
            onNewEvent={() => setEventFormOpen(true)}
          />
        </aside>
      </div>

      {/* Photo detail modal */}
      <PhotoModal
        photo={selectedPhoto}
        photos={filteredPhotos}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Upload modal */}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        groups={ALBUMS}
        onUploadComplete={() => setUploadOpen(false)}
      />

      {/* Event creation modal */}
      <EventFormModal
        open={eventFormOpen}
        onClose={() => setEventFormOpen(false)}
        onEventCreated={handleEventCreated}
      />
      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

/* Mobile events view — shown when activeView === 'events' on mobile */
function MobileEventsView({
  events,
  onNewEvent,
}: {
  events: CalendarEvent[];
  onNewEvent: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-lg mx-auto"
    >
      <EventsPanel events={events} onNewEvent={onNewEvent} />
    </motion.div>
  );
}
