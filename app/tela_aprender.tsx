import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "./theme_controller";
import Navbar from "./Navbar";

export default function AprenderScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, theme === "dark" && { backgroundColor: "#18181b" }]}>
      <Text style={[styles.text, theme === "dark" && { color: "#fbbf24" }]}>Tela Aprender</Text>
      <Navbar active="aprender" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 22, fontWeight: "bold", color: "#3B82F6" },
});
