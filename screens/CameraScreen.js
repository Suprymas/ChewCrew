import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const CameraScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Camera
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Time to BeReal
        </Text>

        <TouchableOpacity
          style={[styles.captureButton, {
            backgroundColor: theme.colors.button,
            borderRadius: theme.borderRadius.full,
          }]}
        >
          <Text style={styles.captureIcon}>📷</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureIcon: {
    fontSize: 40,
  },
});

export default CameraScreen;