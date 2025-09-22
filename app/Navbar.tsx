import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "./theme_controller";

type NavbarProps = { active: "home" | "aprender" | "turma" | "desafios" | "perfil" };
export default function Navbar({ active }: NavbarProps) {
 const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.navbar, theme === "dark" && { backgroundColor: "#27272a", borderTopColor: "#52525b" }]}> 
      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/")}> 
        <Ionicons name="home" size={24} color={active === "home" ? (theme === "dark" ? "#fbbf24" : "#3B82F6") : (theme === "dark" ? "#a1a1aa" : "#6B7280")} />
        <Text style={[styles.navText, active === "home" && theme === "dark" && { color: "#fbbf24" }, active === "home" && theme !== "dark" && { color: "#3B82F6" }]}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/tela_aprender")}> 
        <Ionicons name="book" size={24} color={active === "aprender" ? (theme === "dark" ? "#fbbf24" : "#3B82F6") : (theme === "dark" ? "#a1a1aa" : "#6B7280")} />
        <Text style={[styles.navText, active === "aprender" && theme === "dark" && { color: "#fbbf24" }, active === "aprender" && theme !== "dark" && { color: "#3B82F6" }]}>Aprender</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/tela_turma")}>
        <Ionicons name="trophy" size={24} color={active === "turma" ? (theme === "dark" ? "#fbbf24" : "#3B82F6") : (theme === "dark" ? "#a1a1aa" : "#6B7280")} />
        <Text style={[styles.navText, theme === "dark" && { color: "#a1a1aa" }]}>Turma</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/tela_desafios")}> 
        <Ionicons name="flag" size={24} color={active === "desafios" ? (theme === "dark" ? "#fbbf24" : "#3B82F6") : (theme === "dark" ? "#a1a1aa" : "#6B7280")} />
        <Text style={[styles.navText, theme === "dark" && { color: "#a1a1aa" }]}>Desafios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/tela_perfil")}> 
        <Ionicons name="person" size={24} color={active === "perfil" ? (theme === "dark" ? "#fbbf24" : "#3B82F6") : (theme === "dark" ? "#a1a1aa" : "#6B7280")} />
        <Text style={[styles.navText, theme === "dark" && { color: "#a1a1aa" }]}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});
