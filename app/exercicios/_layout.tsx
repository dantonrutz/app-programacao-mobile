import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="exercicios/[id]"
        options={{ headerShown: false }} // ❌ desativa o header nativo
      />
      <Stack.Screen
        name="exercicios"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
