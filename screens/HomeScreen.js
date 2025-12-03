import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [crews, setCrews] = useState([
    { id: 1, name: 'Crew 1', image: null, members: 5 },
    { id: 2, name: 'Crew 2', image: null, members: 3 },
    { id: 3, name: 'Crew 3', image: null, members: 8 },
  ]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          Select Crew
        </Text>
      </View>

      <ScrollView
        style={styles.crewList}
        contentContainerStyle={styles.crewListContent}
        showsVerticalScrollIndicator={false}
      >
        {crews.map((crew) => (
          <TouchableOpacity
            key={crew.id}
            style={[styles.crewItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => console.log('Selected:', crew.name)}
          >
            <View style={[styles.crewImagePlaceholder, {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.button
            }]}>
              <Text style={styles.placeholderText}>👥</Text>
            </View>
            <View style={styles.crewInfo}>
              <Text style={[styles.crewName, { color: theme.colors.text }]}>
                {crew.name}
              </Text>
              <Text style={[styles.crewMembers, { color: theme.colors.textSecondary }]}>
                {crew.members} members
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Create New Crew */}
        <TouchableOpacity
          style={[styles.crewItem, { borderBottomColor: theme.colors.border }]}
          onPress={() => console.log('Create crew')}
        >
          <View style={[styles.crewImagePlaceholder, {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.button
          }]}>
            <Text style={[styles.plusIcon, { color: theme.colors.text }]}>+</Text>
          </View>
          <Text style={[styles.crewName, { color: theme.colors.text }]}>
            Create new Crew
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  crewList: {
    flex: 1,
  },
  crewListContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  crewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  crewImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: 16,
  },
  placeholderText: {
    fontSize: 28,
  },
  crewInfo: {
    flex: 1,
  },
  crewName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  crewMembers: {
    fontSize: 14,
  },
  plusIcon: {
    fontSize: 36,
    fontWeight: '300',
  },
});

export default HomeScreen;