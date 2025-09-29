import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/AppNavigator';
import {useLibrary} from '@context/LibraryContext';
import ReaderService, {ReaderState} from '@services/ReaderService';

const ReaderScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Reader'>> = ({route}) => {
  const {bookId, location} = route.params;
  const {books} = useLibrary();
  const book = useMemo(() => books.find(item => item.id === bookId), [books, bookId]);
  const [readerState, setReaderState] = useState<ReaderState | null>(null);

  useEffect(() => {
    if (!book) return;
    ReaderService.getInitialState(book)
      .then(state => {
        if (location) {
          setReaderState({...state, location});
        } else {
          setReaderState(state);
        }
      })
      .catch(console.error);
  }, [book, location]);

  if (!book || !readerState) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.missing}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  const cycleTheme = () => {
    setReaderState(current => {
      if (!current) return current;
      const order: ReaderState['theme'][] = ['light', 'sepia', 'dark'];
      const nextTheme = order[(order.indexOf(current.theme) + 1) % order.length];
      const updated = {...current, theme: nextTheme};
      ReaderService.saveState(book, updated).catch(console.error);
      return updated;
    });
  };

  const increaseFont = (delta: number) => {
    setReaderState(current => {
      if (!current) return current;
      const fontScale = Math.max(0.8, Math.min(2, current.fontScale + delta));
      const updated = {...current, fontScale};
      ReaderService.saveState(book, updated).catch(console.error);
      return updated;
    });
  };

  const themeStyle = themeStyles(readerState.theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>{book.title}</Text>
        <View style={styles.toolbarActions}>
          <Pressable style={styles.toolbarButton} onPress={cycleTheme}>
            <Text style={styles.toolbarLabel}>Thème: {readerState.theme}</Text>
          </Pressable>
          <Pressable style={styles.toolbarButton} onPress={() => increaseFont(0.1)}>
            <Text style={styles.toolbarLabel}>A+</Text>
          </Pressable>
          <Pressable style={styles.toolbarButton} onPress={() => increaseFont(-0.1)}>
            <Text style={styles.toolbarLabel}>A-</Text>
          </Pressable>
        </View>
      </View>
      <View style={[styles.reader, {backgroundColor: themeStyle.background}]}>
        <Text style={[styles.readerText, {fontSize: 16 * readerState.fontScale, color: themeStyle.text}]}> 
          Prévisualisation de votre ebook…
        </Text>
      </View>
    </SafeAreaView>
  );
};

const themeStyles = (theme: ReaderState['theme']) => {
  switch (theme) {
    case 'dark':
      return {background: '#111', text: '#f0f0f0'};
    case 'sepia':
      return {background: '#f5ecd9', text: '#4a3d2f'};
    default:
      return {background: '#fff', text: '#111'};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd'
  },
  toolbarTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  toolbarActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12
  },
  toolbarButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0'
  },
  toolbarLabel: {
    fontSize: 14,
    fontWeight: '500'
  },
  reader: {
    flex: 1,
    padding: 24
  },
  readerText: {
    lineHeight: 24
  },
  missing: {
    flex: 1,
    textAlign: 'center',
    marginTop: 64,
    fontSize: 18
  }
});

export default ReaderScreen;
