import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/provider/AuthProvider";
import { ExerciseInterface } from "@/types";
import { UserInterface } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AnswerEntry {
  id: string;
  userId: string;
  correct: boolean;
  exerciseId: string;
  selected: string;
}

export default function Exercicio() {
  const [question, setQuestion] = useState<ExerciseInterface | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [progress] = useState(new Animated.Value(1));
  const [userId, setUserId] = useState<string>("");
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    correctAnswer: string | null;
  }>(null);

  const { id } = useLocalSearchParams();
  const { get, post } = useApi();
  const { getUser } = useAuth();
  const router = useRouter();

  /** Buscar userId da sessão */
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user: UserInterface | null = typeof getUser === 'function' ? await getUser() : null;
        if (user?.id) {
          setUserId(user.id);
        }
      } catch (e: any) {
        console.log('Erro ao obter usuário:', e?.message ?? e);
      }
    };

    fetchUserId();
  }, [getUser]);

  /** Buscar questão e validar se já foi respondida */
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        if (id && userId) {
          const data: ExerciseInterface = await get(`/exercise/${id}`);
          setQuestion(data);

          // Buscar todas as respostas do usuário
          const answers: AnswerEntry[] = await get('/answer');

          // Verificar se o usuário já respondeu ESTA questão específica
          const userAnswer = answers.find(
            (a) => a.userId === userId && a.exerciseId === String(id)
          );

          if (userAnswer) {
            setAlreadyAnswered(true);
            // Encontrar o índice da opção que foi respondida
            const answeredOptionIndex = data.options.findIndex(
              (option) => option === userAnswer.selected
            );
            if (answeredOptionIndex !== -1) {
              setSelectedOption(answeredOptionIndex);
            }
          } else {
            setAlreadyAnswered(false);
            setSelectedOption(null);
          }

          // Limpar feedback ao carregar questão nova
          setFeedback(null);
          setToastMessage(null);
          setIsSubmitting(false);
          setTimeLeft(30);
        }
      } catch (e: any) {
        console.error("Erro ao carregar a pergunta:", e.message || e);
      }
    };

    fetchQuestion();
  }, [id, userId, get]);

  /** Timer */
  useEffect(() => {
    if (timeLeft === 0) {
      router.push("/Aprender");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, router]);

  /** Barra de progresso */
  useEffect(() => {
    const progressAnim = new Animated.Value(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 30000,
      useNativeDriver: false,
    }).start();
  }, [id]);

  /** Toast timeout */
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  /** Cleanup ao sair da tela */
  useEffect(() => {
    return () => {
      // Reset de states ao desmontar
      setQuestion(null);
      setSelectedOption(null);
      setAlreadyAnswered(false);
      setIsSubmitting(false);
      setFeedback(null);
      setToastMessage(null);
      setTimeLeft(30);
    };
  }, []);

  /** Envio da resposta */
  const handleSelectOption = async (index: number, givenAnswer: string) => {
    if (alreadyAnswered || isSubmitting) {
      setToastMessage("Você já respondeu esta questão");
      return;
    }

    setSelectedOption(index);
    setIsSubmitting(true);

    try {
      if (!id) return console.error("ID not found in route parameters");

      const response = await post(`/answer`, {
        selected: givenAnswer,
        exerciseId: id,
      });

      console.log("Resposta enviada:", response);

      // Exibir feedback
      setFeedback({
        correct: response.correct,
        correctAnswer: response.correctAnswer,
      });

      // Marcar como respondida
      setAlreadyAnswered(true);

      // Fechar automaticamente após 2s
      setTimeout(() => {
        setFeedback(null);
        router.push("/Aprender");
      }, 2000);

    } catch (e: any) {
      console.error("Erro ao enviar a resposta:", e.message || e);
      setIsSubmitting(false);
      setSelectedOption(null);
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  /** Popup de feedback */
  const Popup = () => {
    if (!feedback) return null;

    return (
      <View style={styles.toastContainer}>
        <Ionicons
          name={feedback.correct ? "checkmark-circle" : "close-circle"}
          size={24}
          color="#FFF"
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.toastTitle}>
            {feedback.correct ? "Resposta Correta!" : "Resposta Incorreta"}
          </Text>

          {!feedback.correct && feedback.correctAnswer !== null && (
            <Text style={styles.toastSubtitle}>
              Opção {Number(feedback.correctAnswer)} era a correta
            </Text>
          )}
        </View>
      </View>
    );
  };

  /** Toast message */
  const Toast = () => {
    if (!toastMessage) return null;

    return (
      <View style={styles.toastContainer}>
        <Ionicons name="information-circle" size={20} color="#FFF" />
        <Text style={styles.toastText}>{toastMessage}</Text>
      </View>
    );
  };

  if (!question) {
    return (
      <LinearGradient colors={["#7C3AED", "#3B82F6"]} style={styles.container}>
        <Text style={styles.loadingText}>Carregando pergunta...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#3B82F6", "#7C3AED"]} style={styles.container}>

      <Popup />
      <Toast />

      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => {
        setFeedback(null);
        setToastMessage(null);
        router.push("/Aprender");
      }}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Badge de já respondido */}
      {alreadyAnswered && (
        <View style={styles.answeredBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.answeredBadgeText}>Já respondida</Text>
        </View>
      )}

      {/* Pergunta */}
      <Text style={styles.question}>{question.question}</Text>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Tema: {question.theme}</Text>
        <Text style={styles.infoText}>Dificuldade: {"★".repeat(question.difficulty)}</Text>
        <Text style={styles.infoText}>Tempo restante: {timeLeft}s</Text>
      </View>

      {/* Opções */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && styles.selectedOption,
            ]}
            onPress={() => handleSelectOption(index, question.options[index])}
            disabled={isSubmitting || alreadyAnswered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 8,
    borderRadius: 20,
  },

  answeredBadge: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(16, 185, 129, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  answeredBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  infoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },

  question: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: "#FFFFFF",
  },

  optionsContainer: {
    width: "100%",
  },

  optionButton: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  selectedOption: {
    backgroundColor: "#10B981",
  },

  optionText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },

  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  popupContainer: {
    width: "75%",
    padding: 25,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
  },

  popupSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginTop: 5,
  },

  toastContainer: {
    position: "absolute",
    bottom: 60,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 99,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },

  toastText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  toastTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },

  toastSubtitle: {
    color: "#E5E7EB",
    fontSize: 12,
    marginTop: 4,
  },
});
