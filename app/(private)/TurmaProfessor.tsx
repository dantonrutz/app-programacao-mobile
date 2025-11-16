import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/provider/AuthProvider';
import { useTheme } from '@/provider/ThemeProvider';
import { UserInterface } from '@/types/User';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Classroom {
    id: string;
    name: string;
    code: string;
    teacherId: string;
}

interface Ranking {
    id: string;
    position: number;
    score: number;
    classroomId: string;
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export default function TurmaProfessor() {
    const { post, get } = useApi();
    const { theme } = useTheme();
    const { getUser } = useAuth();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [classroomRankings, setClassroomRankings] = useState<{ [key: string]: Ranking[] }>({});
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [form, setForm] = useState({
        name: '',
        code: '',
    });

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const user: UserInterface | null = typeof getUser === 'function' ? await getUser() : null;
                if (user?.id) {
                    setUserId(user.id);
                }
            } catch (e: any) {
                console.log('Erro ao obter usuário:', e?.message ?? e);
            }
        };

        fetchUserId();
    }, [getUser]);

    useEffect(() => {
        if (userId) {
            fetchClassrooms();
        }
    }, [userId]);

    const fetchClassrooms = async () => {
        try {
            setLoading(true);
            const data: Classroom[] = await get('/classroom');
            const myClassrooms = data.filter(c => c.teacherId === userId);
            setClassrooms(myClassrooms);

            // Carregar rankings para cada turma
            const rankings: Ranking[] = await get('/ranking');
            const rankingsByClassroom: { [key: string]: Ranking[] } = {};

            myClassrooms.forEach(classroom => {
                rankingsByClassroom[classroom.id] = rankings.filter(r => r.classroomId === classroom.id);
            });

            setClassroomRankings(rankingsByClassroom);
        } catch (e: any) {
            Alert.alert('Erro', e.message || 'Erro ao carregar turmas');
        } finally {
            setLoading(false);
        }
    };

    const checkCodeExists = async (code: string): Promise<boolean> => {
        try {
            const data: Classroom[] = await get('/classroom');
            return data.some(c => c.code.toLowerCase() === code.toLowerCase());
        } catch (e: any) {
            console.log('Erro ao verificar código:', e?.message ?? e);
            return false;
        }
    };

    const handleCreate = async () => {
        if (!form.name.trim() || !form.code.trim()) {
            Alert.alert('Erro', 'Preencha o nome e código da turma');
            return;
        }

        if (form.code.trim().length < 4) {
            Alert.alert('Erro', 'O código deve ter pelo menos 4 caracteres');
            return;
        }

        const codeExists = await checkCodeExists(form.code.trim());
        if (codeExists) {
            Alert.alert('Erro', 'Esse código de turma já está em uso');
            return;
        }

        const payload = {
            name: form.name,
            code: form.code.trim().toUpperCase(),
            teacherId: userId,
        };

        try {
            await post('/classroom', payload);
            Alert.alert('Sucesso', 'Turma criada com sucesso!');
            fetchClassrooms();
            setModalVisible(false);
            setForm({ name: '', code: '' });
        } catch (e: any) {
            Alert.alert('Erro', e.message || 'Erro ao criar turma');
        }
    };

    const getStudentCount = (classroomId: string): number => {
        return classroomRankings[classroomId]?.length ?? 0;
    };

    const getClassroomStudents = (classroomId: string): Ranking[] => {
        return classroomRankings[classroomId] ?? [];
    };

    const backgroundColor = theme === 'dark' ? '#1F2937' : '#F3F4F6';
    const textColor = theme === 'dark' ? '#FFFFFF' : '#111827';
    const cardBg = theme === 'dark' ? '#374151' : '#FFFFFF';
    const inputBg = theme === 'dark' ? '#4B5563' : '#E5E7EB';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.header}>
                <Text style={styles.headerText}>Minhas Turmas</Text>
                <Text style={styles.headerSubtitle}>Crie e gerencie suas turmas</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#EC4899" />
                </View>
            ) : classrooms.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="school-outline" size={64} color="#9CA3AF" />
                    <Text style={[styles.emptyText, { color: textColor }]}>
                        Nenhuma turma criada ainda
                    </Text>
                    <Text style={[styles.emptySubtext, { color: '#9CA3AF' }]}>
                        Comece criando sua primeira turma
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={classrooms}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => {
                        const students = getClassroomStudents(item.id);
                        const studentCount = getStudentCount(item.id);

                        return (
                            <View style={[styles.card, { backgroundColor: cardBg }]}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.titleContainer}>
                                        <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={2}>
                                            {item.name}
                                        </Text>
                                        <View style={styles.codeBadge}>
                                            <Text style={styles.codeBadgeText}>{item.code}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.statsContainer}>
                                    <View style={styles.statItem}>
                                        <Ionicons name="people" size={20} color="#EC4899" />
                                        <Text style={[styles.statText, { color: textColor }]}>
                                            {studentCount} {studentCount === 1 ? 'aluno' : 'alunos'}
                                        </Text>
                                    </View>
                                </View>

                                {students.length > 0 ? (
                                    <View style={styles.studentsContainer}>
                                        <Text style={[styles.studentsLabel, { color: '#9CA3AF' }]}>Alunos:</Text>
                                        {students.map((ranking, idx) => (
                                            <View key={idx} style={styles.studentItem}>
                                                <Ionicons name="person-circle" size={20} color="#9CA3AF" />
                                                <View style={{ marginLeft: 8, flex: 1 }}>
                                                    <Text style={[styles.studentName, { color: textColor }]}>
                                                        {ranking.user?.name ?? 'Usuário desconhecido'}
                                                    </Text>
                                                    <Text style={styles.studentEmail}>
                                                        {ranking.user?.email ?? 'email@example.com'}
                                                    </Text>
                                                    <Text style={styles.studentScore}>
                                                        Pontos: {ranking.score} | Posição: #{ranking.position}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={[styles.noStudentsText, { color: '#9CA3AF' }]}>
                                        Nenhum aluno registrado nesta turma
                                    </Text>
                                )}
                            </View>
                        );
                    }}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Modal de criação */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={[styles.container, { backgroundColor }]}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={28} color={textColor} />
                            </TouchableOpacity>
                            <Text style={[styles.modalTitle, { color: textColor }]}>
                                Nova Turma
                            </Text>
                            <View style={{ width: 28 }} />
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={[styles.label, { color: textColor }]}>Nome da Turma *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                                placeholder="Ex: Turma A, 3º Ano..."
                                placeholderTextColor="#9CA3AF"
                                value={form.name}
                                onChangeText={(text) => setForm({ ...form, name: text })}
                            />

                            <Text style={[styles.label, { color: textColor }]}>
                                Código da Turma * (não pode ser alterado)
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                                placeholder="Ex: TRM2024"
                                placeholderTextColor="#9CA3AF"
                                value={form.code}
                                onChangeText={(text) => setForm({ ...form, code: text.toUpperCase() })}
                                maxLength={8}
                            />
                            <Text style={styles.helpText}>
                                Este código será compartilhado com alunos para entrar na turma
                            </Text>

                            <TouchableOpacity style={styles.saveButton} onPress={handleCreate}>
                                <Text style={styles.saveButtonText}>Criar Turma</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: 20,
        paddingBottom: 30,
    },
    headerText: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },

    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16, textAlign: 'center' },
    emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },

    listContent: { padding: 16, paddingBottom: 100 },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    titleContainer: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    codeBadge: { backgroundColor: '#FCE7F3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    codeBadgeText: { fontSize: 12, color: '#BE185D', fontWeight: '600' },

    statsContainer: { marginBottom: 12 },
    statItem: { flexDirection: 'row', alignItems: 'center' },
    statText: { fontSize: 14, fontWeight: '600', marginLeft: 8 },

    studentsContainer: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12 },
    studentsLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
    studentItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, paddingLeft: 4 },
    studentName: { fontSize: 13, fontWeight: '500' },
    studentEmail: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
    studentScore: { fontSize: 10, color: '#6B7280', marginTop: 2 },
    noStudentsText: { fontSize: 13, marginTop: 8, fontStyle: 'italic' },

    fab: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EC4899',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    modalContent: { paddingBottom: 40 },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: { fontSize: 20, fontWeight: '600' },

    formContainer: { padding: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    input: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        fontSize: 14,
    },
    helpText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 24,
        fontStyle: 'italic',
    },

    saveButton: {
        backgroundColor: '#EC4899',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});