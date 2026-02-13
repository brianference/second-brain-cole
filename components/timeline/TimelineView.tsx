'use client';

import React, { useState } from 'react';
import { TimelineEntry as TimelineEntryType } from '@/types/memory';
import { MemoryCard } from '../memory/MemoryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './TimelineView.module.css';

interface TimelineViewProps {
  entries: TimelineEntryType[];
}

const zoomLevels = ['Day', 'Week', 'Month', 'Year', 'All'];

function groupEntriesByPeriod(entries: TimelineEntryType[]) {
  const groups: { [key: string]: TimelineEntryType[] } = {};
  const now = new Date();

  entries.forEach(entry => {
    const diffMs = now.getTime() - entry.timestamp.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let period: string;
    if (diffDays === 0) {
      period = 'Today';
    } else if (diffDays === 1) {
      period = 'Yesterday';
    } else if (diffDays < 7) {
      period = 'This Week';
    } else if (diffDays < 14) {
      period = 'Last Week';
    } else if (diffDays < 30) {
      period = 'This Month';
    } else {
      const month = entry.timestamp.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      period = month;
    }

    if (!groups[period]) {
      groups[period] = [];
    }
    groups[period].push(entry);
  });

  return groups;
}

export function TimelineView({ entries }: TimelineViewProps) {
  const [zoomLevel, setZoomLevel] = useState('Week');
  const groupedEntries = groupEntriesByPeriod(entries);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.controls}>
        <div className={styles.zoomLevels}>
          {zoomLevels.map(level => (
            <button
              key={level}
              className={`${styles.zoomLevel} ${zoomLevel === level ? styles.active : ''}`}
              onClick={() => setZoomLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className={styles.dateRange}>
          <button className={styles.navBtn}>
            <ChevronLeft size={16} />
          </button>
          <span>Feb 5 → Feb 12</span>
          <button className={styles.navBtn}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.spine} />

        {Object.entries(groupedEntries).map(([period, periodEntries]) => (
          <div key={period} className={styles.period}>
            <div className={styles.periodHeader}>
              <div className={styles.periodLabel}>{period}</div>
            </div>

            <div className={styles.entries}>
              {periodEntries.map((entry, index) => (
                <div key={entry.id} className={styles.entry}>
                  <div className={styles.entryContent}>
                    <MemoryCard memory={entry.memory} variant="standard" />
                  </div>

                  <div className={styles.entryMarker}>
                    <div className={styles.markerDot} />
                    <div className={styles.markerTime}>
                      {formatTime(entry.timestamp)}
                    </div>
                  </div>

                  <div className={styles.entryEmpty} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
