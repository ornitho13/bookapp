import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Chapter} from '@types/library';

interface Props {
  chapters: Chapter[];
  activeChapterId?: string;
  onPressChapter?: (chapter: Chapter) => void;
}

const ChapterList: React.FC<Props> = ({chapters, activeChapterId, onPressChapter}) => {
  return (
    <FlatList
      data={chapters}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => {
        const isActive = item.id === activeChapterId;
        return (
          <Pressable style={[styles.item, isActive && styles.active]} onPress={() => onPressChapter?.(item)}>
            <View style={styles.indexBubble}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.meta}>
              <Text style={[styles.title, isActive && styles.titleActive]} numberOfLines={1}>
                {item.title}
              </Text>
              {typeof item.duration === 'number' ? <Text style={styles.duration}>{formatDuration(item.duration)}</Text> : null}
            </View>
          </Pressable>
        );
      }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  active: {
    backgroundColor: '#f0f4ff'
  },
  indexBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  indexText: {
    fontWeight: '600'
  },
  meta: {
    flex: 1,
    marginLeft: 12
  },
  title: {
    fontSize: 15,
    color: '#222'
  },
  titleActive: {
    color: '#1a48ff'
  },
  duration: {
    marginTop: 4,
    color: '#666',
    fontSize: 13
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd'
  }
});

export default ChapterList;
