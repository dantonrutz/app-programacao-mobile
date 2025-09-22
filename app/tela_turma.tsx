import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./theme_controller";
import Navbar from "./Navbar";

export default function TurmaScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Dados fictícios para exemplo
  const turmaInfo = {
    nome: "5º Ano - Matemática",
    professor: {
      nome: "Prof. Ana Silva",
      foto: require("../assets/images/icon.png"),
    },
    tema: "Frações e Decimais",
    alunos: [
      { id: 1, nome: "João Pedro", pontos: 850, nivel: 5 },
      { id: 2, nome: "Maria Clara", pontos: 820, nivel: 4 },
      { id: 3, nome: "Lucas Silva", pontos: 780, nivel: 4 },
      { id: 4, nome: "Ana Beatriz", pontos: 750, nivel: 4 },
      { id: 5, nome: "Pedro Santos", pontos: 700, nivel: 3 },
    ],
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 0: return "#ffd700"; 
      case 1: return "#c0c0c0"; 
      case 2: return "#cd7f32"; 
      default: return "#a1a1aa";
    }
  };

  const getMedalIcon = (position: number) => {
    if (position > 2) return null;
    return (
      <Ionicons 
        name="trophy" 
        size={28} 
        color={getMedalColor(position)} 
        style={styles.medalha}
      />
    );
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: "#18181b" }]}>
      {/* Cabeçalho da Turma */}
      <View style={[styles.header, isDark && { backgroundColor: "#000001ff" }]}>
        <View style={styles.professorContainer}>
          <Image source={turmaInfo.professor.foto} style={styles.professorFoto} />
          <View>
            <Text style={[styles.turmaNome, isDark && { color: "#fbbf24" }]}>{turmaInfo.nome}</Text>
            <Text style={[styles.professorNome, isDark && { color: "#e5e7eb" }]}>{turmaInfo.professor.nome}</Text>
          </View>
        </View>
        
        <View style={[styles.temaContainer, isDark && { backgroundColor: "#3f3f46" }]}>
          <Ionicons name="book" size={20} color={isDark ? "#fbbf24" : "#3B82F6"} />
          <Text style={[styles.temaText, isDark && { color: "#e5e7eb" }]}>
            Tema atual: {turmaInfo.tema}
          </Text>
        </View>
      </View>

      {/* Lista de Alunos */}
      <ScrollView style={styles.rankingContainer}>
        <Text style={[styles.rankingTitle, isDark && { color: "#fbbf24" }]}>
          Ranking da Turma
        </Text>
        
        {turmaInfo.alunos.map((aluno, index) => (
          <View 
            key={aluno.id} 
            style={[
              styles.alunoCard,
              isDark && { backgroundColor: "#27272a", borderColor: "#3f3f46" },
              index < 3 && styles.topThreeCard,
              index < 3 && isDark && { backgroundColor: "#374151" }
            ]}
          >
            <View style={styles.rankInfo}>
              {getMedalIcon(index)}
              <Text style={[
                styles.posicaoNumero, 
                isDark && { color: "#e5e7eb" },
                index < 3 && { fontSize: 18, fontWeight: "bold" }
              ]}>
                {index + 1}º
              </Text>
            </View>
            
            <View style={styles.alunoInfo}>
              <Text style={[
                styles.alunoNome,
                isDark && { color: "#e5e7eb" },
                index < 3 && { fontSize: 18 }
              ]}>
                {aluno.nome}
              </Text>
              <View style={styles.pontosContainer}>
                <Ionicons 
                  name="star" 
                  size={index < 3 ? 20 : 16} 
                  color={index < 3 ? "#ffd700" : "#fbbf24"} 
                />
                <Text style={[
                  styles.pontosText,
                  isDark && { color: "#a1a1aa" },
                  index < 3 && { fontSize: 16 }
                ]}>
                  {aluno.pontos} pontos
                </Text>
                <View style={[
                  styles.nivelBadge,
                  isDark && { backgroundColor: "#3f3f46" }
                ]}>
                  <Text style={[
                    styles.nivelText,
                    isDark && { color: "#fbbf24" }
                  ]}>
                    Nível {aluno.nivel}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Navbar active="turma" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#cfd0d3ff",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  professorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  professorFoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  turmaNome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  professorNome: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 2,
  },
  temaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
  },
  temaText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#4b5563",
    fontWeight: "500",
  },
  rankingContainer: {
    flex: 1,
    padding: 20,
  },
  rankingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
  alunoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  topThreeCard: {
    backgroundColor: "#f8fafc",
    borderColor: "#fbbf24",
    borderWidth: 2,
    padding: 18,
  },
  rankInfo: {
    alignItems: "center",
    width: 50,
  },
  medalha: {
    marginBottom: 4,
  },
  posicaoNumero: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  alunoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  pontosContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pontosText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  nivelBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  nivelText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3B82F6",
  },
});

