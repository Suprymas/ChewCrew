import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {WhiteMainButton} from "../components/WhiteMainButton";
import {BlackMainButton} from "../components/BlackMainButton";
import RegularTextInput from "../components/RegularTextInput";

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Sign in to continue
        </Text>

        <View style={styles.form}>
          <RegularTextInput
            value={email}
            theme={theme}
            placeholder="Email"
            onChangeText={setEmail}
          />

          <RegularTextInput
            value={password}
            theme={theme}
            placeholder="Password"
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <WhiteMainButton
            onPress={handleLogin}
            loading={loading}
            theme={theme}
            text={'Sign In'}
          />

          <BlackMainButton
            onPress={() => navigation.navigate('SignUp')}
            loading={loading}
            theme={theme}
            text={'Sign Up'}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
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
  form: {
    gap: 16,
  },
});

export default LoginScreen;