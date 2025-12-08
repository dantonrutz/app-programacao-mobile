import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/provider/AuthProvider';
import { UserInterface } from '@/types/User';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Classroom {
  id: string;
  name: string;
  code: string;
  teacherId: string;
}

interface RankingEntry {
  id: string;
  userId: string;
  classroomId: string;
  score?: number;
}

interface ExerciseInterface {
  id: string;
  classroomId: string;
  question: string;
}

interface AnswerEntry {
  id: string;
  userId: string;
  exerciseId: string;
  correct: boolean;
}

export default function Inicio() {
  const { getUser } = useAuth();
  const { get } = useApi();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [progress] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [xpProgress, setXpProgress] = useState(0);
  const [accuracyRate, setAccuracyRate] = useState(0);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    totalAnswers: 0,
  });
  const router = useRouter();

  useEffect(() => {
    // Buscar usuário
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, [getUser]);

  // Função centralizada para buscar stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Buscar rankings (turmas do aluno)
      const allRankings: RankingEntry[] = await get('/ranking');
      const userRankings = allRankings.filter((r) => r.userId === user?.id);
      const classroomIds = userRankings.map((r) => r.classroomId);

      // 2. Buscar todas as questões
      const allExercises: ExerciseInterface[] = await get('/exercise');
      const classroomExercises = allExercises.filter((e) =>
        classroomIds.includes(e.classroomId)
      );

      // 3. Buscar todas as respostas do aluno
      const allAnswers: AnswerEntry[] = await get('/answer');
      const userAnswers = allAnswers.filter((a) => a.userId === user?.id);

      // 4. Contar respostas que estão nas turmas do aluno
      const answeredExercisesInClassrooms = userAnswers.filter((a) =>
        classroomExercises.some((e) => e.id === a.exerciseId)
      );

      // 5. Calcular progresso (% de questões respondidas)
      const totalQuestionsInClassrooms = classroomExercises.length;
      const answeredCount = answeredExercisesInClassrooms.length;
      const progressPercentage =
        totalQuestionsInClassrooms > 0
          ? Math.round((answeredCount / totalQuestionsInClassrooms) * 100)
          : 0;

      // 6. Calcular taxa de acertos
      const correctCount = answeredExercisesInClassrooms.filter(
        (a) => a.correct
      ).length;
      const accuracyPercentage =
        answeredExercisesInClassrooms.length > 0
          ? Math.round(
            (correctCount / answeredExercisesInClassrooms.length) * 100
          )
          : 0;

      setXpProgress(progressPercentage / 100);
      setAccuracyRate(accuracyPercentage);
      setStats({
        totalQuestions: totalQuestionsInClassrooms,
        answeredQuestions: answeredCount,
        correctAnswers: correctCount,
        totalAnswers: answeredExercisesInClassrooms.length,
      });
    } catch (e: any) {
      console.log('Erro ao carregar stats:', e?.message ?? e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, get]);

  // Executar fetch ao montar e quando user mudar
  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id, fetchStats]);

  // Refetch ao tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchStats();
      }
    }, [user?.id, fetchStats])
  );

  useEffect(() => {
    // async function initNotifications() {
    //   await NotificationService.sendLocalNotification(
    //     'Bem-vindo 👋',
    //     'Obrigado por acessar a Home — boa jornada de aprendizado!'
    //   );
    // }

    // initNotifications();

    // Animação da barra de progresso
    Animated.timing(progress, {
      toValue: xpProgress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [xpProgress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const getAccuracyColor = () => {
    if (accuracyRate >= 80) return '#10B981';
    if (accuracyRate >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#10B981', '#3B82F6']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.name.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>Pronto para aprender algo novo?</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : (
          <>
            {/* Bloco de Progresso */}
            <View style={styles.levelBox}>
              <View style={styles.progressHeader}>
                <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                <Text style={styles.progressLabel}>Progresso de Estudo</Text>
              </View>

              <View style={styles.progressBar}>
                <Animated.View
                  style={[styles.progressFill, { width: progressWidth }]}
                />
              </View>

              <Text style={styles.progressText}>
                {stats.answeredQuestions} de {stats.totalQuestions} questões respondidas
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(xpProgress * 100)}% completo
              </Text>

              <TouchableOpacity onPress={() => router.push('/Aprender')}>
                <Text style={styles.continueLink}>
                  Continuar sua jornada de aprendizado →
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bloco de Taxa de Acertos */}
            <View style={styles.accuracyBox}>
              <View style={styles.accuracyHeader}>
                <Ionicons name="trophy" size={24} color="#FFF" />
                <Text style={styles.accuracyLabel}>Taxa de Acertos</Text>
              </View>

              <View style={styles.accuracyContent}>
                <View style={styles.accuracyCircle}>
                  <Text style={[styles.accuracyPercentageText, { color: getAccuracyColor() }]}>
                    {accuracyRate}%
                  </Text>
                </View>

                <View style={styles.accuracyStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="checkmark" size={18} color="#10B981" />
                    <Text style={styles.statText}>
                      {stats.correctAnswers} corretos
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Ionicons name="close" size={18} color="#EF4444" />
                    <Text style={styles.statText}>
                      {stats.totalAnswers - stats.correctAnswers} incorretos
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Ionicons name="list" size={18} color="#9CA3AF" />
                    <Text style={styles.statText}>
                      {stats.totalAnswers} respostas
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Card de Continuar */}
            <TouchableOpacity
              style={styles.learnCard}
              onPress={() => router.push('/Aprender')}
            >
              <Ionicons name="book" size={36} color="#FFF" />
              <Text style={styles.learnCardText}>
                Continuar sua jornada de aprendizado →
              </Text>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20 },

  header: { marginTop: 20, marginBottom: 30 },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: { fontSize: 18, color: '#FFF', opacity: 0.9 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progresso
  levelBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: 10, backgroundColor: '#FFF', borderRadius: 8 },
  progressText: { color: '#FFF', fontSize: 13, opacity: 0.9, marginBottom: 4 },
  progressPercentage: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  continueLink: {
    marginTop: 8,
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // Taxa de Acertos
  accuracyBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  accuracyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accuracyLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  accuracyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  accuracyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accuracyPercentageText: {
    fontSize: 28,
    fontWeight: '700',
  },
  accuracyStats: {
    flex: 1,
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },

  // Card de Continuar
  learnCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  learnCardText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});
