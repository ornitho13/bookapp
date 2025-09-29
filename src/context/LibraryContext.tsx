import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Book, Bookmark, LibrarySettings} from '@types/library';
import LibraryRepository from '@services/LibraryRepository';

interface LibraryContextValue {
  books: Book[];
  bookmarks: Bookmark[];
  settings: LibrarySettings;
  isScanning: boolean;
  refreshLibrary: () => Promise<void>;
  updateSettings: (updater: (current: LibrarySettings) => LibrarySettings) => void;
  saveBookmark: (bookmark: Bookmark) => Promise<void>;
}

const defaultSettings: LibrarySettings = {
  rootUris: [],
  theme: 'system',
  autoScanOnLaunch: true
};

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export const LibraryProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [settings, setSettings] = useState<LibrarySettings>(defaultSettings);
  const [isScanning, setIsScanning] = useState(false);

  const refreshLibrary = useCallback(async () => {
    setIsScanning(true);
    try {
      const library = await LibraryRepository.getLibrary(settings.rootUris);
      setBooks(library.books);
      setBookmarks(library.bookmarks);
    } finally {
      setIsScanning(false);
    }
  }, [settings.rootUris]);

  useEffect(() => {
    if (!settings.autoScanOnLaunch || settings.rootUris.length === 0) {
      return;
    }
    refreshLibrary().catch(console.error);
  }, [refreshLibrary, settings.autoScanOnLaunch, settings.rootUris]);

  const updateSettings = useCallback(
    (updater: (current: LibrarySettings) => LibrarySettings) => {
      setSettings(current => {
        const next = updater(current);
        LibraryRepository.persistSettings(next).catch(console.warn);
        return next;
      });
    },
    []
  );

  const saveBookmark = useCallback(async (bookmark: Bookmark) => {
    await LibraryRepository.saveBookmark(bookmark);
    setBookmarks(current => {
      const existingIndex = current.findIndex(item => item.id === bookmark.id);
      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = bookmark;
        return next;
      }
      return [...current, bookmark];
    });
  }, []);

  const value = useMemo<LibraryContextValue>(
    () => ({books, bookmarks, settings, isScanning, refreshLibrary, updateSettings, saveBookmark}),
    [books, bookmarks, settings, isScanning, refreshLibrary, updateSettings, saveBookmark]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = (): LibraryContextValue => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
