# Todo Minimal - App de React Native

Una aplicación de tareas minimalista y elegante construida con React Native y Expo.

## ✨ Características Visuales

### 🎨 Diseño Moderno
- **Gradientes atractivos**: Uso de gradientes suaves para crear profundidad visual
- **Paleta de colores consistente**: Sistema de colores unificado y profesional
- **Tipografía mejorada**: Jerarquía visual clara con diferentes pesos y tamaños
- **Sombras sutiles**: Efectos de elevación para crear profundidad

### 🎭 Animaciones Fluidas
- **Splash Screen animado**: Transiciones suaves con escalado y opacidad
- **Animaciones de entrada**: Las nuevas tareas aparecen con animaciones elegantes
- **Feedback táctil**: Animaciones de escala al interactuar con elementos
- **Transiciones de estado**: Animaciones suaves al completar/eliminar tareas

### 📊 Componentes Visuales
- **Tarjeta de estadísticas**: Muestra progreso visual con barra de progreso
- **Checkboxes personalizados**: Diseño moderno con animaciones
- **Modales mejorados**: Diseño limpio con iconos y mejor UX
- **Estados vacíos**: Ilustraciones y mensajes motivacionales

### 🎯 Mejoras de UX
- **Safe Area**: Soporte completo para diferentes dispositivos
- **Status Bar**: Configuración automática según el tema
- **Feedback visual**: Estados activos y hover mejorados
- **Accesibilidad**: Contraste adecuado y tamaños de toque apropiados

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desarrollo
- **expo-linear-gradient**: Gradientes atractivos
- **react-native-vector-icons**: Iconografía consistente
- **@react-native-async-storage**: Persistencia de datos
- **Animated API**: Animaciones nativas fluidas

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── SplashScreen.js      # Pantalla de carga animada
│   ├── StatsCard.js         # Tarjeta de estadísticas
│   └── AnimatedTodoItem.js  # Item de tarea animado
├── screens/
│   └── ToDoScreen.js        # Pantalla principal
└── theme/
    ├── colors.js            # Sistema de colores
    └── styles.js            # Estilos comunes
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Primario**: `#667eea` - Azul moderno
- **Secundario**: `#764ba2` - Púrpura elegante
- **Acento**: `#f093fb` - Rosa suave
- **Fondo**: Gradiente suave de grises

### Tipografía
- **Títulos**: 32px, Bold
- **Subtítulos**: 16px, Regular
- **Texto principal**: 16px, Regular
- **Texto secundario**: 14px, Light

### Espaciado
- **Padding estándar**: 15px
- **Margen entre elementos**: 10px
- **Border radius**: 12px para cards, 10px para botones

## 🚀 Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Instala expo-linear-gradient:
   ```bash
   npm install expo-linear-gradient
   ```
4. Ejecuta la aplicación:
   ```bash
   npx expo start
   ```

## 📱 Capturas de Pantalla

La aplicación incluye:
- Splash screen con gradientes y animaciones
- Pantalla principal con estadísticas visuales
- Lista de tareas con animaciones fluidas
- Modales de confirmación elegantes
- Estados vacíos motivacionales

## 🎯 Próximas Mejoras

- [ ] Modo oscuro
- [ ] Categorías de tareas
- [ ] Fechas de vencimiento
- [ ] Notificaciones push
- [ ] Sincronización en la nube
- [ ] Temas personalizables

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. 