import React, {useState} from 'react';
import {Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';
import {useLibrary} from '@context/LibraryContext';

const SettingsScreen: React.FC = () => {
  const {settings, updateSettings} = useLibrary();
  const [pendingRoot, setPendingRoot] = useState('');

  const pickFolder = async () => {
    try {
      const result = await DocumentPicker.pickDirectory();
      if (result) {
        updateSettings(current => ({...current, rootUris: Array.from(new Set([...current.rootUris, result]))}));
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error) || isInProgress(error)) {
        return;
      }
      Alert.alert('Erreur', 'Impossible de sélectionner le dossier.');
    }
  };

  const addManualFolder = () => {
    if (!pendingRoot.trim()) {
      return;
    }
    updateSettings(current => ({...current, rootUris: Array.from(new Set([...current.rootUris, pendingRoot.trim()]))}));
    setPendingRoot('');
  };

  const toggleAutoScan = () => {
    updateSettings(current => ({...current, autoScanOnLaunch: !current.autoScanOnLaunch}));
  };

  const toggleTheme = () => {
    updateSettings(current => ({...current, theme: current.theme === 'dark' ? 'light' : 'dark'}));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Dossiers suivis</Text>
        {settings.rootUris.map(uri => (
          <View key={uri} style={styles.folderItem}>
            <Text numberOfLines={2} style={styles.folderLabel}>
              {uri}
            </Text>
          </View>
        ))}
        <Pressable style={[styles.button, styles.primaryButton]} onPress={pickFolder}>
          <Text style={[styles.buttonLabel, styles.primaryLabel]}>Choisir un dossier</Text>
        </Pressable>
        <View style={styles.manualInputRow}>
          <TextInput
            value={pendingRoot}
            onChangeText={setPendingRoot}
            placeholder="Ajouter un chemin manuellement"
            style={styles.textInput}
          />
          <Pressable style={[styles.button, styles.secondaryButton]} onPress={addManualFolder}>
            <Text style={styles.buttonLabel}>Ajouter</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analyse automatique</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Analyser au démarrage</Text>
            <Switch value={settings.autoScanOnLaunch} onValueChange={toggleAutoScan} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thème</Text>
          <Pressable style={[styles.button, styles.secondaryButton]} onPress={toggleTheme}>
            <Text style={styles.buttonLabel}>Mode actuel : {settings.theme}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 24,
    gap: 16
  },
  section: {
    marginTop: 12,
    gap: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  folderItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2'
  },
  folderLabel: {
    fontSize: 14,
    color: '#333'
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#1a48ff'
  },
  primaryLabel: {
    color: '#fff'
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1a48ff'
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a48ff'
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchLabel: {
    fontSize: 16
  }
});

export default SettingsScreen;
