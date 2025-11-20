import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {ThemeProvider} from "./context/ThemeContext";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthProvider} from "./context/AuthContext";
import MainApp from "./MainApp";
import {NavigationContainer} from "@react-navigation/native";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <MainApp/>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
