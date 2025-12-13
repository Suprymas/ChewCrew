import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { View, Text, StyleSheet } from 'react-native';

// Import screens
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
            <View style={[styles.cameraIconContainer, {
              backgroundColor: focused ? theme.colors.button : 'transparent',
            }]}>
              <Text style={styles.tabIcon}>👀</Text>
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
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.cameraIconContainer, {
              backgroundColor: focused ? theme.colors.button : 'transparent',
            }]}>
              <Text style={styles.tabIcon}>👤</Text>
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
    fontSize: 32,
  },
  cameraIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginTop: -10,
  },
  cameraIcon: {
    fontSize: 36,
  },
});

export default TabNavigator;