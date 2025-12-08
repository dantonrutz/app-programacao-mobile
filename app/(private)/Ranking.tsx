import { useApi } from '@/hooks/useApi';
import { useTheme } from '@/provider/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface RankingEntry {
    id: string;
    position?: number;
    score?: number;
    classroomId: string;
    userId: string;
    user?: {
        id: string;
        name?: string;
        email?: string;
    };
}

interface AnswerEntry {
    id: string;
    userId: string;
    correct: boolean;
    exerciseId?: string;
    createdAt?: string;
    user?: { id: string; name?: string; email?: string };
}

interface AggregatedUser {
    user: { id: string; name?: string; email?: string };
    totalScore: number;
    rankingEntries: number;
    correctCount: number;
    attempts: number;
}

export default function Ranking() {
    const { get } = useApi();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState<AggregatedUser[]>([]);

    const fetchBoard = useCallback(async () => {
        try {
            setLoading(true);

            // buscar rankings e respostas em paralelo
            const [rankings, answers]: [RankingEntry[], AnswerEntry[]] = await Promise.all([
                get('/ranking'),
                get('/answer'),
            ]);

            const map = new Map<string, AggregatedUser>();

            // popula com informações de ranking (score e user quando disponível)
            (rankings || []).forEach(r => {
                const uid = r.user?.id ?? r.userId;
                const userObj = r.user ?? { id: r.userId, name: 'Usuário', email: '' };
                const current = map.get(uid) ?? {
                    user: userObj,
                    totalScore: 0,
                    rankingEntries: 0,
                    correctCount: 0,
                    attempts: 0,
                };
                current.totalScore += typeof r.score === 'number' ? r.score : 0;
                current.rankingEntries += 1;
                // assegura nome/email se vier do ranking
                if (userObj.name) current.user = { ...current.user, name: userObj.name, email: userObj.email };
                map.set(uid, current);
            });

            // agrega respostas por usuário (acertos / tentativas)
            (answers || []).forEach(a => {
                const uid = a.user?.id ?? a.userId;
                const userObj = a.user ?? { id: a.userId, name: 'Usuário', email: '' };
                const current = map.get(uid) ?? {
                    user: userObj,
                    totalScore: 0,
                    rankingEntries: 0,
                    correctCount: 0,
                    attempts: 0,
                };
                current.attempts += 1;
                if (a.correct) current.correctCount += 1;
                // preenche nome/email se estiver faltando
                if ((!current.user.name || current.user.name === 'Usuário') && userObj.name) {
                    current.user = { ...current.user, name: userObj.name, email: userObj.email };
                }
                map.set(uid, current);
            });

            // transforma em array ordenando por correctCount desc, depois por totalScore desc
            const sorted = Array.from(map.values()).sort((a, b) => {
                if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
                return b.totalScore - a.totalScore;
            });

            setBoard(sorted);
        } catch (e: any) {
            console.log('Erro ao carregar ranking:', e?.message ?? e);
            setBoard([]);
        } finally {
            setLoading(false);
        }
    }, [get]);

    useEffect(() => {
        fetchBoard();
    }, [fetchBoard]);

    useFocusEffect(
        useCallback(() => {
            fetchBoard();
        }, [fetchBoard])
    );

    const backgroundColor = theme === 'dark' ? '#0F172A' : '#F8FAFC';
    const textColor = theme === 'dark' ? '#E6EEF8' : '#0F172A';

    const renderItem = ({ item, index }: { item: AggregatedUser; index: number }) => {
        const pos = index + 1;
        const medalColor = pos === 1 ? '#F59E0B' : pos === 2 ? '#94A3B8' : pos === 3 ? '#F97316' : '#CBD5E1';
        const accuracy = item.attempts > 0 ? Math.round((item.correctCount / item.attempts) * 100) : 0;
        const incorrect = item.attempts - item.correctCount;

        return (
            <View style={[styles.row, { backgroundColor: theme === 'dark' ? '#0B1220' : '#FFFFFF' }]}>
                <View style={styles.pos}>
                    <Text style={[styles.posText, { color: textColor }]}>{pos}</Text>
                </View>

                <View style={styles.info}>
                    <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
                        {item.user.name ?? 'Usuário sem nome'}
                    </Text>
                    <Text style={[styles.meta, { color: '#9CA3AF' }]}>
                        {item.user.email ?? ''}
                    </Text>
                </View>

                <View style={styles.stats}>
                    <View style={[styles.badge, { backgroundColor: medalColor }]}>
                        <Ionicons name="trophy" size={14} color="#fff" />
                        <Text style={styles.badgeText}>{item.correctCount}</Text>
                    </View>

                    <Text style={[styles.attemptsText, { color: '#9CA3AF' }]}>
                        {item.attempts} tent.
                    </Text>

                    <Text style={[styles.accuracyText, { color: '#6B7280' }]}>
                        {accuracy}% acertos ({incorrect} err.)
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: theme === 'dark' ? '#0B1220' : '#0EA5A4' }]}>
                <Text style={styles.headerTitle}>Ranking</Text>
                <Text style={styles.headerSubtitle}>Ordenado por acertos (mais acertos primeiro)</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0EA5A4" />
                </View>
            ) : (
                <FlatList
                    data={board}
                    keyExtractor={(item) => item.user.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={{ color: textColor }}>Nenhum dado de ranking disponível</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: 20,
        paddingBottom: 24,
    },
    headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { padding: 20, alignItems: 'center' },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    pos: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E6EEF8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    posText: { fontSize: 16, fontWeight: '700' },

    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600' },
    meta: { fontSize: 12, marginTop: 2 },

    stats: { alignItems: 'flex-end' },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 6,
    },
    badgeText: { color: '#fff', fontWeight: '700', marginLeft: 6 },
    attemptsText: { fontSize: 12 },
    accuracyText: { fontSize: 12, marginTop: 2 },
});