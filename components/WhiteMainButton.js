import React, {useState} from "react";
import {Pressable, StyleSheet, Text} from "react-native";

export const WhiteMainButton = ({onPress, loading, theme, text}) => {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.button,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
        {text}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    padding: 16,
    fontSize: 16,
  },
  button: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: '600',
  },
});