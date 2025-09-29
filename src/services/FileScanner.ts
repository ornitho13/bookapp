import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {Book, Chapter, MediaType} from '@types/library';
import {v4 as uuidv4} from 'uuid';

const SUPPORTED_AUDIO_EXTENSIONS = ['mp3', 'm4a', 'm4b', 'aac', 'wav'];
const SUPPORTED_EBOOK_EXTENSIONS = ['epub', 'pdf'];

const extension = (filename: string) => filename.split('.').pop()?.toLowerCase();
const filename = (path: string) => path.split('/').pop() ?? path;

const mapToBook = (path: string, type: MediaType): Book => {
  const title = filename(path).replace(/\.[^/.]+$/, '');
  const id = uuidv4();

  const tracks: Chapter[] = [
    {
      id: uuidv4(),
      title,
      path
    }
  ];

  return {
    id,
    title,
    type,
    path,
    tracks
  };
};

const FileScanner = {
  async scanLibrary(rootUris: string[]): Promise<Book[]> {
    if (!rootUris.length) {
      return [];
    }

    const books: Book[] = [];
    for (const rootUri of rootUris) {
      try {
        const normalized = this.normalizeUri(rootUri);
        const entries = await RNFS.readDir(normalized);
        for (const entry of entries) {
          if (entry.isFile()) {
            const ext = extension(entry.name);
            if (!ext) continue;
            if (SUPPORTED_AUDIO_EXTENSIONS.includes(ext)) {
              books.push(mapToBook(entry.path, 'audio'));
            }
            if (SUPPORTED_EBOOK_EXTENSIONS.includes(ext)) {
              books.push(mapToBook(entry.path, 'ebook'));
            }
          }
        }
      } catch (error) {
        console.warn('Impossible de parcourir le dossier', rootUri, error);
      }
    }

    return books.sort((a, b) => a.title.localeCompare(b.title));
  },

  normalizeUri(uri: string): string {
    if (uri.startsWith('content://')) {
      return uri;
    }

    if (Platform.OS === 'android' && !uri.startsWith('/')) {
      return `/${uri}`;
    }

    return uri;
  }
};

export default FileScanner;
