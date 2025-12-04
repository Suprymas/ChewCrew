import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";

export function CreateCrewButton({ theme, onPress }) {
  return (
    <TouchableOpacity
    style={[styles.crewItem, {borderBottomColor: theme.colors.border}]}
    onPress={onPress}
    >
      <View style={[styles.crewImagePlaceholder, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.button
      }]}>
        <Text style={[styles.plusIcon, {color: theme.colors.text}]}>+</Text>
      </View>
      <Text style={[styles.crewName, {color: theme.colors.text}]}>
        Create new Crew
      </Text>
    </TouchableOpacity>
  );
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
  crewName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  }
});