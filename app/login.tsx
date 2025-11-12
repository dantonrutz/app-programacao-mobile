import { useAuth } from "@/provider/AuthProvider";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // para navegação
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { credentialsSignIn } = useAuth();
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCredentialsSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Email e senha são obrigatórios');
      return;
    }

    try {
      await credentialsSignIn(email, password);
    } catch (e: any) {
      Alert.alert('Erro ao fazer login', e.message);
    }
  };

  const handleGoogleSignIn = () => {
    // Implementar lógica de login com Google aqui
  }

  const goToCreateAccount = () => {
    navigation.navigate('signup'); 
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#3B82F6']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Image
            source={require('../assets/images/capii.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>
            Entre para começar sua jornada de aprendizado
          </Text>

          {/* Input Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#D1D5DB"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Input Senha com ícone */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor="#D1D5DB"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.passwordIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          </View>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleCredentialsSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          {/* Texto OU */}
          <Text style={styles.orText}>OU</Text>

          {/* Botão Google */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/images/google.webp')}
              style={styles.googleIcon}
            />
            <Text style={styles.buttonText}>Continuar com Google</Text>
          </TouchableOpacity>

          {/* Link para criar conta */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem uma conta?</Text>
            <TouchableOpacity onPress={goToCreateAccount}>
              <Text style={styles.link}>Criar Conta</Text>
            </TouchableOpacity>
          </View>

        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#FFFFFF',
  },
  passwordIcon: {
    marginLeft: 8,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 12,
  },
  orText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginVertical: 8,
    opacity: 0.9,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 20,
    marginTop: 12
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  link: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
