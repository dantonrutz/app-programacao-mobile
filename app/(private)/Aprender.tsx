import { useApi } from '@/hooks/useApi';
import { ClassroomInterface } from '@/types/Classroom';
import { ExerciseInterface } from '@/types/Exercise';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Aprender() {
  const [lessons, setLessons] = useState<ExerciseInterface[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const { get } = useApi();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const data: ClassroomInterface[] = await get('/classroom');
        setClassrooms(data);
        if (data.length > 0 && !selectedClassroom) {
          setSelectedClassroom(data[0].id.toString());
        }
      } catch (e: any) {
        console.error('Erro ao carregar as turmas:', e.message || e);
      }
    };

    fetchClassrooms();
  }, [get, selectedClassroom]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        if (selectedClassroom) {
          const data: ExerciseInterface[] = await get(`/exercise/student?classroomId=${selectedClassroom}`);
          const formattedData = data.map((lesson) => ({
            ...lesson,
            status: lesson.status || 'available', // Default to 'available' if status is missing
            difficulty: lesson.difficulty || 1, // Default difficulty if missing
          }));
          const sortedData = formattedData.sort((a, b) => a.difficulty - b.difficulty); // Sort by difficulty
          setLessons(sortedData);
        } else {
          setLessons([]); // Clear lessons if no classroom is selected
        }
      } catch (e: any) {
        console.error('Erro ao carregar as lições:', e.message || e);
      }
    };

    fetchLessons();
  }, [get, selectedClassroom]);

  const renderDifficultyStars = (difficulty: number) => {
    return [...Array(difficulty)].map((_, i) => (
      <Ionicons key={i} name="star" size={16} color="#FCD34D" />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient
          colors={['#3B82F6', '#7C3AED']}
          style={[styles.gradient, { flex: 1 }]}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Jornada de aprendizagem</Text>
            <Text style={styles.subtitle}>Continue sua aventura!</Text>
          </View>
          <View style={[styles.pathContainer, { flex: 1 }]}>
            <Text style={styles.subtitle}>Selecione sua turma:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedClassroom}
                onValueChange={(itemValue) => setSelectedClassroom(itemValue)}
                style={styles.picker}
              >
                {classrooms.map((classroom) => (
                  <Picker.Item key={classroom.id} label={classroom.name} value={classroom.id.toString()} />
                ))}
              </Picker>
            </View>
            {lessons.map((lesson, index) => (
              <View key={lesson.id} style={styles.lessonWrapper}>
                {index > 0 && <View style={styles.connector} />}

                <TouchableOpacity
                  style={[
                    styles.lessonCard,
                    lesson.status === 'bloqueado' && styles.lockedLesson,
                    lesson.status === 'correto' && styles.correctLesson,
                    lesson.status === 'errado' && styles.wrongLesson,
                  ]}
                  disabled={lesson.status === 'bloqueado'}
                  onPress={() =>
                    router.push({
                      pathname: '/exercicios/[id]',
                      params: { id: lesson.id }, // Ensure the ID is passed correctly
                    })
                  }
                >
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={
                        lesson.status === 'bloqueado'
                          ? 'lock-closed'
                          : lesson.status === 'correto'
                            ? 'checkmark-circle'
                            : lesson.status === 'errado'
                              ? 'close-circle'
                              : 'navigate' // Default icon for 'liberado'
                      }
                      size={28}
                      color={
                        lesson.status === 'bloqueado'
                          ? '#9CA3AF'
                          : lesson.status === 'correto'
                            ? '#FFFFFF'
                            : lesson.status === 'errado'
                              ? '#FFFFFF'
                              : '#FFFFFF' // Default color for 'liberado'
                      }
                    />
                  </View>

                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{lesson.question}</Text>
                    <Text style={styles.lessonDescription}>{lesson.theme}</Text>
                    <View style={styles.difficultyContainer}>
                      {renderDifficultyStars(lesson.difficulty)}
                    </View>
                  </View>
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
    marginTop: 12,
    fontSize: 23,
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
  correctLesson: {
    backgroundColor: '#10B981', // Green background for correct
    opacity: 0.8, // Add opacity for a softer look
  },
  wrongLesson: {
    backgroundColor: '#EF4444', // Red background for wrong
    opacity: 0.8, // Add opacity for a softer look
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
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 4
  },
  picker: {
    height: 50,
    color: '#FFFFFF',
  },
});