import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../theme/colors';
import { commonStyles } from '../theme/styles';
import StatsCard from '../components/StatsCard';
import AnimatedTodoItem from '../components/AnimatedTodoItem';

const STORAGE_KEY = "@todos";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ToDoScreen() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newTaskId, setNewTaskId] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setTodos(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error("Error saving todos:", error);
      }
    };
    saveTodos();
  }, [todos]);

  const handleAddTask = () => {
    if (task.trim().length === 0) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newTodo = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setNewTaskId(newTodo.id);
    setTask("");
    
    // Reset newTaskId after animation
    setTimeout(() => setNewTaskId(null), 500);
  };

  const toggleComplete = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const confirmDeleteTask = (id) => {
    setTaskToDelete(id);
    setModalVisible(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
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
  };

  const deleteTask = () => {
    if (taskToDelete !== null) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTodos((prev) => prev.filter((todo) => todo.id !== taskToDelete));
      setTaskToDelete(null);
    }
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  const cancelDelete = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setTaskToDelete(null);
    });
  };

  const renderItem = ({ item, index }) => (
    <AnimatedTodoItem
      item={item}
      onToggle={toggleComplete}
      onDelete={confirmDeleteTask}
      isNew={item.id === newTaskId}
    />
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="assignment" size={80} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No hay tareas</Text>
      <Text style={styles.emptySubtitle}>¡Agrega tu primera tarea para comenzar!</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={gradients.background}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Tareas</Text>
          <Text style={styles.subtitle}>Organiza tu día</Text>
        </View>

        {todos.length > 0 && <StatsCard todos={todos} />}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="¿Qué necesitas hacer?"
              placeholderTextColor="#999"
              value={task}
              onChangeText={setTask}
              onSubmitEditing={handleAddTask}
            />
            <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
              <LinearGradient
                colors={gradients.primary}
                style={styles.addButtonGradient}
              >
                <Icon name="add" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={todos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={EmptyComponent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="none"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.modalContent, 
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.modalIcon}>
                <Icon name="warning" size={40} color={colors.error} />
              </View>
              <Text style={styles.modalTitle}>Eliminar tarea</Text>
              <Text style={styles.modalText}>
                ¿Estás seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelDelete}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButtonModal}
                  onPress={deleteTask}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    ...commonStyles.header,
    paddingTop: 40,
  },
  title: {
    ...commonStyles.title,
  },
  subtitle: {
    ...commonStyles.subtitle,
  },
  inputContainer: {
    ...commonStyles.inputContainer,
  },
  inputWrapper: {
    ...commonStyles.inputWrapper,
  },
  input: {
    ...commonStyles.input,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonGradient: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },

  emptyContainer: {
    ...commonStyles.emptyContainer,
  },
  emptyTitle: {
    ...commonStyles.emptyTitle,
  },
  emptySubtitle: {
    ...commonStyles.emptySubtitle,
  },
  modalOverlay: {
    ...commonStyles.modalOverlay,
  },
  modalContent: {
    ...commonStyles.modalContent,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    ...commonStyles.modalTitle,
  },
  modalText: {
    ...commonStyles.modalText,
  },
  modalButtons: {
    ...commonStyles.modalButtons,
  },
  cancelButton: {
    ...commonStyles.button,
    backgroundColor: colors.textLight,
  },
  deleteButtonModal: {
    ...commonStyles.button,
    backgroundColor: colors.error,
  },
  cancelButtonText: {
    ...commonStyles.buttonText,
  },
  deleteButtonText: {
    ...commonStyles.buttonText,
  },
});
