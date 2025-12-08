import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/provider/AuthProvider';
import { useTheme } from '@/provider/ThemeProvider';
import { UserInterface } from '@/types/User';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Perfil() {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserInterface | null>(null);
  const { get } = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data: UserInterface = await get('/user/me');
        setUser(data);
      } catch (e: any) {
        Alert.alert('Erro', e.message || 'Não foi possível carregar os dados do usuário');
      }
    };
    fetchUser();
  }, [get]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header com gradiente */}
        <LinearGradient colors={['#F87171', '#FCA5A5']} style={styles.header}>
          <Text style={styles.headerText}>Meu Perfil</Text>
        </LinearGradient>

        {/* Cartão do usuário */}
        <View style={styles.card}>
          <Image
            source={user?.image
              ? { uri: user.image }
              : require('../../assets/images/default.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.email}>{user?.email || '-'}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Funções do usuário</Text>
            <Text style={styles.roles}>
              {user?.roles.map(role => role === 'TEACHER' ? 'Professor' : role === 'STUDENT' ? 'Estudante' : role).join(', ') || '-'}
            </Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Ionicons
              name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={24}
              color="#6B7280"
            />
            <Text style={styles.themeText}>
              {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={signOut}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={styles.signOutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { paddingBottom: 40 },

  header: {
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
  },
  headerText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },

  card: {
    marginHorizontal: 20,
    marginTop: -60,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  email: { fontSize: 16, color: '#6B7280', marginBottom: 2 },
  roleContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  roleLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  roles: {
    fontSize: 14,
    color: '#6B7280',
  },

  buttonGroup: {
    marginTop: 30,
    marginHorizontal: 20,
    gap: 12,
  },

  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  themeText: { marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#6B7280' },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  signOutText: { marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#EF4444' },
});
