'use client';

import React, { useState } from 'react';
import { CommandBar } from './CommandBar';
import { Sidebar } from './Sidebar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentView, setCurrentView] = useState('grid');
  const [currentSection, setCurrentSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.layout}>
      <CommandBar
        onSearch={setSearchQuery}
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
      
      <main className={styles.content}>
        {children}
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
