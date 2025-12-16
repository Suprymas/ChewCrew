import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import PostElement from "../components/PostElement";
import fetchService from "../services/FetchService";

const FeedScreen = ({ navigation  }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeed = async () => {
    try {
      const { data, error } = await fetchService.callRPC('get_feed_with_display_names');

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Feed Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFeed();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeed();
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.screenHeader, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.feedTitle, { color: theme.colors.text }]}>
          Your Crew Feed
        </Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotifications}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.post_id.toString()}
          renderItem={({ item }) => (
            <PostElement item={item} theme={theme} navigation={navigation} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.text} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No posts yet! Join a crew or cook something up.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  notificationButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  }
});

export default FeedScreen;