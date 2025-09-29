import {Book} from '@types/library';

interface ReaderState {
  location: string;
  theme: 'light' | 'dark' | 'sepia';
  fontScale: number;
}

const ReaderService = {
  async getInitialState(book: Book): Promise<ReaderState> {
    return {
      location: book.tracks[0]?.path ?? '',
      theme: 'light',
      fontScale: 1
    };
  },

  async saveState(book: Book, state: ReaderState): Promise<void> {
    console.log('Persist reader state', book.id, state);
  }
};

export type {ReaderState};
export default ReaderService;
