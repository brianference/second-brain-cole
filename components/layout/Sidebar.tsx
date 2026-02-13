'use client';

import React from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isCollapsed?: boolean;
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

interface SidebarItem {
  id: string;
  icon: string;
  label: string;
  count?: number;
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
      { id: "all", icon: "🔍", label: "All Memories", count: 1247 },
      { id: "favorites", icon: "⭐", label: "Favorites", count: 89 },
      { id: "pinned", icon: "📌", label: "Pinned", count: 12 },
      { id: "recent", icon: "🕐", label: "Recent", count: 50 },
      { id: "analytics", icon: "📊", label: "Analytics" },
    ]
  },
  {
    title: "Sources",
    items: [
      { id: "mem0", icon: "🧠", label: "Mem0", count: 542, color: "mem0" },
      { id: "supermemory", icon: "💫", label: "Supermemory", count: 318, color: "supermemory" },
      { id: "files", icon: "📄", label: "Files", count: 267, color: "file" },
      { id: "tasks", icon: "✅", label: "Tasks", count: 120, color: "task" },
    ]
  },
  {
    title: "Collections",
    items: [
      { id: "work", icon: "📚", label: "Work", count: 456 },
      { id: "personal", icon: "🎨", label: "Personal", count: 223 },
      { id: "learning", icon: "📖", label: "Learning", count: 189 },
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

export function Sidebar({ isCollapsed = false, currentSection = 'all', onSectionChange }: SidebarProps) {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className={styles.sidebar}>
      {sidebarSections.map((section) => (
        <div key={section.title} className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{section.title}</span>
          </div>
          
          <div className={styles.items}>
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`${styles.item} ${currentSection === item.id ? styles.active : ''} ${item.isAction ? styles.action : ''}`}
                onClick={() => onSectionChange?.(item.id)}
              >
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemLabel}>{item.label}</span>
                {item.count !== undefined && (
                  <span className={styles.itemCount}>{item.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
