export type MemorySource = 'mem0' | 'supermemory' | 'file' | 'task';

export interface Memory {
  id: string;
  title: string;
  content: string;
  source: MemorySource;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  metadata?: Record<string, any>;
}

export interface TimelineEntry {
  id: string;
  timestamp: Date;
  memory: Memory;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

export interface ActiveFilter {
  groupId: string;
  optionId: string;
}

export interface SearchResult {
  memory: Memory;
  highlights: string[];
  score: number;
}

export interface Stats {
  totalMemories: number;
  thisWeek: number;
  activeRate: number;
  sourceDistribution: {
    mem0: number;
    supermemory: number;
    file: number;
    task: number;
  };
  recentActivity: ActivityDataPoint[];
}

export interface ActivityDataPoint {
  date: string;
  count: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}
