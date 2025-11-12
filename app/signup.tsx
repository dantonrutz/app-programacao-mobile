import { Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useAuth } from '@/provider/AuthProvider';
import { useNavigation } from "@react-navigation/native";

export default function CriarConta() {
  const { signUp } = useAuth();
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleCriarConta = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert("Erro", "Todos os campos são obrigatórios");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }


    try {
      await signUp(nome, email, senha, confirmarSenha);
    } catch (e: any) {
      Alert.alert('Erro ao criar conta', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* Botão de voltar */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Logo */}
          <Image
            source={require('../assets/images/capii.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Título */}
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>
            Crie sua conta para começar sua jornada de aprendizado
          </Text>

          {/* Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#D1D5DB"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#D1D5DB"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor="#D1D5DB"
              secureTextEntry={!showSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity style={styles.passwordIcon} onPress={() => setShowSenha(!showSenha)}>
              <Feather name={showSenha ? "eye-off" : "eye"} size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar senha"
              placeholderTextColor="#D1D5DB"
              secureTextEntry={!showConfirmarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity style={styles.passwordIcon} onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}>
              <Feather name={showConfirmarSenha ? "eye-off" : "eye"} size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          {/* Botão Criar Conta */}
          <TouchableOpacity style={styles.createButton} onPress={handleCriarConta} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
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
  createButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
