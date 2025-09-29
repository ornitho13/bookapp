import React, {useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import AppNavigator from '@navigation/AppNavigator';
import {LibraryProvider, useLibrary} from '@context/LibraryContext';
import LibraryRepository from '@services/LibraryRepository';

const Boot: React.FC = () => {
  const {updateSettings} = useLibrary();
  const scheme = useColorScheme();

  useEffect(() => {
    LibraryRepository.getSettings()
      .then(stored => {
        if (stored) {
          updateSettings(() => stored);
        }
      })
      .catch(console.error);
  }, [updateSettings]);

  return (
    <>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </>
  );
};

const App: React.FC = () => {
  return (
    <LibraryProvider>
      <Boot />
    </LibraryProvider>
  );
};

export default App;
