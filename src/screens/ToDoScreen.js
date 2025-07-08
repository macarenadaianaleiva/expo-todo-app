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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

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
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    setTask("");
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

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const deleteTask = () => {
    if (taskToDelete !== null) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTodos((prev) => prev.filter((todo) => todo.id !== taskToDelete));
      setTaskToDelete(null);
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const cancelDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setTaskToDelete(null);
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        onPress={() => toggleComplete(item.id)}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        {item.completed ? (
          <Icon name="check-circle" size={24} color="#0a84ff" />
        ) : (
          <Icon name="radio-button-unchecked" size={24} color="#ccc" />
        )}
        <Text
          style={[
            styles.todoText,
            item.completed && styles.completedText,
            { marginLeft: 8 },
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmDeleteTask(item.id)}>
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis tareas para hoy</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Agregar tarea..."
          value={task}
          onChangeText={setTask}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No hay tareas</Text>}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalText}>
              ¿Estás seguro que quieres borrar esta tarea?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={deleteTask}
              >
                <Text style={styles.modalButtonText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    borderWidth: 2,             // Grosor del borde
    borderColor: '#007AFF',     // Color del borde
    borderRadius: 15,           // Radio de las esquinas redondeadas
    padding: 16,                // Espaciado interno
    backgroundColor: '#fff',    // Color de fondo del contenedor
    margin: 20,                 // Espaciado externo
    shadowColor: '#000',        // (Opcional) Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,     
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "cursive",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#0a84ff",
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  todoText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#aaa",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
