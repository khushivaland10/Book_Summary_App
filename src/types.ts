export type Chapter = {
  _id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  minutes: number;
  accent: string;
  summary: string;
  financialLessons: string[];
  examples: string[];
  audioSummary: string;
  keyTakeaways: string[];
  audioUrl?: string;
  tags: string[];
};

export type Bookmark = {
  chapterId: string;
  createdAt: string;
};

export type Note = {
  id: string;
  chapterId: string;
  body: string;
  updatedAt: string;
  dirty?: boolean;
};

export type RecentView = {
  chapterId: string;
  viewedAt: string;
};

export type ProgressMap = Record<string, { percent: number; completed: boolean; updatedAt: string }>;
