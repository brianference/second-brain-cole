'use client';

import React from 'react';
import styles from './Sidebar.module.css';

interface SidebarCounts {
  total: number;
  mem0: number;
  supermemory: number;
  files: number;
  tasks: number;
  favorites?: number;
  pinned?: number;
  recent?: number;
}

interface SidebarProps {
  isCollapsed?: boolean;
  currentSection?: string;
  onSectionChange?: (section: string) => void;
  counts?: SidebarCounts;
}

interface SidebarItem {
  id: string;
  icon: string;
  label: string;
  countKey?: keyof SidebarCounts;
  color?: string;
  isAction?: boolean;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Views",
    items: [
      { id: "all", icon: "🔍", label: "All Memories", countKey: "total" },
      { id: "favorites", icon: "⭐", label: "Favorites", countKey: "favorites" },
      { id: "pinned", icon: "📌", label: "Pinned", countKey: "pinned" },
      { id: "recent", icon: "🕐", label: "Recent", countKey: "recent" },
      { id: "analytics", icon: "📊", label: "Analytics" },
    ]
  },
  {
    title: "Sources",
    items: [
      { id: "mem0", icon: "🧠", label: "Mem0", countKey: "mem0", color: "mem0" },
      { id: "supermemory", icon: "💫", label: "Supermemory", countKey: "supermemory", color: "supermemory" },
      { id: "files", icon: "📄", label: "Files", countKey: "files", color: "file" },
      { id: "tasks", icon: "✅", label: "Tasks", countKey: "tasks", color: "task" },
    ]
  },
  {
    title: "Collections",
    items: [
      { id: "work", icon: "📚", label: "Work" },
      { id: "personal", icon: "🎨", label: "Personal" },
      { id: "learning", icon: "📖", label: "Learning" },
      { id: "new-collection", icon: "➕", label: "New Collection", isAction: true },
    ]
  },
  {
    title: "Smart Views",
    items: [
      { id: "trending", icon: "🔥", label: "Trending" },
      { id: "connections", icon: "🔗", label: "Connections" },
      { id: "questions", icon: "❓", label: "Questions" },
      { id: "ideas", icon: "💡", label: "Ideas" },
    ]
  }
];

export function Sidebar({ isCollapsed = false, currentSection = 'all', onSectionChange, counts }: SidebarProps) {
  if (isCollapsed) {
    return null;
  }

  const getCount = (countKey?: keyof SidebarCounts): number | undefined => {
    if (!countKey || !counts) return undefined;
    return counts[countKey];
  };

  return (
    <div className={styles.sidebar}>
      {sidebarSections.map((section) => (
        <div key={section.title} className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{section.title}</span>
          </div>
          
          <div className={styles.items}>
            {section.items.map((item) => {
              const count = getCount(item.countKey);
              return (
                <button
                  key={item.id}
                  className={`${styles.item} ${currentSection === item.id ? styles.active : ''} ${item.isAction ? styles.action : ''}`}
                  onClick={() => onSectionChange?.(item.id)}
                >
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <span className={styles.itemLabel}>{item.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className={styles.itemCount}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
