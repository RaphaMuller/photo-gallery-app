import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
import { X, UploadCloud, FolderPlus, Check, Image, Plus } from 'lucide-react';
import { Group } from '@/types/types';
import { cn } from '@/lib/utils';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  groups: Group[];
  onUploadComplete: (files: File[], groupId: string) => void;
}

export function UploadModal({ open, onClose, groups, onUploadComplete }: UploadModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]?.id ?? '');
  const [newGroupName, setNewGroupName] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const imgs = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setSelectedFiles((prev) => [...prev, ...imgs]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setUploading(false);
    setDone(true);
    await new Promise((r) => setTimeout(r, 900));
    onUploadComplete(selectedFiles, selectedGroup);
    setSelectedFiles([]);
    setDone(false);
    onClose();
  };

  const removeFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <Dialog.Title className="sr-only">Upload Photos</Dialog.Title>
            <Dialog.Description className="sr-only">Upload your photos to an group.</Dialog.Description>
            <div
              className="w-full max-w-lg rounded-2xl overflow-hidden bg-surface-modal/95 border border-cyan-primary/20 shadow-modal"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b border-cyan-primary/10"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-cyan-primary/[0.12] border border-cyan-primary/25"
                  >
                    <UploadCloud size={15} className="text-cyan-primary" />
                  </div>
                  <h2
                    className="font-bungee text-base tracking-[-0.01em] text-foreground"
                  >
                    BATCH UPLOAD
                  </h2>
                </div>
                <Dialog.Close asChild>
                  <button
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Dialog.Close>
              </div>

              <div className="p-5 space-y-4">
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={cn("rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all py-8 border-2 border-dashed", dragOver ? "border-cyan-primary bg-cyan-primary/[0.06] shadow-glow-cyan-md" : "border-cyan-primary/20 bg-white/[0.02]")}
                >
                  <UploadCloud
                    size={28}
                    className={cn(dragOver ? "text-cyan-primary" : "text-cyan-primary/40")}
                  />
                  <p
                    className={cn("font-inter text-sm font-medium", dragOver ? "text-cyan-primary" : "text-foreground")}
                  >
                    Drop photos here or{' '}
                    <span className="text-cyan-primary underline">browse</span>
                  </p>
                  <p className="font-mono-tech text-2xs text-muted-foreground">
                    JPG, PNG, WEBP — max 20MB each
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>

                {/* Selected files preview */}
                {selectedFiles.length > 0 && (
                  <div
                    className="rounded-xl p-3 space-y-2 max-h-36 overflow-y-auto bg-white/[0.03] border border-white/[0.06]"
                  >
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Image size={13} className="text-muted-foreground shrink-0" />
                        <span
                          className="flex-1 truncate font-mono-tech text-xs text-foreground"
                        >
                          {file.name}
                        </span>
                        <span
                          className="font-mono-tech text-2xs text-muted-foreground"
                        >
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                        <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Group select */}
                <div>
                  <p
                    className="mb-2 font-mono-tech text-2xs tracking-[0.08em] text-muted-foreground"
                  >
                    ADD TO ALBUM
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => { setSelectedGroup(group.id); setCreatingGroup(false); }}
                        className={cn("px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-inter text-xs border", selectedGroup === group.id && !creatingGroup ? "bg-cyan-primary/15 border-cyan-primary text-cyan-primary" : "bg-white/[0.04] border-white/10 text-muted-foreground hover:bg-white/[0.08]")}
                      >
                        {selectedGroup === group.id && !creatingGroup && <Check size={11} />}
                        {group.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setCreatingGroup(true)}
                      className={cn("px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-inter text-xs border", creatingGroup ? "bg-cyan-primary/15 border-cyan-primary text-cyan-primary" : "bg-white/[0.04] border-white/10 text-muted-foreground hover:bg-white/[0.08]")}
                    >
                      <FolderPlus size={12} />
                      New Group
                    </button>
                  </div>
                  <AnimatePresence>
                    {creatingGroup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          autoFocus
                          type="text"
                          placeholder="Group name..."
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg outline-none font-inter text-sm bg-white/[0.06] border border-cyan-primary/20 text-foreground focus:border-cyan-primary/50 transition-colors"
                        />
                        <button
                          className="px-3 py-1.5 rounded-lg flex items-center gap-1 bg-gradient-to-br from-cyan-primary to-cyan-dim text-primary-foreground font-inter text-sm font-semibold"
                        >
                          <Plus size={13} />
                          Create
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Upload button */}
                <motion.button
                  onClick={handleUpload}
                  disabled={!selectedFiles.length || uploading}
                  whileHover={selectedFiles.length && !uploading ? { scale: 1.02 } : {}}
                  whileTap={selectedFiles.length && !uploading ? { scale: 0.97 } : {}}
                  className={cn("w-full py-3 rounded-xl flex items-center justify-center gap-2 font-inter font-semibold text-sm transition-all duration-300", done ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-primary-foreground" : selectedFiles.length && !uploading ? "bg-gradient-to-br from-cyan-primary to-cyan-dim text-primary-foreground cursor-pointer" : "bg-white/[0.06] text-muted-foreground cursor-not-allowed")}
                >
                  {done ? (
                    <>
                      <Check size={16} />
                      Uploaded!
                    </>
                  ) : uploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <UploadCloud size={16} />
                      </motion.div>
                      Uploading {selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''}...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} />
                      {selectedFiles.length
                        ? `Upload ${selectedFiles.length} photo${selectedFiles.length !== 1 ? 's' : ''}`
                        : 'Select photos first'}
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
