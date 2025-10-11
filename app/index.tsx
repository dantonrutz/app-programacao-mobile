import { useAuth } from "@/provider/AuthProvider";
import { LinearGradient } from 'expo-linear-gradient';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index()  {
  const  { signIn  }  =  useAuth() ;

  return  (
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

          <TouchableOpacity 
            style={styles.googleButton}
            onPress={signIn}
            activeOpacity={0.8}
          >
            <Image 
              source={require('../assets/images/google.webp')} 
              style={styles.googleIcon}
            />
            <Text style={styles.buttonText}>Continuar com Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Ao continuar, você concorda com nossos
            </Text>
            <TouchableOpacity>
              <Text style={styles.link}>Termos de Serviço</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    position: 'relative',
    alignItems: 'center',
    top: 60,
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