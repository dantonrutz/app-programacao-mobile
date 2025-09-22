
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "./Navbar";
import { useTheme } from "./theme_controller";
import * as ImagePicker from "expo-image-picker";


export default function PerfilScreen() {
  const { theme, toggleTheme } = useTheme();
  // Dados fictícios para exemplo
  const user = {
    nome: "João Silva",
    nivel: "Intermediário",
    ranking: 1,
    fotoPadrao: require("../assets/images/icon.png"), // ajuste o caminho se necessário
  };
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  async function verifyPermissions() {
  const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (libraryStatus !== 'granted') {
    alert('Perdão, precisamos das permissões para continuar!');
    return false;
  }
  const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
  if (cameraStatus !== 'granted') {
    alert('Perdão, precisamos das permissões para continuar!');
    return false;
  }
  return true;
}

async function pickImage() {
  const hasPermission = await verifyPermissions();
  if (!hasPermission) {
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // Para selecionar apenas imagens
    allowsEditing: true, // Permite edição básica da imagem
    aspect: [1, 1], // Define a proporção da imagem
    quality: 1, // Qualidade da imagem
  });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotoUri(result.assets[0].uri);
    }
}

async function takePhoto() {
  const hasPermission = await verifyPermissions();
  if (!hasPermission) {
    return;
  }

  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    console.log(result.assets[0].uri);
    // Use result.assets[0].uri para exibir a imagem na sua aplicação
  }
}

  return (
    <View style={[styles.container, theme === "dark" && { backgroundColor: "#18181b" }]}> 
      <View style={styles.profileBox}>
        <TouchableOpacity onPress={pickImage} onLongPress={takePhoto}>
          <Image source={fotoUri ? { uri: fotoUri } : user.fotoPadrao} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={[styles.fotoHint, theme === "dark" && { color: "#a1a1aa" }]}>Toque na foto para escolher, pressione para tirar.</Text>
        <Text style={[styles.nome, theme === "dark" && { color: "#fbbf24" }]}>{user.nome}</Text>
        <View style={styles.rankingBox}>
          <Ionicons name="trophy" size={20} color="#fbbf24" />
          <Text style={styles.rankingText}>Ranking na turma: {user.ranking}º</Text>
        </View>
      </View>

      <View style={styles.actionsBox}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="settings" size={26} color="#3B82F6" />
          <Text style={styles.actionText}>Configurações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="shield-checkmark" size={26} color="#10b981" />
          <Text style={styles.actionText}>Privacidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="notifications" size={26} color="#f59e42" />
          <Text style={styles.actionText}>Notificações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleTheme}>
          <Ionicons name={theme === "dark" ? "sunny" : "moon"} size={26} color={theme === "dark" ? "#fbbf24" : "#111827"} />
          <Text style={[styles.actionText, theme === "dark" && { color: "#fbbf24" }]}>Modo {theme === "dark" ? "Claro" : "Escuro"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#fee2e2" }]}> 
          <Ionicons name="log-out" size={26} color="#ef4444" />
          <Text style={[styles.actionText, { color: "#ef4444" }]}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Navbar active="perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 60, paddingBottom: 80 },
  profileBox: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 150, height: 150, borderRadius: 45, marginBottom: 10, backgroundColor: "#e5e7eb" },
  nome: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  nivel: { fontSize: 16, color: "#3B82F6", marginTop: 4 },
  rankingBox: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  rankingText: { fontSize: 17, color: "#6B7280", marginLeft: 6 },
  actionsBox: {
    width: "92%",
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 18,
    justifyContent: "center",
  },
  actionText: { marginLeft: 16, fontSize: 19, color: "#111827", fontWeight: "bold" },
  fotoHint: { fontSize: 12, color: "#6B7280", marginTop: 1, marginBottom: 10 },
});
