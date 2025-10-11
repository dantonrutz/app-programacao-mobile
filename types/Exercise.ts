import { Ionicons } from "@expo/vector-icons";

export interface ExerciseInterface {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  icon: keyof typeof Ionicons.glyphMap;
  difficulty: 1 | 2 | 3;
}