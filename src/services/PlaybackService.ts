import TrackPlayer, {Event, State, Track} from 'react-native-track-player';
import {Book, Chapter} from '@types/library';

let isInitialized = false;

const PlaybackService = {
  async setupPlayer(): Promise<void> {
    if (isInitialized) {
      return;
    }
    await TrackPlayer.setupPlayer({autoHandleInterruptions: true});
    isInitialized = true;
  },

  async loadBook(book: Book): Promise<void> {
    await this.setupPlayer();
    const tracks: Track[] = book.tracks.map((chapter: Chapter, index) => ({
      id: chapter.id,
      url: chapter.path,
      title: chapter.title,
      artist: book.author,
      artwork: book.cover,
      index
    }));

    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
  },

  async playChapter(chapterId: string): Promise<void> {
    if (!chapterId) {
      await TrackPlayer.play();
      return;
    }
    await TrackPlayer.skip(chapterId);
    await TrackPlayer.play();
  },

  async togglePlayback(): Promise<void> {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  },

  addListeners(onProgress: (position: number, duration: number) => void) {
    const progress = TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, ({position, duration}) => {
      onProgress(position, duration);
    });

    return () => {
      progress.remove();
    };
  }
};

export default PlaybackService;
