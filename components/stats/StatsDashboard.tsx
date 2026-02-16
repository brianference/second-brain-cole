'use client';

import React from 'react';
import { Stats } from '@/types/memory';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './StatsDashboard.module.css';

interface StatsDashboardProps {
  stats: Stats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  // Calculate REAL percentages from actual data
  const weekPercentOfTotal = stats.totalMemories > 0 
    ? Math.round((stats.thisWeek / stats.totalMemories) * 100) 
    : 0;
  
  // Calculate week-over-week change from recentActivity
  const lastWeekActivity = stats.recentActivity.slice(-7);
  const previousWeekActivity = stats.recentActivity.slice(-14, -7);
  
  const thisWeekCount = lastWeekActivity.reduce((sum, d) => sum + d.count, 0);
  const prevWeekCount = previousWeekActivity.reduce((sum, d) => sum + d.count, 0);
  
  const weekOverWeekChange = prevWeekCount > 0 
    ? Math.round(((thisWeekCount - prevWeekCount) / prevWeekCount) * 100)
    : thisWeekCount > 0 ? 100 : 0;

  // Active rate vs target (assume 70% target)
  const targetRate = 70;
  const rateVsTarget = stats.activeRate - targetRate;

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={16} />;
    if (value < 0) return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getChangeClass = (value: number) => {
    if (value > 0) return styles.positive;
    if (value < 0) return styles.negative;
    return styles.neutral;
  };

  const formatChange = (value: number, suffix: string = '') => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value}%${suffix}`;
  };

  return (
    <div className={styles.dashboard}>
      {/* Key Metrics */}
      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Total Memories</span>
          <div className={styles.cardIcon}>🧠</div>
        </div>
        <div className={styles.cardValue}>{stats.totalMemories.toLocaleString()}</div>
        <div className={`${styles.cardChange} ${getChangeClass(weekOverWeekChange)}`}>
          {getChangeIcon(weekOverWeekChange)}
          <span>{formatChange(weekOverWeekChange, ' from last week')}</span>
        </div>
        <div className={styles.cardFooter}>{weekPercentOfTotal}% added this week</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>This Week</span>
          <div className={styles.cardIcon}>📈</div>
        </div>
        <div className={styles.cardValue}>+{stats.thisWeek}</div>
        <div className={`${styles.cardChange} ${getChangeClass(weekOverWeekChange)}`}>
          {getChangeIcon(weekOverWeekChange)}
          <span>{formatChange(weekOverWeekChange, ' vs prev week')}</span>
        </div>
        <div className={styles.cardFooter}>7 days</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Active Rate</span>
          <div className={styles.cardIcon}>🔥</div>
        </div>
        <div className={styles.cardValue}>{stats.activeRate}%</div>
        <div className={`${styles.cardChange} ${getChangeClass(rateVsTarget)}`}>
          {getChangeIcon(rateVsTarget)}
          <span>{formatChange(rateVsTarget, ' from target')}</span>
        </div>
        <div className={styles.cardFooter}>Target: {targetRate}%</div>
      </div>

      {/* Source Distribution */}
      <div className={`${styles.statCard} ${styles.wide}`}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Memory Activity (Last 30 Days)</span>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.barChart}>
            {stats.recentActivity.slice(-30).map((day) => {
              const maxValue = Math.max(...stats.recentActivity.slice(-30).map(d => d.count), 1);
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
