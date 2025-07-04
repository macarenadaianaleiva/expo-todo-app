import React, { useState } from "react";
import SplashScreen from "./src/components/SplashScreen";
import ToDoScreen from "./src/screens/ToDoScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <ToDoScreen />;
}
