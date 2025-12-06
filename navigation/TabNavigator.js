import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { View, Text, StyleSheet } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/NewPostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewPostScreen from "../screens/NewPostScreen";
import FeedScreen from '../screens/FeedScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      id={'tab-bar'}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIcon, { fontSize: size + 4 }]}>👀</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="NewPost"
        component={NewPostScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.cameraIconContainer, {
              backgroundColor: focused ? theme.colors.button : 'transparent',
              borderColor: theme.colors.button,
            }]}>
              <Text style={[styles.cameraIcon, {
                fontSize: size + 8,
              }]}>📷</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={[styles.tabIcon, { fontSize: size + 4 }]}>👤</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 28,
  },
  cameraIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginTop: -10,
  },
  cameraIcon: {
    fontSize: 32,
  },
});

export default TabNavigator;