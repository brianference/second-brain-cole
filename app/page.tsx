'use client';

import { useState, useMemo, useEffect } from 'react';
import { CommandBar } from '@/components/layout/CommandBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MemoryGrid } from '@/components/memory/MemoryGrid';
import { TimelineView } from '@/components/timeline/TimelineView';
import { StatsDashboard } from '@/components/stats/StatsDashboard';
import { Memory, TimelineEntry, Stats } from '@/types/memory';
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
  const [memories, setMemories] = useState<Memory[]>(sampleMemories);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>(sampleTimelineEntries);
  const [stats, setStats] = useState<Stats>(sampleStats);
  const [isLoading, setIsLoading] = useState(true);

  // Load real data from JSON files
  useEffect(() => {
    async function loadRealData() {
      try {
        const [memoriesRes, timelineRes, statsRes] = await Promise.all([
          fetch('/memories.json').catch(() => null),
          fetch('/timeline.json').catch(() => null),
          fetch('/stats.json').catch(() => null),
        ]);

        if (memoriesRes?.ok) {
          const data = await memoriesRes.json();
          // Convert date strings to Date objects
          const processed = data.map((m: any) => ({
            ...m,
            createdAt: new Date(m.createdAt),
            updatedAt: new Date(m.updatedAt),
          }));
          setMemories(processed);
        }

        if (timelineRes?.ok) {
          const data = await timelineRes.json();
          const processed = data.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp),
            memory: {
              ...e.memory,
              createdAt: new Date(e.memory.createdAt),
              updatedAt: new Date(e.memory.updatedAt),
            },
          }));
          setTimelineEntries(processed);
        }

        if (statsRes?.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading real data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRealData();
  }, []);

  // Filter memories based on section and search query
  const filteredMemories = useMemo(() => {
    let filtered = memories;
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
  }, [currentSection, searchQuery, memories]);

  // Filter timeline entries based on the same criteria
  const filteredTimelineEntries = useMemo(() => {
    // First filter the memories used in timeline
    const memoryIds = new Set(filteredMemories.map(m => m.id));
    return timelineEntries.filter(entry => memoryIds.has(entry.memory.id));
  }, [filteredMemories, timelineEntries]);

  const renderView = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView entries={filteredTimelineEntries} />;
      case 'stats':
        return <StatsDashboard stats={stats} />;
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
        counts={{
          total: stats.totalMemories,
          mem0: stats.sourceDistribution.mem0,
          supermemory: stats.sourceDistribution.supermemory,
          files: stats.sourceDistribution.file,
          tasks: stats.sourceDistribution.task,
          favorites: memories.filter(m => m.tags?.includes('favorite')).length,
          pinned: memories.filter(m => m.tags?.includes('pinned')).length,
          recent: memories.filter(m => {
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            return new Date(m.createdAt).getTime() > weekAgo;
          }).length,
        }}
      />
      
      <main className={styles.content}>
        {renderView()}
      </main>
      
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusIndicator}>{isLoading ? '⏳' : '🔄'}</span>
          <span>{isLoading ? 'Loading...' : 'Synced'}</span>
          <span className={styles.statusDivider}>•</span>
          <span>{memories.length.toLocaleString()} memories</span>
          <span className={styles.statusDivider}>•</span>
          <span>Real data from OpenClaw</span>
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
