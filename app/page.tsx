'use client';

import { useState } from 'react';
import { CommandBar } from '@/components/layout/CommandBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MemoryGrid } from '@/components/memory/MemoryGrid';
import { TimelineView } from '@/components/timeline/TimelineView';
import { StatsDashboard } from '@/components/stats/StatsDashboard';
import { sampleMemories, sampleTimelineEntries, sampleStats } from '@/lib/sampleData';
import styles from './page.module.css';

export default function Home() {
  const [currentView, setCurrentView] = useState<'grid' | 'timeline' | 'stats'>('grid');
  const [currentSection, setCurrentSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const renderView = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView entries={sampleTimelineEntries} />;
      case 'stats':
        return <StatsDashboard stats={sampleStats} />;
      case 'grid':
      default:
        return <MemoryGrid memories={sampleMemories} />;
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
