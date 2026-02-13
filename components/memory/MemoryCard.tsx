'use client';

import React from 'react';
import { Memory } from '@/types/memory';
import { Star, Pin, MoreVertical, Trash2 } from 'lucide-react';
import styles from './MemoryCard.module.css';

interface MemoryCardProps {
  memory: Memory;
  variant?: 'standard' | 'compact' | 'expanded';
  onClick?: (id: string) => void;
  onPin?: (id: string) => void;
  onFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const sourceConfig = {
  mem0: { emoji: '🧠', label: 'Mem0', color: 'mem0' },
  supermemory: { emoji: '💫', label: 'Supermemory', color: 'supermemory' },
  file: { emoji: '📄', label: 'File', color: 'file' },
  task: { emoji: '✅', label: 'Task', color: 'task' },
};

export function MemoryCard({ 
  memory, 
  variant = 'standard',
  onClick,
  onPin,
  onFavorite,
  onDelete 
}: MemoryCardProps) {
  const config = sourceConfig[memory.source];
  
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onClick?.(memory.id);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`${styles.card} ${styles[variant]}`}
      onClick={handleClick}
    >
      <div className={styles.header}>
        <span className={`${styles.source} ${styles[config.color]}`}>
          <span className={styles.sourceEmoji}>{config.emoji}</span>
          {config.label}
        </span>
        
        <div className={styles.actions}>
          <button
            className={`${styles.action} ${memory.isPinned ? styles.active : ''}`}
            onClick={(e) => { e.stopPropagation(); onPin?.(memory.id); }}
            title="Pin"
          >
            <Pin size={14} />
          </button>
          <button
            className={`${styles.action} ${memory.isFavorite ? styles.active : ''}`}
            onClick={(e) => { e.stopPropagation(); onFavorite?.(memory.id); }}
            title="Favorite"
          >
            <Star size={14} />
          </button>
          <button
            className={styles.action}
            onClick={(e) => { e.stopPropagation(); }}
            title="More"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      <h3 className={styles.title}>{memory.title}</h3>
      
      <p className={styles.content}>{memory.content}</p>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {memory.tags.slice(0, variant === 'compact' ? 2 : 4).map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          {memory.tags.length > (variant === 'compact' ? 2 : 4) && (
            <span className={styles.tag}>+{memory.tags.length - (variant === 'compact' ? 2 : 4)}</span>
          )}
        </div>
        
        <span className={styles.date}>
          {formatDate(memory.createdAt)}
        </span>
      </div>
    </div>
  );
}
