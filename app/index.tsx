import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";

const data = [
  { id: "1", title: "Equações Básicas", description: "Resolva expressões simples", icon: "calculator" },
  { id: "2", title: "Desafio Diário", description: "Resolva 5 problemas em 3 min", icon: "flash" },
  { id: "3", title: "Novo Conteúdo!", description: "Frações e decimais desbloqueados", icon: "star" },
];

function useHideAndroidNavBar() {
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === "dark" ? "dark" : "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useHideAndroidNavBar();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Ionicons name={item.icon} size={28} color={theme === "dark" ? "#fbbf24" : "#3B82F6"} style={styles.cardIcon} />
      <View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, theme === "dark" && { backgroundColor: "#18181b" }]}> 
      <View style={styles.headerRow}>
        <Text style={[styles.header, theme === "dark" && { color: "#fbbf24" }]}>Início</Text>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Ionicons name={theme === "dark" ? "sunny" : "moon"} size={22} color={theme === "dark" ? "#fbbf24" : "#111827"} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={[styles.navbar, theme === "dark" && { backgroundColor: "#27272a", borderTopColor: "#52525b" }]}> 
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={theme === "dark" ? "#fbbf24" : "#3B82F6"} />
          <Text style={[styles.navText, theme === "dark" && { color: "#fbbf24" }]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="book" size={24} color={theme === "dark" ? "#a1a1aa" : "#6B7280"} />
          <Text style={[styles.navText, theme === "dark" && { color: "#a1a1aa" }]}>Aprender</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="trophy" size={24} color={theme === "dark" ? "#a1a1aa" : "#6B7280"} />
          <Text style={[styles.navText, theme === "dark" && { color: "#a1a1aa" }]}>Turma</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="flag" size={24} color={theme === "dark" ? "#a1a1aa" : "#6B7280"} />
          <Text style={[styles.navText, theme === "dark" && { color: "#a1a1aa" }]}>Desafios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color={theme === "dark" ? "#a1a1aa" : "#6B7280"} />
          <Text style={[styles.navText, theme === "dark" && { color: "#a1a1aa" }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  themeButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#111827",
    fontWeight: "bold",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  list: { paddingHorizontal: 20, paddingBottom: 80 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardIcon: { marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  cardDesc: { fontSize: 14, color: "#6B7280" },
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
