import { motion } from 'motion/react';
import { ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { Tag, SortOption } from '@/types/types';
import { ALL_TAGS } from '@/constants/data';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  activeTag: Tag | 'all';
  onTagChange: (tag: Tag | 'all') => void;
  sortOption: SortOption;
  onSortChange: (s: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}

const TAG_LABELS: Record<Tag | 'all', string> = {
  all: 'ALL',
  urban: 'URBAN',
  portrait: 'PORTRAIT',
  nature: 'NATURE',
  architecture: 'ARCH',
  abstract: 'ABSTRACT',
  travel: 'TRAVEL',
  night: 'NIGHT',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name' },
];

export function FilterBar({
  activeTag,
  onTagChange,
  sortOption,
  onSortChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const tags: (Tag | 'all')[] = ['all', ...ALL_TAGS];

  return (
    <div
      className="flex items-center gap-3 px-5 py-2.5 overflow-x-auto bg-surface-deep/60 backdrop-blur-[12px] border-b border-cyan-primary/[0.08] [scrollbar-width:none]"
    >
      {/* Tags */}
      <div className="flex items-center gap-1.5 shrink-0">
        {tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <motion.button
              key={tag}
              onClick={() => onTagChange(tag)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-2.5 py-0.5 rounded-full transition-colors font-changa text-2xs tracking-[0.06em] whitespace-nowrap border",
                isActive
                  ? "bg-cyan-primary text-primary-foreground border-cyan-primary"
                  : "bg-cyan-primary/[0.07] text-cyan-primary border-cyan-primary/20"
              )}
            >
              {TAG_LABELS[tag]}
            </motion.button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-5 w-[1px] shrink-0 bg-cyan-primary/[0.12]" />

      {/* Count */}
      <span
        className="shrink-0 font-mono-tech text-xs text-muted-foreground whitespace-nowrap"
      >
        {filteredCount === totalCount
          ? `${totalCount} photos`
          : `${filteredCount} / ${totalCount}`}
      </span>

      {/* Sort — pushed to end */}
      <div className="flex items-center gap-1 ml-auto shrink-0">
        <ArrowUpDown size={12} className="text-muted-foreground" />
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-md px-2 py-1 outline-none cursor-pointer font-inter text-xs bg-white/5 border border-cyan-primary/[0.12] text-muted-foreground"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-popover">
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
