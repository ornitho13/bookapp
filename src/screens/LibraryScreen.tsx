import React, {useCallback, useEffect} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/AppNavigator';
import {useLibrary} from '@context/LibraryContext';
import BookCard from '@components/BookCard';

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyTitle}>Votre bibliothèque est vide</Text>
    <Text style={styles.emptyDescription}>
      Sélectionnez un dossier contenant vos livres audio ou ebooks depuis l'écran Paramètres.
    </Text>
  </View>
);

type Props = NativeStackScreenProps<RootStackParamList, 'Library'>;

const LibraryScreen: React.FC<Props> = ({navigation}) => {
  const {books, isScanning, refreshLibrary} = useLibrary();

  const load = useCallback(() => {
    refreshLibrary().catch(console.error);
  }, [refreshLibrary]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      {isScanning ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
          <Text style={styles.loaderLabel}>Analyse des dossiers…</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={isScanning} onRefresh={load} />}
          renderItem={({item}) => (
            <BookCard
              book={item}
              onPress={book => navigation.navigate('BookDetail', {bookId: book.id})}
            />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={books.length ? undefined : styles.emptyContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loaderLabel: {
    marginTop: 16,
    fontSize: 16,
    color: '#333'
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  emptyState: {
    alignItems: 'center',
    gap: 12
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#666'
  }
});

export default LibraryScreen;
