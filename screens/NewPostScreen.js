import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import NewPostFieldButton from "../components/NewPostFieldButton";
import {ImageInput} from "../components/ImageInput";
import {NewPostModal} from "../components/NewPostModal";
import {TagsInput} from "../components/TagsInput";

const CameraScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [image, setImage] = useState(null);
  const [whoDidYouCookFor, setWhoDidYouCookFor] = useState('');
  const [costPerServe, setCostPerServe] = useState('');
  const [timeToCook, setTimeToCook] = useState('');
  const [meal, setMeal] = useState('');
  const [tags, setTags] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  // Dropdown options
  const dropdownOptions = {
    whoDidYouCookFor: ['Family', 'Friends', 'Partner', 'Kids', 'Guests', 'Solo'],
    costPerServe: ['$0-5', '$5-10', '$10-15', '$15-20', '$20+'],
    timeToCook: ['< 15 min', '15-30 min', '30-45 min', '45-60 min', '1+ hour'],
    meal: ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
    tags: ['Healthy', 'Quick', 'Budget', 'Gourmet', 'Comfort Food', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Kid-Friendly', 'Date Night'],
  };

  const handleTakePhoto = () => {
    // TODO: Implement camera functionality
    console.log('Open camera');
  };

  const handleSubmit = () => {
    console.log('Submit crew post', {
      whoDidYouCookFor,
      costPerServe,
      timeToCook,
      meal,
      tags,
    });
  };

  const openDropdown = (field) => {
    setCurrentField(field);
    setModalVisible(true);
  };

  const handleSelect = (value) => {
    if (currentField === 'tags') {
      if (tags.includes(value)) {
        setTags(tags.filter(tag => tag !== value));
      } else {
        setTags([...tags, value]);
      }
    } else {
      switch (currentField) {
        case 'whoDidYouCookFor':
          setWhoDidYouCookFor(value);
          setModalVisible(false);
          break;
        case 'costPerServe':
          setCostPerServe(value);
          setModalVisible(false);
          break;
        case 'timeToCook':
          setTimeToCook(value);
          setModalVisible(false);
          break;
        case 'meal':
          setMeal(value);
          setModalVisible(false);
          break;
      }
    }
  };

  const renderDropdownItem = ({ item }) => {
    const isSelected = currentField === 'tags'
      ? tags.includes(item)
      : false;

    return (
      <TouchableOpacity
        style={[
          styles.dropdownItem,
          {
            backgroundColor: isSelected ? theme.colors.surface : 'transparent',
            borderBottomColor: theme.colors.border,
          }
        ]}
        onPress={() => handleSelect(item)}
      >
        <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>
          {item}
        </Text>
        {isSelected && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {
        paddingTop: insets.top + 16,
        borderBottomColor: theme.colors.border
      }]}>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
          New Post
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{paddingBottom: 100,}}
        showsVerticalScrollIndicator={false}
      >
        <ImageInput theme={theme} onPress={handleTakePhoto} image={image}/>

        <View style={styles.form}>
          <NewPostFieldButton
            label="Who did you cook for?"
            value={whoDidYouCookFor}
            onPress={() => openDropdown('whoDidYouCookFor')}
            color="#FF6B6B"
            theme={theme}
          />

          <NewPostFieldButton
            label="Cost per Serve?"
            value={costPerServe}
            onPress={() => openDropdown('costPerServe')}
            color="#2196F3"
            theme={theme}
          />

          <NewPostFieldButton
            label="Time to cook?"
            value={timeToCook}
            onPress={() => openDropdown('timeToCook')}
            color="#4CAF50"
            theme={theme}
          />

          <NewPostFieldButton
            label="Meal"
            value={meal}
            onPress={() => openDropdown('meal')}
            color="#FF6B6B"
            theme={theme}
          />

          <TagsInput theme={theme} onPress={() => openDropdown('tags')} tags={tags} callbackfn={(tag, index) => (
            <View key={index} style={[styles.tag, {
              backgroundColor: theme.colors.border,
              borderRadius: theme.borderRadius.sm,
            }]}>
              <Text style={[styles.tagText, {color: theme.colors.text}]}>
                {tag}
              </Text>
            </View>
          )}/>
        </View>
      </ScrollView>

      <NewPostModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        theme={theme}
        currentField={currentField}
        dropdownOptions={dropdownOptions}
        renderItem={renderDropdownItem}
        keyExtractor={(item) => item}/>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 20,
  },
  checkmark: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 14,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

export default CameraScreen;