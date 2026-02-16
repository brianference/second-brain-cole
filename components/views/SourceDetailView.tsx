'use client';

import React from 'react';
import { Memory } from '@/types/memory';
import styles from './SourceDetailView.module.css';

interface SourceDetailViewProps {
  source: 'mem0' | 'supermemory';
  memories: Memory[];
}

const sourceInfo = {
  mem0: {
    title: 'mem0 Memory Store',
    description: 'Auto-captured memories from conversations. Semantic search enabled via OpenAI embeddings.',
    icon: '🧠',
    color: '#8b5cf6',
    stats: [
      { label: 'Provider', value: 'OpenAI GPT-4o-mini' },
      { label: 'Embeddings', value: 'text-embedding-3-small' },
      { label: 'Dimensions', value: '1536' },
      { label: 'Vector Store', value: 'In-memory' },
    ]
  },
  supermemory: {
    title: 'Supermemory Cloud',
    description: 'Long-term cloud backup for permanent knowledge storage. Searchable across sessions.',
    icon: '💫',
    color: '#f59e0b',
    stats: [
      { label: 'Provider', value: 'supermemory.ai' },
      { label: 'Storage', value: 'Cloud (persistent)' },
      { label: 'Backup', value: 'Automatic' },
      { label: 'Search', value: 'Semantic' },
    ]
  }
};

export function SourceDetailView({ source, memories }: SourceDetailViewProps) {
  const info = sourceInfo[source];

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ borderColor: info.color }}>
        <span className={styles.icon}>{info.icon}</span>
        <div>
          <h1 className={styles.title}>{info.title}</h1>
          <p className={styles.description}>{info.description}</p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {info.stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Memories</span>
          <span className={styles.statValue} style={{ color: info.color }}>{memories.length}</span>
        </div>
      </div>

      <div className={styles.memoriesSection}>
        <h2 className={styles.sectionTitle}>Stored Memories ({memories.length})</h2>
        <div className={styles.memoriesList}>
          {memories.length === 0 ? (
            <div className={styles.empty}>No memories stored in {info.title}</div>
          ) : (
            memories.map((memory) => (
              <div key={memory.id} className={styles.memoryCard}>
                <div className={styles.memoryHeader}>
                  <span className={styles.memoryId}>{memory.id.substring(0, 8)}...</span>
                  <span className={styles.memoryDate}>
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles.memoryContent}>{memory.content}</p>
                {memory.tags && memory.tags.length > 0 && (
                  <div className={styles.tags}>
                    {memory.tags.slice(0, 5).map((tag, idx) => (
                      <span key={idx} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
