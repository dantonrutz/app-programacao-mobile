import { ExerciseInterface } from '@/types/Exercise';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const lessons: ExerciseInterface[] = [
  {
    id: '1',
    title: 'Números Naturais',
    description: 'Aprenda sobre números positivos inteiros',
    status: 'completed',
    icon: 'calculator',
    difficulty: 1,
  },
  {
    id: '2',
    title: 'Operações Básicas',
    description: 'Adição e subtração simples',
    status: 'available',
    icon: 'add-circle',
    difficulty: 1,
  },
  {
    id: '3',
    title: 'Multiplicação',
    description: 'Multiplicação e suas propriedades',
    status: 'locked',
    icon: 'close-circle',
    difficulty: 2,
  },
  {
    id: '4',
    title: 'Divisão',
    description: 'Divisão e números decimais',
    status: 'locked',
    icon: 'remove-circle',
    difficulty: 2,
  },
];

export default function Aprender() {
  const renderDifficultyStars = (difficulty: number) => {
    return [...Array(difficulty)].map((_, i) => (
      <Ionicons key={i} name="star" size={16} color="#FCD34D" />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <LinearGradient
          colors={['#3B82F6', '#7C3AED']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Jornada Matemática</Text>
            <Text style={styles.subtitle}>Continue sua aventura!</Text>
          </View>
          <View style={styles.pathContainer}>
            {lessons.map((lesson, index) => (
              <View key={lesson.id} style={styles.lessonWrapper}>
                {index > 0 && <View style={styles.connector} />}

                <TouchableOpacity
                  style={[
                    styles.lessonCard,
                    lesson.status === 'locked' && styles.lockedLesson,
                    lesson.status === 'completed' && styles.completedLesson,
                  ]}
                  disabled={lesson.status === 'locked'}
                  onPress={() =>
                    router.push({
                      pathname: '/exercicios/[id]',
                      params: { id: lesson.id },
                    })
                  }
                >

                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={lesson.status === 'locked' ? 'lock-closed' : lesson.icon}
                      size={28}
                      color={lesson.status === 'locked' ? '#9CA3AF' : '#FFFFFF'}
                    />
                  </View>

                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonDescription}>{lesson.description}</Text>
                    <View style={styles.difficultyContainer}>
                      {renderDifficultyStars(lesson.difficulty)}
                    </View>
                  </View>

                  {lesson.status === 'completed' && (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  pathContainer: {
    padding: 16,
  },
  lessonWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },
  connector: {
    width: 4,
    height: 24,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    marginVertical: -8,
  },
  lessonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  lockedLesson: {
    opacity: 0.5,
  },
  completedLesson: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  completedBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});