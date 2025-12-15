import React from "react";
import {Pressable, StyleSheet, Text} from "react-native";

export const BlackMainButton = ({onPress, loading, theme, text}) => {

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.buttonSecondary,
          borderRadius: theme.borderRadius.lg,
          borderColor: theme.colors.buttonSecondaryBorder,
          borderWidth: 1,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.linkText, { color: theme.colors.text }]}>
        {text}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  linkText: {
    fontSize: 14,
  }
});