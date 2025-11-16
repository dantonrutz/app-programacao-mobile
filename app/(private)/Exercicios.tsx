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

interface Exercise {
    id: string;
    question: string;
    options: string[];
    answer: string;
    theme: string;
    authorId: string;
    classroomId?: number;
}

export default function Exercicios() {
    const { post, get, put, delete: deleteExercise } = useApi();
    const { theme } = useTheme();
    const { getUser } = useAuth(); // usar sessão já carregada
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('');

    // Form state
    const [form, setForm] = useState({
        question: '',
        theme: '',
        answer: '',
        options: ['', '', '', ''],
        classroomId: '',
    });

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                // pegar usuário da sessão via AuthProvider (fallback para null)
                const user: UserInterface | null = typeof getUser === 'function' ? await getUser() : null;
                if (user?.id) {
                    setUserId(user.id);
                } else {
                    console.log('Usuário na sessão não possui id ou não está disponível');
                }
            } catch (e: any) {
                console.log('Erro ao obter usuário da sessão:', e?.message ?? e);
            }
        };

        fetchUserId();
    }, [getUser]);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const data: Exercise[] = await get('/exercise');
            setExercises(data);
        } catch (e: any) {
            Alert.alert('Erro', e.message || 'Erro ao carregar exercícios');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            question: '',
            theme: '',
            answer: '',
            options: ['', '', '', ''],
            classroomId: '',
        });
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!form.question.trim() || !form.theme.trim() || !form.answer.trim()) {
            Alert.alert('Erro', 'Preencha a pergunta, tema e resposta correta');
            return;
        }

        if (form.options.some(opt => !opt.trim())) {
            Alert.alert('Erro', 'Preencha todas as opções');
            return;
        }

        const payload = {
            question: form.question,
            theme: form.theme,
            answer: form.answer,
            options: form.options,
            authorId: userId,
            classroomId: form.classroomId ? parseInt(form.classroomId) : undefined,
        };

        try {
            if (editingId) {
                await put(`/exercise/${editingId}`, payload);
                Alert.alert('Sucesso', 'Exercício atualizado!');
            } else {
                await post('/exercise', payload);
                Alert.alert('Sucesso', 'Exercício criado!');
            }
            fetchExercises();
            setModalVisible(false);
            resetForm();
        } catch (e: any) {
            Alert.alert('Erro', e.message || 'Erro ao salvar exercício');
        }
    };

    const handleEdit = (exercise: Exercise) => {
        setForm({
            question: exercise.question,
            theme: exercise.theme,
            answer: exercise.answer,
            options: exercise.options,
            classroomId: exercise.classroomId?.toString() || '',
        });
        setEditingId(exercise.id);
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Alert.alert('Confirmar', 'Deseja deletar este exercício?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Deletar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteExercise(`/exercise/${id}`);
                        fetchExercises();
                        Alert.alert('Sucesso', 'Exercício deletado!');
                    } catch (e: any) {
                        Alert.alert('Erro', e.message || 'Erro ao deletar');
                    }
                },
            },
        ]);
    };

    const backgroundColor = theme === 'dark' ? '#1F2937' : '#F3F4F6';
    const textColor = theme === 'dark' ? '#FFFFFF' : '#111827';
    const cardBg = theme === 'dark' ? '#374151' : '#FFFFFF';
    const inputBg = theme === 'dark' ? '#4B5563' : '#E5E7EB';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
                <Text style={styles.headerText}>Meus Exercícios</Text>
                <Text style={styles.headerSubtitle}>Crie e gerencie seus exercícios</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                </View>
            ) : exercises.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-outline" size={64} color="#9CA3AF" />
                    <Text style={[styles.emptyText, { color: textColor }]}>
                        Nenhum exercício criado ainda
                    </Text>
                    <Text style={[styles.emptySubtext, { color: '#9CA3AF' }]}>
                        Comece criando seu primeiro exercício
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={[styles.card, { backgroundColor: cardBg }]}>
                            <View style={styles.cardHeader}>
                                <View style={styles.titleContainer}>
                                    <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={2}>
                                        {item.question}
                                    </Text>
                                    <View style={styles.themeBadge}>
                                        <Text style={styles.themeBadgeText}>{item.theme}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardActions}>
                                    <TouchableOpacity onPress={() => handleEdit(item)}>
                                        <Ionicons name="pencil" size={20} color="#3B82F6" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 12 }}>
                                        <Ionicons name="trash" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.optionsContainer}>
                                <Text style={[styles.optionsLabel, { color: '#9CA3AF' }]}>Opções:</Text>
                                {item.options.map((opt, idx) => (
                                    <View key={idx} style={styles.optionItem}>
                                        <Text style={[styles.optionText, { color: textColor }]}>
                                            {idx + 1}. {opt}
                                            {opt === item.answer && (
                                                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                            )}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    resetForm();
                    setModalVisible(true);
                }}
            >
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Modal de criação/edição */}
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
                                {editingId ? 'Editar Exercício' : 'Novo Exercício'}
                            </Text>
                            <View style={{ width: 28 }} />
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={[styles.label, { color: textColor }]}>Pergunta *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                                placeholder="Digite a pergunta"
                                placeholderTextColor="#9CA3AF"
                                value={form.question}
                                onChangeText={(text) => setForm({ ...form, question: text })}
                                multiline
                            />

                            <Text style={[styles.label, { color: textColor }]}>Tema *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                                placeholder="Ex: Matemática, Português..."
                                placeholderTextColor="#9CA3AF"
                                value={form.theme}
                                onChangeText={(text) => setForm({ ...form, theme: text })}
                            />

                            <Text style={[styles.label, { color: textColor }]}>Opções *</Text>
                            {form.options.map((opt, idx) => (
                                <View key={idx}>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                                        placeholder={`Opção ${idx + 1}`}
                                        placeholderTextColor="#9CA3AF"
                                        value={opt}
                                        onChangeText={(text) => {
                                            const newOptions = [...form.options];
                                            newOptions[idx] = text;
                                            setForm({ ...form, options: newOptions });
                                        }}
                                    />
                                </View>
                            ))}

                            <Text style={[styles.label, { color: textColor }]}>Resposta Correta *</Text>
                            <View style={styles.answerContainer}>
                                {form.options.map((opt, idx) => (
                                    opt.trim() && (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[
                                                styles.answerOption,
                                                form.answer === opt && styles.answerOptionActive,
                                            ]}
                                            onPress={() => setForm({ ...form, answer: opt })}
                                        >
                                            <Text
                                                style={[
                                                    styles.answerOptionText,
                                                    form.answer === opt && styles.answerOptionTextActive,
                                                ]}
                                            >
                                                {opt}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                ))}
                            </View>

                            <Text style={[styles.label, { color: textColor }]}>ID da Turma (opcional)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                                placeholder="ID da turma"
                                placeholderTextColor="#9CA3AF"
                                value={form.classroomId}
                                onChangeText={(text) => setForm({ ...form, classroomId: text })}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>
                                    {editingId ? 'Atualizar' : 'Criar'} Exercício
                                </Text>
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
    titleContainer: { flex: 1, marginRight: 12 },
    cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    themeBadge: { backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    themeBadgeText: { fontSize: 12, color: '#0369A1', fontWeight: '500' },

    cardActions: { flexDirection: 'row' },
    optionsContainer: { marginTop: 12 },
    optionsLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
    optionItem: { marginLeft: 8, marginBottom: 6 },
    optionText: { fontSize: 14 },

    fab: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#10B981',
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
        marginBottom: 16,
        fontSize: 14,
    },

    answerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    answerOption: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    answerOptionActive: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
    answerOptionText: { fontSize: 12, color: '#6B7280' },
    answerOptionTextActive: { color: '#059669', fontWeight: '600' },

    saveButton: {
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});