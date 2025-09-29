import React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LibraryScreen from '@screens/LibraryScreen';
import BookDetailScreen from '@screens/BookDetailScreen';
import AudioPlayerScreen from '@screens/AudioPlayerScreen';
import ReaderScreen from '@screens/ReaderScreen';
import SettingsScreen from '@screens/SettingsScreen';
import {useColorScheme} from 'react-native';

export type RootStackParamList = {
  Library: undefined;
  BookDetail: {bookId: string};
  AudioPlayer: {bookId: string; chapterId?: string};
  Reader: {bookId: string; location?: string};
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Library" component={LibraryScreen} options={{title: 'Bibliothèque'}} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{title: 'Détails'}} />
        <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} options={{title: 'Lecture audio'}} />
        <Stack.Screen name="Reader" component={ReaderScreen} options={{title: 'Lecture'}} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{title: 'Paramètres'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
