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
import {supabase} from "../lib/supabase";

const CrewCreationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [crewName, setCrewName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👥');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inviteLink, setInviteLink] = useState(null);
  const [isCreated, setIsCreated] = useState(false);

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

    const {data, error} = await supabase
      .from('crew')
      .insert({name: crewName.trim(), icon: selectedEmoji});

    const newCrewId = `crew_${Date.now()}`;
    const newInviteLink = `https://app.crew.com/invite/${newCrewId}`;

    console.log('Create crew:', {
      crewId: newCrewId,
      crewName,
      selectedEmoji,
    });

    setInviteLink(newInviteLink);
    setIsCreated(true);
    Alert.alert('Success!', 'Crew created! Share the invite link with your friends.');
  };

  const handleCopyLink = async () => {
    if (inviteLink) {
      await Clipboard.setStringAsync(inviteLink);
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
            style={[styles.createButton, { borderColor: theme.colors.button }]}
            onPress={handleCreate}
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
            editable={!isCreated}
          />
        </View>

        {/* Invite Link - Only shown after crew is created */}
        {inviteLink && isCreated && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Invite Link
            </Text>
            <TouchableOpacity
              style={[styles.inviteLinkContainer, {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
              }]}
              onPress={handleCopyLink}
            >
              <Text
                style={[styles.inviteLinkText, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {inviteLink}
              </Text>
              <View style={[styles.copyButton, {
                backgroundColor: theme.colors.button,
                borderRadius: theme.borderRadius.sm,
              }]}>
                <Text style={[styles.copyButtonText, { color: theme.colors.buttonText }]}>
                  Copy
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={[styles.inviteHint, { color: theme.colors.textSecondary }]}>
              Share this link to invite people to your crew
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
  inviteLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  inviteLinkText: {
    flex: 1,
    fontSize: 14,
  },
  copyButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inviteHint: {
    fontSize: 12,
    marginTop: 8,
  },
});

export default CrewCreationScreen;