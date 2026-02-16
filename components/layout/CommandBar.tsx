'use client';

import React, { useState } from 'react';
import { Search, Zap, BarChart3, User, Plus } from 'lucide-react';
import styles from './CommandBar.module.css';

interface CommandBarProps {
  onSearch?: (query: string) => void;
  onViewChange?: (view: string) => void;
  currentView?: string;
  onQuickAction?: () => void;
  onAnalytics?: () => void;
}

const views = [
  { id: 'grid', label: 'Grid', icon: '⊞' },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'stats', label: 'Stats', icon: '📊' },
];

export function CommandBar({ onSearch, onViewChange, currentView = 'grid', onQuickAction, onAnalytics }: CommandBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={styles.commandBar}>
      <div className={styles.logo}>
        <span className={styles.logoEmoji}>🧠</span>
        Second Brain
      </div>

      <div className={`${styles.searchWrapper} ${isFocused ? styles.focused : ''}`}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search memories..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <span className={styles.searchShortcut}>⌘K</span>
      </div>

      <div className={styles.viewSwitcher}>
        {views.map(view => (
          <button
            key={view.id}
            className={`${styles.viewOption} ${currentView === view.id ? styles.active : ''}`}
            onClick={() => onViewChange?.(view.id)}
          >
            <span>{view.icon}</span>
            {view.label}
          </button>
        ))}
      </div>

      <div className={styles.quickActions}>
        <button className={styles.quickAction} title="Quick actions" onClick={onQuickAction}>
          <Zap size={20} />
        </button>
        <button className={styles.quickAction} title="Analytics" onClick={onAnalytics}>
          <BarChart3 size={20} />
        </button>
        <button className={styles.quickAction} title="Profile">
          <User size={20} />
        </button>
        <button className={`${styles.quickAction} ${styles.newMemory}`}>
          <Plus size={20} />
          <span>New</span>
        </button>
      </div>
    </div>
  );
}
