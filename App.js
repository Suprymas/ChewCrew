import {StatusBar, View} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {NavigationContainer} from "@react-navigation/native";
import {ThemeProvider} from "./context/ThemeContext";
import {AuthProvider} from "./context/AuthContext";
import MainApp from "./MainApp";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor="#000000" />
              <MainApp/>
            </NavigationContainer>
          </View>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
