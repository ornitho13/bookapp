import AsyncStorage from '@react-native-async-storage/async-storage';
import {Book, Bookmark, LibrarySettings} from '@types/library';
import FileScanner from './FileScanner';

const SETTINGS_KEY = 'library_settings_v1';
const BOOKMARK_KEY = 'library_bookmarks_v1';

interface LibrarySnapshot {
  books: Book[];
  bookmarks: Bookmark[];
}

const LibraryRepository = {
  async getLibrary(rootUris: string[]): Promise<LibrarySnapshot> {
    const [books, bookmarks] = await Promise.all([
      FileScanner.scanLibrary(rootUris),
      this.getBookmarks()
    ]);

    return {books, bookmarks};
  },

  async getSettings(): Promise<LibrarySettings | undefined> {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as LibrarySettings) : undefined;
  },

  async persistSettings(settings: LibrarySettings): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  async getBookmarks(): Promise<Bookmark[]> {
    const raw = await AsyncStorage.getItem(BOOKMARK_KEY);
    return raw ? (JSON.parse(raw) as Bookmark[]) : [];
  },

  async saveBookmark(bookmark: Bookmark): Promise<void> {
    const current = await this.getBookmarks();
    const next = [...current.filter(item => item.id !== bookmark.id), bookmark];
    await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  }
};

export default LibraryRepository;
