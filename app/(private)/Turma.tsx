import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

const rankingData = [
  { id: '1', name: 'Danton', score: 1250 },
  { id: '2', name: 'Lucas', score: 1100 },
  { id: '3', name: 'Mariana', score: 980 },
  { id: '4', name: 'Carla', score: 870 },
  { id: '5', name: 'Rafaela', score: 800 },
];

export default function Turma() {
  const renderItem = ({ item, index }: any) => {
    const medal =
      index === 0 ? '🥇' :
      index === 1 ? '🥈' :
      index === 2 ? '🥉' : '';

    return (
      <View style={styles.rankingItem}>
        <Text style={styles.position}>{index + 1}º</Text>
        <Text style={styles.name}>
          {medal ? `${medal} ${item.name}` : item.name}
        </Text>
        <Text style={styles.score}>{item.score} XP</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Ranking da Turma</Text>
          <Text style={styles.subtitle}>Veja sua posição e pontuação total</Text>
        </View>

        <View style={styles.content}>
          <FlatList
            data={rankingData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
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
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    width: 40,
  },
  name: {
    fontSize: 18,
    color: '#FFF',
    flex: 1,
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'right',
    width: 80,
  },
});
