import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from "expo-blur";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PostElement = ({ item, theme }) => {
  const dateStr = "Today"; // dynamic date logic would go here
  const tags = JSON.parse(item?.tags);

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              User {item.creator.slice(0, 4)}...
            </Text>
            <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
              Dornbirn, Austria • {dateStr}
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View style={styles.overlayContainer}>
          <View style={styles.blurOverlay}>
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
          </View>
        </View>
      </View>

      <View style={styles.captionArea}>
        {item.cost && (
          <Text style={[styles.costText, { color: theme.colors.text }]}>
            Est. Cost: {item.cost}
          </Text>
        )}
        {item.tags && (
          <Text style={[styles.tagsText, { color: theme.colors.textSecondary }]}>
            {tags.join(', ')}
          </Text>
        )}
      </View>
    </View>
  );
};

export default PostElement;


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