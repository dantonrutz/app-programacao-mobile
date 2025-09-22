import { Stack } from "expo-router";
import { ThemeProvider } from "./theme_controller";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Início" }} />
        <Stack.Screen name="tela_aprender" options={{ title: "Aprender", headerShown: false }} />
        <Stack.Screen name="tela_turma" options={{ title: "Turma", headerShown: false }} />
        <Stack.Screen name="tela_desafios" options={{ title: "Desafios", headerShown: false }} />
        <Stack.Screen name="tela_perfil" options={{ title: "Perfil", headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
