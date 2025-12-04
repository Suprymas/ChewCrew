import {Dimensions, Image, StyleSheet, Text, TouchableOpacity} from "react-native";
import React from "react";

export function ImageInput({ theme, onPress, image }) {
  return <TouchableOpacity
    style={[styles.cameraContainer, {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
    }]}
    onPress={onPress}
  >
    {image ? (
      <Image source={{uri: image}} style={styles.image}/>
    ) : (
      <Text style={styles.cameraIcon}>📷</Text>
    )}
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  cameraContainer: {
    aspectRatio: 16 / 9,
    borderWidth: 2,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: Dimensions.get('screen').width - 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cameraIcon: {
    fontSize: 64,
  },
});