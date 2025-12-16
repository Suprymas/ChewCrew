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
import RegularTextInput from "../components/RegularTextInput";
import {WhiteMainButton} from "../components/WhiteMainButton";
import {BlackMainButton} from "../components/BlackMainButton";

const SignUpScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, displayName);
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Create Account
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Sign up to post and share your daily meals with your Friends and Family!
        </Text>
        

        <View style={styles.form}>
          <RegularTextInput
            value={displayName}
            theme={theme}
            placeholder="Display Name"
            onChangeText={setDisplayName}
          />
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
          />

          <RegularTextInput
            value={confirmPassword}
            theme={theme}
            placeholder="Confirm Password"
            onChangeText={setConfirmPassword}
          />

          <WhiteMainButton
            onPress={handleSignUp}
            loading={loading}
            theme={theme}
            text={'Sign Up'}
          />

          <BlackMainButton
            onPress={() => navigation.navigate('Login')}
            loading={loading}
            theme={theme}
            text={'Log In'}
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
    marginVertical: 40,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    padding: 16,
    fontSize: 16,
  }
});

export default SignUpScreen;