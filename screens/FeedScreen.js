import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { BlurView } from 'expo-blur'; // Optional: for glass effect (remove if not using Expo)

const { width } = Dimensions.get('window');

const FeedScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userAvatars, setUserAvatars] = useState({}); // Map userId -> avatarUrl

  const fetchFeed = async () => {
    try {
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Get IDs of crews I am in
      const { data: myCrews, error: crewError } = await supabase
        .from('crew_members')
        .select('crew')
        .eq('member', user.id);

      if (crewError) throw crewError;
      
      const myCrewIds = myCrews.map(c => c.crew);

      if (myCrewIds.length === 0) {
        setPosts([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // 3. Get User IDs of everyone in those crews (My Network)
      const { data: crewMembers, error: memberError } = await supabase
        .from('crew_members')
        .select('member')
        .in('crew', myCrewIds);
      
      if (memberError) throw memberError;

      // Create a unique list of user IDs (including myself)
      const networkUserIds = [...new Set(crewMembers.map(m => m.member))];

      // 4. Fetch Posts from these users
      const { data: feedPosts, error: postError } = await supabase
        .from('post')
        .select('*')
        .in('creator', networkUserIds)
        .order('id', { ascending: false }) // Assuming higher ID = newer. Ideally use created_at
        .limit(20);

      if (postError) throw postError;

      // 5. Fetch Avatars for these creators (Batch fetch)
      // Note: This relies on user_photos table having a row per user
      const uniqueCreators = [...new Set(feedPosts.map(p => p.creator))];
      const { data: photosData } = await supabase
        .from('user_photos')
        .select('user_id, image_url')
        .in('user_id', uniqueCreators);

      // Create a lookup map for avatars
      const avatarMap = {};
      if (photosData) {
        photosData.forEach(p => {
          avatarMap[p.user_id] = p.image_url;
        });
      }
      setUserAvatars(avatarMap);
      setPosts(feedPosts);

    } catch (error) {
      console.error('Feed Error:', error);
      // Optional: Alert.alert("Error", "Could not load feed");
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

  const renderPost = ({ item }) => {
    // BeReal Style: Date formatting
    // Note: Assuming 'id' is a timestamp or you have a created_at column. 
    // If you don't have created_at, we can't show real time.
    const dateStr = "Today"; // dynamic date logic would go here

    return (
      <View style={styles.postContainer}>
        {/* Header: User Info */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <Image 
              source={{ 
                uri: userAvatars[item.creator] || 'https://via.placeholder.com/40' 
              }} 
              style={styles.avatar} 
            />
            <View>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                 User {item.creator.slice(0, 4)}... {/* Replace with real name if available */}
              </Text>
              <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                {/* Random location or real if you have it */}
                Dornbirn, Austria • {dateStr}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity>
             <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Main Content: BeReal Style Card */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: item.image }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Overlay Info (Meal & Cook For) */}
          <View style={styles.overlayContainer}>
             <BlurView intensity={20} tint="dark" style={styles.blurOverlay}>
                <View style={styles.overlayContent}>
                  <Text style={styles.mealTitle}>
                    {item.meal || "Delicious Meal"}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>cooking for {item.cook_for}</Text>
                    </View>
                    {item.time && (
                      <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Text style={styles.badgeText}>{item.time}</Text>
                      </View>
                    )}
                  </View>
                </View>
             </BlurView>
          </View>
        </View>
        
        {/* Caption/Cost/Tags area below image */}
        <View style={styles.captionArea}>
           {item.cost && (
             <Text style={[styles.costText, { color: theme.colors.text }]}>
               Est. Cost: {item.cost}
             </Text>
           )}
           {item.tags && (
             <Text style={[styles.tagsText, { color: theme.colors.textSecondary }]}>
               {item.tags}
             </Text>
           )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Header */}
      <View style={[styles.screenHeader, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.feedTitle, { color: theme.colors.text }]}>
          Your Crew Feed
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedTitle: {
    fontSize: 22,
    fontWeight: '800', // Heavy bold for BeReal look
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  postContainer: {
    marginBottom: 30,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
  },
  userName: {
    fontWeight: '700',
    fontSize: 14,
  },
  locationText: {
    fontSize: 12,
  },
  imageCard: {
    marginHorizontal: 12,
    height: width * 1.25, // 4:5 Aspect Ratio (Classic social media vertical)
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#222',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Provide gradient or blur here if needed
  },
  blurOverlay: {
    padding: 16,
    paddingBottom: 20,
  },
  overlayContent: {
    gap: 6,
  },
  mealTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  captionArea: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagsText: {
    fontSize: 13,
    marginTop: 2,
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