import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Book} from '@types/library';

interface Props {
  book: Book;
  onPress?: (book: Book) => void;
}

const BookCard: React.FC<Props> = ({book, onPress}) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(book)}>
      <View style={styles.coverContainer}>
        {book.cover ? <Image source={{uri: book.cover}} style={styles.cover} /> : <View style={styles.placeholder} />}
      </View>
      <View style={styles.meta}>
        <Text numberOfLines={2} style={styles.title}>
          {book.title}
        </Text>
        {book.author ? (
          <Text numberOfLines={1} style={styles.author}>
            {book.author}
          </Text>
        ) : null}
        <Text style={styles.type}>{book.type === 'audio' ? 'Livre audio' : 'Ebook'}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    elevation: 1
  },
  coverContainer: {
    width: 64,
    height: 96,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2'
  },
  cover: {
    width: '100%',
    height: '100%'
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#d0d0d0'
  },
  meta: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222'
  },
  author: {
    fontSize: 14,
    color: '#555',
    marginTop: 4
  },
  type: {
    marginTop: 8,
    fontSize: 12,
    color: '#888'
  }
});

export default BookCard;
