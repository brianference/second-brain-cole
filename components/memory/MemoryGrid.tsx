'use client';

import React from 'react';
import { Memory } from '@/types/memory';
import { MemoryCard } from './MemoryCard';
import styles from './MemoryGrid.module.css';

interface MemoryGridProps {
  memories: Memory[];
  variant?: 'standard' | 'compact';
  onCardClick?: (id: string) => void;
}

export function MemoryGrid({ memories, variant = 'standard', onCardClick }: MemoryGridProps) {
  if (memories.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3 className={styles.emptyTitle}>No memories found</h3>
        <p className={styles.emptyText}>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`${styles.grid} ${variant === 'compact' ? styles.compact : ''}`}>
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
          variant={variant}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
