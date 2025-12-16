import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {WhiteMainButton} from "../components/WhiteMainButton";
import {useTheme} from "../context/ThemeContext";
import postService from "../services/PostService";
import FetchService from "../services/FetchService";

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = width * (4 / 3); // 3:4 aspect ratio (vertical)

const RecipeDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  let { item } = route.params;
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(item);

  useEffect(() => {
    if (item.image === undefined) {
      async function getPost() {
        try {
          setLoading(true);
          const { data, error } = await FetchService.fetchTableSingleRowById('post', item.id)

          if (error) throw error;
          item.image = data.image;
          setPost(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

      getPost();
    }
  }, [])

  async function handlePoke() {
    try {
      const errorData = await postService.insertData('poke', {
        poked_person: item.creator,
        post: item.post_id,
      })

      if (errorData) throw errorData;

      Alert.alert(
        "Person Was Poked!"
      )
    } catch (error) {
      return error;
    }
  }

  if (item.image === undefined || loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator color='white' size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white"/>
        </TouchableOpacity>
        <View style={styles.headerUser}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 20 }}>
              {post.creator_icon || '👤'}
            </Text>
          </View>
          <Text style={styles.username}>
            {post.creator} 
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => setIsImageFullScreen(true)}
          activeOpacity={0.9}
        >
          {post.image ? (
            <Image source={{ uri: post.image }} style={styles.recipeImage} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={60} color="#999" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={styles.row}>
            <View style={[styles.infoBadge, styles.visibilityBadge]}>
              <Text style={styles.badgeText}>Cooking for {post.cook_for}</Text>
            </View>
            <View style={[styles.infoBadge, styles.costBadge]}>
              <Text style={styles.badgeText}>Cost {post.cost}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.infoBadge, styles.timeBadge]}>
              <Text style={styles.badgeText}>Took {post.time_text}</Text>
            </View>
            <View style={[styles.infoBadge, styles.categoryBadge]}>
              <Text style={styles.badgeText}>{post.meal}</Text>
            </View>
          </View>

          <View style={styles.centerRow}>
            <View style={[styles.infoBadge, styles.tagsBadge]}>
              <Text style={styles.badgeText}>{JSON.parse(post?.tags).join(', ')}</Text>
            </View>
          </View>
        </View>

        <View style={{
          paddingHorizontal: 15,
          paddingBottom: 15,
        }}>
          <WhiteMainButton
            theme={theme}
            text={'Poke for recipe'}
            disabled={false}
            onPress={() => handlePoke()}
          />
        </View>
      </ScrollView>



      <Modal
        visible={isImageFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          <StatusBar hidden />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsImageFullScreen(false)}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fullScreenImageWrapper}
            activeOpacity={1}
            onPress={() => setIsImageFullScreen(false)}
          >
            {post.image ? (
              <Image
                source={{ uri: post.image }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.fullScreenPlaceholder}>
                <Ionicons name="image-outline" size={100} color="#999" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default RecipeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#E0E0E0',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  infoSection: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  infoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 70,
  },
  visibilityBadge: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFE5E5',
  },
  costBadge: {
    borderColor: '#007AFF',
    backgroundColor: '#E0F0FF',
  },
  timeBadge: {
    borderColor: '#34C759',
    backgroundColor: '#E5F9EC',
  },
  categoryBadge: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFE5E5',
  },
  tagsBadge: {
    borderColor: '#007AFF',
    backgroundColor: '#E0F0FF',
    flex: 0,
    minWidth: '60%',
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  fullScreenImageWrapper: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});