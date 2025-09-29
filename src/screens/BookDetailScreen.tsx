import React, {useMemo} from 'react';
import {Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/AppNavigator';
import {useLibrary} from '@context/LibraryContext';
import ChapterList from '@components/ChapterList';
import {Book} from '@types/library';

const BookDetailScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'BookDetail'>> = ({route, navigation}) => {
  const {bookId} = route.params;
  const {books} = useLibrary();
  const book = useMemo(() => books.find(item => item.id === bookId), [books, bookId]);

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.missing}>Livre introuvable.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {book.cover ? <Image source={{uri: book.cover}} style={styles.cover} /> : <View style={styles.coverPlaceholder} />}
        <Text style={styles.title}>{book.title}</Text>
        {book.author ? <Text style={styles.author}>{book.author}</Text> : null}
        {book.description ? <Text style={styles.description}>{book.description}</Text> : null}
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() =>
              navigation.navigate(book.type === 'audio' ? 'AudioPlayer' : 'Reader', {
                bookId: book.id
              })
            }>
            <Text style={[styles.actionLabel, styles.primaryLabel]}>{book.type === 'audio' ? 'Écouter' : 'Lire'}</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.actionLabel}>Paramètres</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chapitres</Text>
          <ChapterList
            chapters={book.tracks}
            onPressChapter={chapter => navigateToPlayer(book, chapter.id, navigation)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const navigateToPlayer = (
  book: Book,
  chapterId: string,
  navigation: NativeStackScreenProps<RootStackParamList, 'BookDetail'>['navigation']
) => {
  if (book.type === 'audio') {
    navigation.navigate('AudioPlayer', {bookId: book.id, chapterId});
  } else {
    navigation.navigate('Reader', {bookId: book.id, location: chapterId});
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 24
  },
  cover: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16
  },
  coverPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#ececec',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '700'
  },
  author: {
    marginTop: 4,
    fontSize: 16,
    color: '#666'
  },
  description: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    color: '#444'
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a48ff'
  },
  primaryButton: {
    backgroundColor: '#1a48ff'
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a48ff'
  },
  primaryLabel: {
    color: '#fff'
  },
  section: {
    marginTop: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  missing: {
    flex: 1,
    textAlign: 'center',
    marginTop: 64,
    fontSize: 18
  }
});

export default BookDetailScreen;
