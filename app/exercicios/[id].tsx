import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Question {
  question: string;
  options: string[];
  correct: number; // índice da opção correta
}

// Pergunta fixa
const question: Question = {
  question: "Qual é o resultado de 2 + 2?",
  options: ["3", "4", "5", "6"],
  correct: 1,
};

export default function Exercicio() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [progress] = useState(new Animated.Value(1));

  // Timer regressivo
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Barra de timer animada
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 30000,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    // Aqui você poderia adicionar lógica de resposta correta/XP
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerContainer}>
        <Animated.View style={[styles.timerBar, { width: progressWidth }]} />
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>

      {/* Pergunta */}
      <Text style={styles.question}>{question.question}</Text>

      {/* Opções */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && styles.selectedOption,
            ]}
            onPress={() => handleSelectOption(index)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  timerContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "rgba(59,130,246,0.3)",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    justifyContent: "center",
  },
  timerBar: {
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  timerText: {
    position: "absolute",
    alignSelf: "center",
    color: "#FFF",
    fontWeight: "bold",
  },
  question: { fontSize: 22, fontWeight: "600", textAlign: "center", marginBottom: 30 },
  optionsContainer: { width: "100%" },
  optionButton: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#10B981",
  },
  optionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
