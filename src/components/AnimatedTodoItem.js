import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme/colors';
import { commonStyles } from '../theme/styles';

export default function AnimatedTodoItem({ item, onToggle, onDelete, isNew = false }) {
  const scaleAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const slideAnim = useRef(new Animated.Value(isNew ? -50 : 0)).current;

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isNew]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onToggle(item.id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { translateX: slideAnim }
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        onPress={handleToggle}
        style={styles.todoContent}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
          {item.completed && (
            <Icon name="check" size={16} color="#fff" />
          )}
        </View>
        <Text
          style={[
            styles.todoText,
            item.completed && styles.completedText,
          ]}
          numberOfLines={2}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
        activeOpacity={0.7}
      >
        <Icon name="delete-outline" size={22} color={colors.error} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    ...commonStyles.checkbox,
  },
  checkboxCompleted: {
    ...commonStyles.checkboxCompleted,
  },
  todoText: {
    ...commonStyles.textPrimary,
    flex: 1,
  },
  completedText: {
    ...commonStyles.textCompleted,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
}); 