import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import CrewListElement from "../components/CrewListElement";
import {CreateCrewButton} from "../components/CreateCrewButton";


const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [crews, setCrews] = useState([
    { id: 1, name: 'Crew 1', image: null, members: 5 },
    { id: 2, name: 'Crew 2', image: null, members: 3 },
    { id: 3, name: 'Crew 3', image: null, members: 8 },
  ]);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {paddingTop: insets.top + 20}]}>
        <Text style={[styles.headerText, {color: theme.colors.text}]}>
          Select Crew
        </Text>
      </View>

      <ScrollView
        style={styles.crewList}
        contentContainerStyle={styles.crewListContent}
        showsVerticalScrollIndicator={false}
      >
        {crews.map((crew) => (
          <CrewListElement crew={crew} key={crew.id} theme={theme}/>
        ))}

        <CreateCrewButton theme={theme} onPress={() => console.log('Create crew')}/>
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
});

export default HomeScreen;