'use client';

import { useState, useMemo } from 'react';
import { CommandBar } from '@/components/layout/CommandBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MemoryGrid } from '@/components/memory/MemoryGrid';
import { TimelineView } from '@/components/timeline/TimelineView';
import { StatsDashboard } from '@/components/stats/StatsDashboard';
import { sampleMemories, sampleTimelineEntries, sampleStats } from '@/lib/sampleData';
import styles from './page.module.css';

// Map sidebar sections to their corresponding source values
const sectionToSource: Record<string, string> = {
  'mem0': 'mem0',
  'supermemory': 'supermemory',
  'files': 'file',
  'tasks': 'task',
};

export default function Home() {
  const [currentView, setCurrentView] = useState<'grid' | 'timeline' | 'stats'>('grid');
  const [currentSection, setCurrentSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter memories based on section and search query
  const filteredMemories = useMemo(() => {
    let filtered = sampleMemories;

    // Filter by section (source)
    if (currentSection !== 'all' && sectionToSource[currentSection]) {
      const source = sectionToSource[currentSection];
      filtered = filtered.filter(memory => memory.source === source);
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
    return sampleTimelineEntries.filter(entry => {
      // Check section filter
      if (currentSection !== 'all' && sectionToSource[currentSection]) {
        const source = sectionToSource[currentSection];
        if (entry.memory.source !== source) return false;
      }

      // Check search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          entry.memory.title.toLowerCase().includes(query) ||
          entry.memory.content.toLowerCase().includes(query) ||
          entry.memory.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [currentSection, searchQuery]);

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
