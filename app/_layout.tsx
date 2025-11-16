import { AuthProvider, useAuth } from "@/provider/AuthProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { Stack } from "expo-router";
import { LogBox } from "react-native";

// Ignorar aviso de notificações remotas no Expo Go
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
]);

const InitialLayout = () => {
  const { isAuthenticated } = useAuth();
  return (
    <ThemeProvider>
      <Stack>

        {/* Rotas protegidas */}
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(private)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Rotas públicas */}
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack.Protected>

      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  )
}
