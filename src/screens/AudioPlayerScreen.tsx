import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/AppNavigator';
import {useLibrary} from '@context/LibraryContext';
import PlaybackService from '@services/PlaybackService';

const AudioPlayerScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'AudioPlayer'>> = ({route}) => {
  const {bookId, chapterId} = route.params;
  const {books} = useLibrary();
  const book = useMemo(() => books.find(item => item.id === bookId), [books, bookId]);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!book) {
      return;
    }

    const initialChapter = chapterId ?? book.tracks[0]?.id ?? '';

    PlaybackService.loadBook(book)
      .then(() => PlaybackService.playChapter(initialChapter))
      .catch(console.error);

    const remove = PlaybackService.addListeners((nextPosition, nextDuration) => {
      setPosition(nextPosition);
      setDuration(nextDuration);
    });

    return () => {
      remove();
    };
  }, [book]);

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.missing}>Livre introuvable.</Text>
      </SafeAreaView>
    );
  }

  const progress = duration ? position / duration : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        {book.author ? <Text style={styles.author}>{book.author}</Text> : null}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${Math.max(progress * 100, 2)}%`}]} />
        </View>
        <Text style={styles.timer}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
        <View style={styles.controls}>
          <Pressable style={styles.controlButton} onPress={() => PlaybackService.togglePlayback()}>
            <Text style={styles.controlLabel}>Lecture / Pause</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center'
  },
  author: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
    color: '#555'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 32,
    marginVertical: 24,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a48ff'
  },
  timer: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32
  },
  controlButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#1a48ff'
  },
  controlLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  missing: {
    flex: 1,
    textAlign: 'center',
    marginTop: 64,
    fontSize: 18
  }
});

export default AudioPlayerScreen;
