import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";


export function TagsInput({ theme, onPress, tags, callbackfn, disabled=false }) {
  return <View style={styles.fieldContainer}>
    <View style={styles.labelRow}>
      <Text style={[styles.label, {color: "#2196F3"}]}>
        Tags
      </Text>
    </View>
    <TouchableOpacity
      style={[styles.input, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        justifyContent: "center",
        minHeight: 44,
        opacity: disabled ? 0.5 : 1,
      }]}
      disabled={disabled}
      onPress={onPress}
    >
      {tags.length > 0 ? (
        <View style={styles.tagsContainer}>
          {tags.map(callbackfn)}
        </View>
      ) : (
        <Text style={[styles.inputText, {color: theme.colors.textSecondary}]}>
          Select tags
        </Text>
      )}
      <Text style={styles.dropdownArrow}>▼</Text>
    </TouchableOpacity>
  </View>;
}


const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
});
