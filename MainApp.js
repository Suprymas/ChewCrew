import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

import TabNavigator from './navigation/TabNavigator';


import LoginScreen from './screens/LoginScreen';
import SignUpScreen from "./screens/SignupScreen";
import CameraScreen from './screens/CameraScreen';
import CreateCrewScreen from "./screens/CreateCrewScreen";
import JoinCrewScreen from './screens/JoinCrewScreen';
import RecipeDetailScreen from "./screens/PostScreen";
import NotificationScreen from "./screens/NotificationScreen";
import MyCrewsScreen from "./screens/MyCrewsScreen";


const Stack = createNativeStackNavigator();

const MainApp = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.text} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      id={'root'}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
      
    >
      {user ? (
        // Authenticated Stack
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="CreateCrew" component={CreateCrewScreen} />
          <Stack.Screen name="JoinCrew" component={JoinCrewScreen}/>
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="MyCrews" component={MyCrewsScreen} />
        </>
      ) : (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainApp;