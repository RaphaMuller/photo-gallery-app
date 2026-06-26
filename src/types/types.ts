export type Tag = 'urban' | 'portrait' | 'nature' | 'architecture' | 'abstract' | 'travel' | 'night';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Profile {
  id: string; // UUID from Supabase Auth
  display_name: string | null;
  avatar_url: string | null;
  whatsapp_number: string | null;
  created_at: string;
}

export interface Group {
  id: string; // UUID
  name: string;
  description: string | null;
  created_by: string; // Profile ID
  created_at: string;
}

export interface GroupMember {
  user_id: string;
  group_id: string;
  role: UserRole;
  joined_at: string;
}

export interface Photo {
  id: string; // UUID
  group_id: string;
  uploader_id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  tags: Tag[];
  is_flagged: boolean;
  created_at: string;
}

export interface CalendarEvent {
  id: string; // UUID
  group_id: string;
  creator_id: string;
  title: string;
  event_date: string; // YYYY-MM-DD
  event_time: string; // HH:MM
  description: string | null;
  color: 'cyan' | 'purple' | 'rose' | 'amber' | 'teal';
  created_at: string;
}

export interface EventRSVP {
  event_id: string;
  user_id: string;
  status: 'confirmed' | 'declined';
}

export type SortOption = 'newest' | 'oldest' | 'name';
