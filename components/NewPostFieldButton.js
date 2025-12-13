import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";

const NewPostFieldButton = ({ label, value, onPress, color, theme, disabled=false }) => (
  <View style={styles.fieldContainer}>
    <View style={styles.labelRow}>
      <Text style={[styles.label, { color }]}>
        {label}
      </Text>
    </View>
    <TouchableOpacity
      style={[styles.input, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[
        styles.inputText,
        { color: value ? theme.colors.text : theme.colors.textSecondary }
      ]}>
        {value || `Select ${label.toLowerCase()}`}
      </Text>
      <Text style={styles.dropdownArrow}>▼</Text>
    </TouchableOpacity>
  </View>
);

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
});

export default NewPostFieldButton;