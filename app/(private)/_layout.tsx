import { useApi } from "@/hooks/useApi";
import { useTheme } from "@/provider/ThemeProvider";
import { UserInterface } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

// --- Itens do menu ---
const MENU_ITEMS = [
  { label: "Início", route: "/Inicio", icon: "home", key: "home", colors: ['#3B82F6', '#3B82F6'], studentOnly: true },
  { label: "Aprender", route: "/Aprender", icon: "book", key: "aprender", colors: ['#7C3AED', '#7C3AED'], studentOnly: true },
  { label: "Turma", route: "/Turma", icon: "trophy", key: "turma", colors: ['#EC4899', '#EC4899'] },
  { label: "Loja", route: "/Loja", icon: "bag", key: "loja", colors: ['#FCD34D', '#FCD34D'], studentOnly: true },
  { label: "Exercícios", route: "/Exercicios", icon: "pencil", key: "exercicios", teacherOnly: true, colors: ['#10B981', '#10B981'] },
  { label: "Perfil", route: "/Perfil", icon: "person", key: "perfil", colors: ['#F87171', '#F87171'] },
];

export default function PrivateLayout() {
  const { get } = useApi();
  const [user, setUser] = useState<UserInterface | null>(null);
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: UserInterface = await get('/user/me');
        setUser(userData);
      } catch (e: any) {
        console.log('Erro ao buscar usuário:', e.message);
      }
    };
    fetchUser();
  }, [get]);

  const isTeacher = user?.roles.includes('TEACHER') || false;
  const activeKey = MENU_ITEMS.find(item => pathname.includes(item.route))?.key || "home";

  const defaultInactiveColor = theme === "dark" ? "#9CA3AF" : "#6B7280";
  const backgroundColor = theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(245,245,245,0.8)";

  // Redirecionar para a tela correta de Turma
  const handleTurmaPress = () => {
    if (isTeacher) {
      router.push('/TurmaProfessor');
    } else {
      router.push('/Turma');
    }
  };

  return (
    <BlurView
      intensity={theme === "dark" ? 60 : 80}
      tint={theme === "dark" ? "dark" : "light"}
      style={[styles.container, { backgroundColor }]}
    >
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
        {MENU_ITEMS.map(item => {
          if (item.teacherOnly && !isTeacher) return null;
          if (item.studentOnly && isTeacher) return null;

          return (
            <Tabs.Screen key={item.key} name={item.route.replace("/", "")} />
          );
        })}
      </Tabs>

      {/* Navbar com vidro */}
      <View style={[styles.navbar, { marginBottom: Platform.OS !== "ios" ? 46 : 0 }]}>
        {MENU_ITEMS.map(item => {
          if (item.teacherOnly && !isTeacher) return null;
          if (item.studentOnly && isTeacher) return null;

          const isActive = activeKey === item.key;
          const iconName = isActive ? item.icon : `${item.icon}-outline`;

          return (
            <Pressable
              key={item.key}
              style={styles.navItem}
              onPress={() => {
                if (item.key === 'turma') {
                  handleTurmaPress();
                } else {
                  router.push(item.route as any);
                }
              }}
              android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
            >
              {isActive ? (
                <MaskedView maskElement={<Ionicons name={iconName as any} size={24} color="black" />}>
                  <LinearGradient
                    colors={item.colors as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ width: 24, height: 24 }}
                  />
                </MaskedView>
              ) : (
                <Ionicons name={iconName as any} size={20} color={defaultInactiveColor} />
              )}

              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isActive ? item.colors[1] : defaultInactiveColor,
                    fontSize: isActive ? 12 : 11,
                    opacity: isActive ? 1 : 0.8
                  }
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    paddingVertical: 18,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
