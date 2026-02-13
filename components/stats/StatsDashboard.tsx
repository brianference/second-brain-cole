'use client';

import React from 'react';
import { Stats } from '@/types/memory';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatsDashboard.module.css';

interface StatsDashboardProps {
  stats: Stats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const changePercent = Math.round((stats.thisWeek / stats.totalMemories) * 100);

  return (
    <div className={styles.dashboard}>
      {/* Key Metrics */}
      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Total Memories</span>
          <div className={styles.cardIcon}>🧠</div>
        </div>
        <div className={styles.cardValue}>{stats.totalMemories.toLocaleString()}</div>
        <div className={`${styles.cardChange} ${styles.positive}`}>
          <TrendingUp size={16} />
          <span>+12% from last week</span>
        </div>
        <div className={styles.cardFooter}>Last updated 5 min ago</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>This Week</span>
          <div className={styles.cardIcon}>📈</div>
        </div>
        <div className={styles.cardValue}>+{stats.thisWeek}</div>
        <div className={`${styles.cardChange} ${styles.positive}`}>
          <TrendingUp size={16} />
          <span>+23% increase</span>
        </div>
        <div className={styles.cardFooter}>7 days</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Active Rate</span>
          <div className={styles.cardIcon}>🔥</div>
        </div>
        <div className={styles.cardValue}>{stats.activeRate}%</div>
        <div className={`${styles.cardChange} ${styles.negative}`}>
          <TrendingDown size={16} />
          <span>-5% from target</span>
        </div>
        <div className={styles.cardFooter}>Daily average</div>
      </div>

      {/* Source Distribution */}
      <div className={`${styles.statCard} ${styles.wide}`}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Memory Activity (Last 30 Days)</span>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.barChart}>
            {stats.recentActivity.slice(0, 30).map((day, index) => {
              const maxValue = Math.max(...stats.recentActivity.map(d => d.count));
              const height = (day.count / maxValue) * 100;
              
              return (
                <div
                  key={day.date}
                  className={styles.bar}
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${day.count} memories`}
                >
                  <div className={styles.barValue}>{day.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className={styles.sourceCard}>
        <div className={styles.sourceIcon}>🧠</div>
        <div className={styles.sourceContent}>
          <div className={styles.sourceLabel}>Mem0</div>
          <div className={styles.sourceValue}>{stats.sourceDistribution.mem0}</div>
        </div>
      </div>

      <div className={styles.sourceCard}>
        <div className={styles.sourceIcon}>💫</div>
        <div className={styles.sourceContent}>
          <div className={styles.sourceLabel}>Supermemory</div>
          <div className={styles.sourceValue}>{stats.sourceDistribution.supermemory}</div>
        </div>
      </div>

      <div className={styles.sourceCard}>
        <div className={styles.sourceIcon}>📄</div>
        <div className={styles.sourceContent}>
          <div className={styles.sourceLabel}>Files</div>
          <div className={styles.sourceValue}>{stats.sourceDistribution.file}</div>
        </div>
      </div>

      <div className={styles.sourceCard}>
        <div className={styles.sourceIcon}>✅</div>
        <div className={styles.sourceContent}>
          <div className={styles.sourceLabel}>Tasks</div>
          <div className={styles.sourceValue}>{stats.sourceDistribution.task}</div>
        </div>
      </div>
    </div>
  );
}
