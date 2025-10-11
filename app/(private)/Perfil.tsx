import { useAuth } from '@/provider/AuthProvider';
import { useTheme } from '@/provider/ThemeProvider';
import { UserInterface } from '@/types/User';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Perfil() {
  const { signOut, getUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };

    fetchUser();
  }, [getUser]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F87171', '#FCA5A5']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: user?.image }} 
              style={styles.avatar}
            />
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

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
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
    buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  themeText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});