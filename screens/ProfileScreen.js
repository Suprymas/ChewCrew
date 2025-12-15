import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BlackMainButton } from "../components/BlackMainButton";
import { Ionicons } from '@expo/vector-icons';
import PostService from "../services/PostService";

const AVAILABLE_ICONS = [
  '👤', '😊', '🍕', '🍔', '🍰', '🥗',
  '🍳', '🥘', '🍜', '🍱', '🌮', '🍣',
  '👨‍🍳', '👩‍🍳', '🔥', '⭐', '💯', '🎉'
];

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || 'User');
  const [selectedIcon, setSelectedIcon] = useState(user?.user_metadata?.icon || '👤');
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState(displayName);
  const [tempIcon, setTempIcon] = useState(selectedIcon);

  const handleSaveProfile = async () => {
    try {
      setDisplayName(tempDisplayName);
      setSelectedIcon(tempIcon);
      const { error } = await PostService.updateAuthTable({
        data: {
          display_name: tempDisplayName,
          icon: tempIcon,
        }
      })

      if (error) throw error;

      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setTempDisplayName(displayName);
    setTempIcon(selectedIcon);
    setShowEditModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* Avatar with Edit Button */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={[styles.avatar, {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.button,
            }]}
            onPress={() => setShowEditModal(true)}
          >
            <Text style={styles.avatarText}>{selectedIcon}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editIconButton}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="pencil" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Display Name with Edit Button */}
        <View style={styles.nameContainer}>
          <Text style={[styles.displayName, { color: theme.colors.text }]}>
            {displayName}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="pencil" size={18} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
          {user?.email}
        </Text>

        <TouchableOpacity
          style={[styles.button, {
            backgroundColor: theme.colors.button,
            borderRadius: theme.borderRadius.lg,
          }]}
          onPress={signOut}
        >
          <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
            Sign Out
          </Text>
        </TouchableOpacity>

        <View style={{height: 20}} />

        <BlackMainButton
          text={"My Crews"}
          theme={theme}
          onPress={() => navigation.navigate('MyCrews')}
        />
        <BlackMainButton
          text={"Create Crew"}
          theme={theme}
          onPress={() => navigation.navigate('CreateCrew')}
        />
        <BlackMainButton
          theme={theme}
          text={"Join Crew"}
          onPress={() => navigation.navigate('JoinCrew')}
        />
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Display Name
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                value={tempDisplayName}
                onChangeText={setTempDisplayName}
                placeholder="Enter display name"
                placeholderTextColor={theme.colors.textSecondary}
              />

              <Text style={[styles.label, { color: theme.colors.text }]}>
                Choose Icon
              </Text>
              <View style={styles.iconGrid}>
                {AVAILABLE_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      tempIcon === icon && styles.iconOptionSelected,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: tempIcon === icon ? theme.colors.button : theme.colors.border
                      }
                    ]}
                    onPress={() => setTempIcon(icon)}
                  >
                    <Text style={styles.iconOptionText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, {
                  backgroundColor: theme.colors.button
                }]}
                onPress={handleSaveProfile}
              >
                <Text style={[styles.saveButtonText, { color: theme.colors.buttonText }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 48,
  },
  editIconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  iconOptionSelected: {
    borderWidth: 3,
  },
  iconOptionText: {
    fontSize: 32,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default ProfileScreen;