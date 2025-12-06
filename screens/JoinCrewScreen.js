import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons'; // Assuming you use Expo
import { supabase } from '../lib/supabase';

const JoinCrewScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (code.length < 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-character access code.');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in first.");

      // 2. Find the crew associated with this code
      // We use .maybeSingle() instead of .single() to avoid an error if 0 rows are found
      const { data: crew, error: crewError } = await supabase
        .from('crew')
        .select('id, name, icon')
        .eq('access_code', code.toUpperCase()) // Ensure code is uppercase
        .maybeSingle();

      if (crewError) throw crewError;

      if (!crew) {
        Alert.alert('Crew Not Found', 'No crew found with that access code. Please check and try again.');
        setLoading(false);
        return;
      }

      // 3. Check if user is ALREADY a member
      const { data: existingMember, error: checkError } = await supabase
        .from('crew_members')
        .select('id')
        .eq('crew', crew.id)
        .eq('member', user.id)
        .maybeSingle();

      if (existingMember) {
        Alert.alert('Already Joined', `You are already a member of ${crew.name}!`);
        setLoading(false);
        return;
      }

      // 4. Join the crew (Insert into crew_members)
      const { error: joinError } = await supabase
        .from('crew_members')
        .insert({
          crew: crew.id,
          member: user.id
        });

      if (joinError) throw joinError;

      // 5. Success
      Alert.alert(
        'Welcome Aboard!',
        `You have successfully joined ${crew.icon || ''} ${crew.name}`,
        [
          { text: "OK", onPress: () => navigation.navigate('Home') } // Or navigate back
        ]
      );

    } catch (error) {
      console.error('Join Error:', error);
      Alert.alert('Error', error.message || 'Could not join crew.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Join a Crew
          </Text>
          <View style={{ width: 24 }} /> {/* Spacer for balance */}
        </View>

        <View style={styles.content}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            ENTER ACCESS CODE
          </Text>

          {/* Code Input Field */}
          <View style={[styles.inputContainer, { 
            borderColor: theme.colors.primary, 
            backgroundColor: theme.colors.surface 
          }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={code}
              onChangeText={setCode}
              placeholder="Ex: A4K92L"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
              returnKeyType="done"
            />
          </View>

          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            Ask the crew creator for the 6-character code found on their settings screen.
          </Text>

          {/* Join Button */}
          <TouchableOpacity
            style={[
              styles.joinButton,
              { 
                backgroundColor: code.length === 6 ? theme.colors.primary : theme.colors.border,
                opacity: loading ? 0.7 : 1
              }
            ]}
            onPress={handleJoin}
            disabled={code.length !== 6 || loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.buttonText} />
            ) : (
              <Text style={[styles.joinButtonText, { color: theme.colors.buttonText }]}>
                Join Crew
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1,
  },
  inputContainer: {
    height: 80,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 8,
  },
  helperText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  joinButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JoinCrewScreen;