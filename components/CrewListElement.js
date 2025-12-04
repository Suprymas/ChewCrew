import {Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";


const CrewListElement = ({crew, theme}) => {
  return (
    <Pressable
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
    </Pressable>
  )
}

const styles = StyleSheet.create({
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
  }
});

export default CrewListElement;