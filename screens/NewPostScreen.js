import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';


//Cam

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';


const CameraScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [whoDidYouCookFor, setWhoDidYouCookFor] = useState('');
  const [costPerServe, setCostPerServe] = useState('');
  const [timeToCook, setTimeToCook] = useState('');
  const [meal, setMeal] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);

  
  
  
  
  //camera function
  const handleTakePhoto = () => {
  navigation.getParent()?.navigate('Camera');
        console.log('Open camera');

  }
    
  


  
  const handleSubmit = () => {
    console.log('Submit crew post');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, {
        paddingTop: insets.top + 16,
        borderBottomColor: theme.colors.border
      }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          New Crew
        </Text>

        <TouchableOpacity
          style={[styles.addButton, { borderColor: theme.colors.button }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.addIcon, { color: theme.colors.text }]}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera/Image Area */}
        <TouchableOpacity
          style={[styles.cameraContainer, {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.lg,
          }]}
          onPress={handleTakePhoto}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.cameraIcon}>📷</Text>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Who did you cook for? */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={[styles.label, styles.labelRed]}>
                Who did you cook for?
              </Text>
            </View>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
              }]}
              value={whoDidYouCookFor}
              onChangeText={setWhoDidYouCookFor}
              placeholder="Enter names..."
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Cost per Serve? */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={[styles.label, styles.labelBlue]}>
                Cost per Serve?
              </Text>
            </View>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
              }]}
              value={costPerServe}
              onChangeText={setCostPerServe}
              placeholder="$"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Time to cook? */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.xmark}>✕</Text>
              <Text style={[styles.label, styles.labelGreen]}>
                Time to cook?
              </Text>
            </View>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
              }]}
              value={timeToCook}
              onChangeText={setTimeToCook}
              placeholder="Minutes"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Meal */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.xmark}>✕</Text>
              <Text style={[styles.label, styles.labelPink]}>
                Meal
              </Text>
            </View>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
              }]}
              value={meal}
              onChangeText={setMeal}
              placeholder="What did you make?"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Tags */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.xmark}>✕</Text>
              <Text style={[styles.label, styles.labelPurple]}>
                Tags
              </Text>
            </View>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
              }]}
              value={tags}
              onChangeText={setTags}
              placeholder="Add tags..."
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 20,
    fontWeight: '300',
  },
  content: {
    flex: 1,
  },
  cameraContainer: {
    margin: 20,
    aspectRatio: 16 / 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cameraIcon: {
    fontSize: 64,
  },
  form: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  checkmark: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  xmark: {
    fontSize: 20,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  labelRed: {
    color: '#FF6B6B',
  },

    labelPink: {
    color: '#ff6bfaff',
    },
    labelPurple: {
    color: '#ba6bffff',
  },
  labelBlue: {
    color: '#2196F3',
  },
  labelGreen: {
    color: '#4CAF50',
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
});

export default CameraScreen;