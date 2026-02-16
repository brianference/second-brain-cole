'use client';

import { useState, useMemo } from 'react';
import { CommandBar } from '@/components/layout/CommandBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MemoryGrid } from '@/components/memory/MemoryGrid';
import { TimelineView } from '@/components/timeline/TimelineView';
import { StatsDashboard } from '@/components/stats/StatsDashboard';
import { sampleMemories, sampleTimelineEntries, sampleStats } from '@/lib/sampleData';
import styles from './page.module.css';

// Map sidebar sections to their corresponding filter types
const sectionFilters: Record<string, { type: 'source' | 'view' | 'collection' | 'smart', value?: string }> = {
  // Sources
  'mem0': { type: 'source', value: 'mem0' },
  'supermemory': { type: 'source', value: 'supermemory' },
  'files': { type: 'source', value: 'file' },
  'tasks': { type: 'source', value: 'task' },
  // Views
  'all': { type: 'view', value: 'all' },
  'favorites': { type: 'view', value: 'favorites' },
  'pinned': { type: 'view', value: 'pinned' },
  'recent': { type: 'view', value: 'recent' },
  'analytics': { type: 'view', value: 'analytics' },
  // Collections
  'work': { type: 'collection', value: 'work' },
  'personal': { type: 'collection', value: 'personal' },
  'learning': { type: 'collection', value: 'learning' },
  // Smart Views
  'trending': { type: 'smart', value: 'trending' },
  'connections': { type: 'smart', value: 'connections' },
  'questions': { type: 'smart', value: 'questions' },
  'ideas': { type: 'smart', value: 'ideas' },
};

export default function Home() {
  const [currentView, setCurrentView] = useState<'grid' | 'timeline' | 'stats'>('grid');
  const [currentSection, setCurrentSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter memories based on section and search query
  const filteredMemories = useMemo(() => {
    let filtered = sampleMemories;
    const filter = sectionFilters[currentSection];

    if (filter && currentSection !== 'all') {
      switch (filter.type) {
        case 'source':
          filtered = filtered.filter(memory => memory.source === filter.value);
          break;
        case 'view':
          if (filter.value === 'favorites') {
            filtered = filtered.filter(memory => memory.tags.includes('favorite'));
          } else if (filter.value === 'pinned') {
            filtered = filtered.filter(memory => memory.tags.includes('pinned'));
          } else if (filter.value === 'recent') {
            // Sort by date and take last 50
            filtered = [...filtered].sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 50);
          }
          break;
        case 'collection':
          filtered = filtered.filter(memory => 
            memory.tags.some(tag => tag.toLowerCase() === filter.value)
          );
          break;
        case 'smart':
          if (filter.value === 'trending') {
            // Sort by most recent updated
            filtered = [...filtered].sort((a, b) => 
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            ).slice(0, 20);
          } else if (filter.value === 'connections') {
            // Show memories with multiple tags (more connected)
            filtered = filtered.filter(memory => memory.tags.length >= 3);
          } else if (filter.value === 'questions') {
            filtered = filtered.filter(memory => 
              memory.content.includes('?') || memory.tags.includes('question')
            );
          } else if (filter.value === 'ideas') {
            filtered = filtered.filter(memory => 
              memory.tags.includes('idea') || memory.tags.includes('💡')
            );
          }
          break;
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(memory => 
        memory.title.toLowerCase().includes(query) ||
        memory.content.toLowerCase().includes(query) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [currentSection, searchQuery]);

  // Filter timeline entries based on the same criteria
  const filteredTimelineEntries = useMemo(() => {
    // First filter the memories used in timeline
    const memoryIds = new Set(filteredMemories.map(m => m.id));
    return sampleTimelineEntries.filter(entry => memoryIds.has(entry.memory.id));
  }, [filteredMemories]);

  const renderView = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView entries={filteredTimelineEntries} />;
      case 'stats':
        return <StatsDashboard stats={sampleStats} />;
      case 'grid':
      default:
        return <MemoryGrid memories={filteredMemories} />;
    }
  };

  return (
    <div className={styles.layout}>
      <CommandBar
        onSearch={setSearchQuery}
        onViewChange={(view) => setCurrentView(view as 'grid' | 'timeline' | 'stats')}
        currentView={currentView}
        onQuickAction={() => {
          // Quick action: show recent memories
          setCurrentSection('recent');
          setCurrentView('grid');
        }}
        onAnalytics={() => {
          // Analytics: show stats view
          setCurrentView('stats');
          setCurrentSection('all');
        }}
      />
      
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
      
      <main className={styles.content}>
        {renderView()}
      </main>
      
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusIndicator}>🔄</span>
          <span>Synced</span>
          <span className={styles.statusDivider}>•</span>
          <span>1,247 memories</span>
          <span className={styles.statusDivider}>•</span>
          <span>Last updated 2 min ago</span>
        </div>
        
        <div className={styles.statusRight}>
          {searchQuery && (
            <span className={styles.searchStatus}>
              Searching for "{searchQuery}"
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
