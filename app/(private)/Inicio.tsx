import { useAuth } from '@/provider/AuthProvider';
import { UserInterface } from '@/types/User';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NotificationService from '../services/NotificationService';

export default function Inicio() {
  const { getUser } = useAuth();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [progress] = useState(new Animated.Value(0));
  const router = useRouter();
  const xpProgress = 0.68;

  useEffect(() => {
    // Buscar usuário
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, [getUser]);

  useEffect(() => {
    async function initNotifications() {
      // Envia a notificação local
      await NotificationService.sendLocalNotification(
        "Bem-vindo 👋",
        "Obrigado por acessar a Home — boa jornada de aprendizado!"
      );
    }

    initNotifications();

    // Animação da barra de progresso
    Animated.timing(progress, {
      toValue: xpProgress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#10B981', '#3B82F6']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.name.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>Pronto para aprender algo novo?</Text>
        </View>

        {/* Bloco do nível */}
        <View style={styles.levelBox}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressText}>
            {Math.round(xpProgress * 100)}% até o próximo nível
          </Text>

          <TouchableOpacity onPress={() => router.push('/Aprender')}>
            <Text style={styles.continueLink}>Continuar sua jornada de aprendizado →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.learnCard}
          onPress={() => router.push('/Aprender')}
        >
          <Ionicons name="book" size={36} color="#FFF" />
          <Text style={styles.learnCardText}>Continuar sua jornada de aprendizado →</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  learnCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  learnCardText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  greeting: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#FFF', opacity: 0.9 },

  levelBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: { height: 10, backgroundColor: '#FFF', borderRadius: 8 },
  progressText: { color: '#FFF', marginTop: 6, fontSize: 14, opacity: 0.9 },
  continueLink: {
    marginTop: 12,
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
