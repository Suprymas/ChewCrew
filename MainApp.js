import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './context/ThemeContext';

const MainApp = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          BeReal Style App
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.button,
              borderRadius: theme.borderRadius.lg,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
            Take Photo
          </Text>
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
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  button: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainApp;