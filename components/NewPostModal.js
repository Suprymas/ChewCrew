import {FlatList, Modal, StyleSheet, Text, Pressable, View} from "react-native";
import React from "react";

export function NewPostModal({
  visible,
  onRequestClose,
  theme,
  currentField,
  dropdownOptions,
  renderItem,
  keyExtractor,
}) {
  return <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onRequestClose}
  >
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
      }]}>
        <View style={[styles.modalHeader, {borderBottomColor: theme.colors.border}]}>
          <Text style={[styles.modalTitle, {color: theme.colors.text}]}>
            {currentField === "whoDidYouCookFor" && "Who did you cook for?"}
            {currentField === "costPerServe" && "Cost per Serve?"}
            {currentField === "timeToCook" && "Time to cook?"}
            {currentField === "meal" && "Meal"}
            {currentField === "tags" && "Tags"}
          </Text>
          <Pressable onPress={onRequestClose}>
            <Text style={[styles.modalClose, {color: theme.colors.text}]}>
              {currentField === "tags" ? "Done" : "✕"}
            </Text>
          </Pressable>
        </View>
        <FlatList
          data={currentField ? dropdownOptions[currentField] : []}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.dropdownList}
        />
      </View>
    </View>
  </Modal>;
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 24,
  }
});