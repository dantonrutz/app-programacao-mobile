import { useApi } from '@/hooks/useApi';
import { ClassroomInterface } from '@/types/Classroom';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Turma() {
  const { get } = useApi();
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClassrooms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await get('/classroom/me');
      setClassrooms(data || []);
    } catch (e: any) {
      console.log('Erro ao carregar turmas:', e.message || e);
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms, get]);

  const renderItem = ({ item }: any) => (
    <View style={styles.classItem}>
      <Text style={styles.className}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Minhas Turmas</Text>
          <Text style={styles.subtitle}>Veja as turmas que você participa</Text>

          <TouchableOpacity style={styles.refreshButton} onPress={fetchClassrooms} activeOpacity={0.8}>
            <Text style={styles.refreshText}>Atualizar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFF" />
          ) : (
            <FlatList
              data={classrooms}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={{ color: '#FFF', textAlign: 'center', marginTop: 20 }}>
                  Nenhuma turma encontrada
                </Text>
              }
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  greeting: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#FFFFFF', opacity: 0.9 },
  refreshButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  refreshText: {
    color: '#8B5CF6',
    fontWeight: '600',
    fontSize: 16,
  },
  content: { flex: 1 },
  classItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  className: { fontSize: 18, color: '#FFF' },
});
