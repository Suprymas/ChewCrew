import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { JoinCrewButton } from '../components/JoinCrewButton';
import { CreateCrewButton } from '../components/CreateCrewButton';
const ProfileScreen = ({navigation}) => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={[styles.avatar, {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.button,
        }]}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <Text style={[styles.email, { color: theme.colors.text }]}>
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
        <TouchableOpacity>
          <CreateCrewButton theme={theme} onPress={() => navigation.navigate('CreateCrew')} />
          <JoinCrewButton theme={theme} onPress={()=>navigation.navigate('JoinCrew')}/>
        </TouchableOpacity>
      </View>
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 48,
  },
  email: {
    fontSize: 18,
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
});

export default ProfileScreen;