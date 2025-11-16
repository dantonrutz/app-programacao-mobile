import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/provider/AuthProvider';
import { useTheme } from '@/provider/ThemeProvider';
import { UserInterface } from '@/types/User';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Classroom {
  id: string;
  name: string;
  code: string;
  teacherId: string;
}

interface Ranking {
  id: string;
  position: number;
  score: number;
  classroomId: string;
  userId: string;
}

export default function Turma() {
  const { post, get } = useApi();
  const { theme } = useTheme();
  const { getUser } = useAuth();
  const [myClassrooms, setMyClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState<string>('');

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

  useEffect(() => {
    if (userId) {
      fetchMyClassrooms();
    }
  }, [userId]);

  const fetchMyClassrooms = async () => {
    try {
      setLoading(true);

      // 1. Buscar todos os rankings do usuário
      const allRankings: Ranking[] = await get('/ranking');
      const userRankings = allRankings.filter(r => r.userId === userId);

      if (userRankings.length === 0) {
        setMyClassrooms([]);
        return;
      }

      // 2. Buscar todas as turmas
      const allClassrooms: Classroom[] = await get('/classroom');

      // 3. Filtrar turmas que o usuário está vinculado
      const classroomIds = userRankings.map(r => r.classroomId);
      const myClassrooms = allClassrooms.filter(c => classroomIds.includes(c.id));

      setMyClassrooms(myClassrooms);
    } catch (e: any) {
      console.log('Erro ao carregar turmas:', e?.message ?? e);
      setMyClassrooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClassroom = async () => {
    if (!code.trim()) {
      Alert.alert('Erro', 'Digite o código da turma');
      return;
    }

    try {
      setLoading(true);

      // 1. Buscar a turma pelo código
      const allClassrooms: Classroom[] = await get('/classroom');
      const classroom = allClassrooms.find(c => c.code.toUpperCase() === code.trim().toUpperCase());

      if (!classroom) {
        Alert.alert('Erro', 'Código de turma inválido');
        return;
      }

      // 2. Verificar se já está vinculado
      const allRankings: Ranking[] = await get('/ranking');
      const alreadyJoined = allRankings.some(r => r.userId === userId && r.classroomId === classroom.id);

      if (alreadyJoined) {
        Alert.alert('Erro', 'Você já está nesta turma');
        return;
      }

      // 3. Criar ranking (vinculação) com score e position default = 0
      await post('/ranking', {
        position: 0,
        score: 0,
        classroomId: classroom.id,
        userId: userId,
      });

      Alert.alert('Sucesso', 'Você entrou na turma!');
      setModalVisible(false);
      setCode('');

      // 4. Recarregar lista de turmas
      fetchMyClassrooms();
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Erro ao entrar na turma');
    } finally {
      setLoading(false);
    }
  };

  const backgroundColor = theme === 'dark' ? '#1F2937' : '#F3F4F6';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#111827';
  const cardBg = theme === 'dark' ? '#374151' : '#FFFFFF';
  const inputBg = theme === 'dark' ? '#4B5563' : '#E5E7EB';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.header}>
        <Text style={styles.headerText}>Minhas Turmas</Text>
        <Text style={styles.headerSubtitle}>Suas turmas de estudo</Text>
      </LinearGradient>

      {/* Botão de entrar em turma - sempre visível */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.joinButtonText}>Entrar em uma Turma</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de turmas */}
      {loading && myClassrooms.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EC4899" />
        </View>
      ) : myClassrooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={64} color="#9CA3AF" />
          <Text style={[styles.emptyText, { color: textColor }]}>
            Você ainda não está em nenhuma turma
          </Text>
          <Text style={[styles.emptySubtext, { color: '#9CA3AF' }]}>
            Use o botão acima e digite o código fornecido pelo professor
          </Text>
        </View>
      ) : (
        <FlatList
          data={myClassrooms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: textColor }]}>
                    {item.name}
                  </Text>
                  <View style={styles.codeBadge}>
                    <Text style={styles.codeBadgeText}>{item.code}</Text>
                  </View>
                </View>
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
              </View>

              <Text style={[styles.enrolledText, { color: '#10B981' }]}>
                ✓ Você está registrado
              </Text>
            </View>
          )}
        />
      )}

      {/* Modal de entrada em turma */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              Entrar em uma Turma
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView contentContainerStyle={styles.formContainer}>
            <Ionicons name="school" size={80} color="#EC4899" style={styles.modalIcon} />

            <Text style={[styles.label, { color: textColor }]}>
              Código da Turma
            </Text>
            <Text style={[styles.helperText, { color: '#9CA3AF' }]}>
              Solicite o código ao seu professor
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
              placeholder="Digite o código aqui"
              placeholderTextColor="#9CA3AF"
              value={code}
              onChangeText={(text) => setCode(text.toUpperCase())}
              maxLength={8}
              editable={!loading}
              autoCapitalize="characters"
              autoFocus
            />

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleJoinClassroom}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="log-in" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Entrar na Turma</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              disabled={loading}
            >
              <Text style={[styles.cancelButton, { color: '#9CA3AF' }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },

  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  joinButton: {
    backgroundColor: '#EC4899',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  joinButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16, textAlign: 'center' },
  emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 },

  listContent: { padding: 16, paddingBottom: 40 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  codeBadge: { backgroundColor: '#FCE7F3', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },
  codeBadgeText: { fontSize: 13, color: '#BE185D', fontWeight: '600' },
  enrolledText: { fontSize: 14, fontWeight: '500' },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: { fontSize: 20, fontWeight: '600' },

  formContainer: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  modalIcon: { alignSelf: 'center', marginBottom: 24 },

  label: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  helperText: { fontSize: 13, marginBottom: 16 },

  input: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 1,
  },

  saveButton: {
    backgroundColor: '#EC4899',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  cancelButton: { textAlign: 'center', fontSize: 14, fontWeight: '500', paddingVertical: 12 },
});
