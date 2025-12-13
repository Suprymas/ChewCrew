import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import RegularTextInput from "../components/RegularTextInput";
import * as Clipboard from 'expo-clipboard';
import {useAuth} from "../context/AuthContext";
import postService from "../services/PostService";

const CrewCreationScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [crewName, setCrewName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👥');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [accessCode, setAccessCode] = useState(null);
  const [isCreated, setIsCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const emojis = [
    '👥', '🍕', '🍔', '🍜', '🍱', '🍛', '🍝', '🥗',
    '🌮', '🌯', '🥙', '🍳', '🥘', '🍲', '🥟', '🍢',
    '👨‍🍳', '👩‍🍳', '🔥', '⭐', '❤️', '🎉', '🏆', '💪'
  ];

  const handleCreate = async () => {
    if (!crewName.trim()) {
      Alert.alert('Error', 'Please enter a crew name');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await postService.createCrew({
        name: crewName,
        icon: selectedEmoji,
        creatorId: user.id
      });

      if (error) throw error;

      if (data) {
        setAccessCode(data.access_code);
        setIsCreated(true);
      }
    } catch (error) {
      console.error('Error creating crew:', error);
      Alert.alert('Error', error.message || 'Failed to create crew');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (accessCode) {
      await Clipboard.setStringAsync(accessCode);
    }
  };

  const handleDone = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, {
        paddingTop: insets.top + 16,
        borderBottomColor: theme.colors.border
      }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          New Crew
        </Text>

        {!isCreated ? (
          <TouchableOpacity
            style={[styles.createButton, { borderColor: theme.colors.button, opacity: loading ? 0.5 : 1 }]}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={[styles.createIcon, { color: theme.colors.text }]}>✓</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.doneButton, {
              backgroundColor: theme.colors.button,
              borderRadius: theme.borderRadius.md,
            }]}
            onPress={handleDone}
          >
            <Text style={[styles.doneText, { color: theme.colors.buttonText }]}>
              Done
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Emoji Icon */}
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={[styles.iconButton, {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.button,
              borderRadius: theme.borderRadius.full,
            }]}
            onPress={() => !isCreated && setShowEmojiPicker(!showEmojiPicker)}
            disabled={isCreated}
          >
            <Text style={styles.iconEmoji}>{selectedEmoji}</Text>
          </TouchableOpacity>
          {!isCreated && (
            <Text style={[styles.iconHint, { color: theme.colors.textSecondary }]}>
              Tap to change
            </Text>
          )}
        </View>

        {/* Emoji Picker */}
        {showEmojiPicker && !isCreated && (
          <View style={[styles.emojiPicker, {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
          }]}>
            <View style={styles.emojiGrid}>
              {emojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && {
                      backgroundColor: theme.colors.border,
                      borderRadius: theme.borderRadius.sm,
                    }
                  ]}
                  onPress={() => {
                    setSelectedEmoji(emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Crew Name */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
            Crew Name
          </Text>
          <RegularTextInput
            theme={theme}
            value={crewName}
            onChangeText={setCrewName}
            placeholder="Enter crew name..."
            editable={!isCreated && !loading}
          />
        </View>

        {/* Access Code - Replaces Invite Link */}
        {isCreated && accessCode && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Crew Access Code
            </Text>
            
            <View style={[styles.codeContainer, {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadius.md,
            }]}>
              <Text style={[styles.codeText, { color: theme.colors.primary || theme.colors.text }]}>
                {accessCode}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.copyButtonLarge, {
                backgroundColor: theme.colors.button,
                borderRadius: theme.borderRadius.md,
              }]}
              onPress={handleCopyCode}
            >
              <Text style={[styles.copyButtonText, { color: theme.colors.buttonText }]}>
                Copy Code
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.inviteHint, { color: theme.colors.textSecondary }]}>
              Share this code so others can join your crew!
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  createButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIcon: {
    fontSize: 18,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  iconButton: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 8,
  },
  iconEmoji: {
    fontSize: 60,
  },
  iconHint: {
    fontSize: 14,
  },
  emojiPicker: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiButton: {
    width: '12%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  // New Styles for Access Code
  codeContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  copyButtonLarge: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inviteHint: {
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default CrewCreationScreen;