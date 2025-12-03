import {StyleSheet, TextInput} from "react-native";
import React from "react";


const RegularTextInput = ({value, theme, placeholder, onChangeText, secureTextEntry=null}) => {
  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          borderRadius: theme.borderRadius.md,
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      secureTextEntry={secureTextEntry}
    />
  )
}

export default RegularTextInput;


const styles = StyleSheet.create({
  input: {
    padding: 16,
    fontSize: 16,
  },
});