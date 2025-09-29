export type MediaType = 'audio' | 'ebook';

export interface Chapter {
  id: string;
  title: string;
  duration?: number;
  path: string;
  position?: number;
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  description?: string;
  cover?: string;
  type: MediaType;
  path: string;
  tracks: Chapter[];
  lastOpenedAt?: string;
  progress?: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId?: string;
  position: number;
  note?: string;
  createdAt: string;
}

export interface LibrarySettings {
  rootUris: string[];
  theme: 'system' | 'light' | 'dark';
  autoScanOnLaunch: boolean;
}
