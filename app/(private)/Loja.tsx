import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const items = [
  { id: '1', name: 'Avatar Especial', icon: 'person-circle', price: 100, description: 'Desbloqueie um novo visual exclusivo!' },
  { id: '2', name: 'Multiplicador de XP', icon: 'flash', price: 250, description: 'Ganhe XP dobrado por 24h.' },
  { id: '3', name: 'Tema Dourado', icon: 'color-palette', price: 150, description: 'Mude o tema do app para dourado.' },
  { id: '4', name: 'Mochila de Itens', icon: 'bag', price: 200, description: 'Aumente o limite de inventário.' },
];

export default function Loja() {
  const [points, setPoints] = useState(420); // Exemplo de pontos atuais

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F59E0B', '#FCD34D']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Loja</Text>

          <View style={styles.pointsContainer}>
            <Ionicons name="star" size={22} color="#FFF" />
            <Text style={styles.pointsText}>{points} pts</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.itemInfo}>
                <Ionicons name={item.icon as any} size={36} color="#FFF" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
              </View>

              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>{item.price} pts</Text>
                <TouchableOpacity
                  style={[styles.buyButton, points < item.price && { opacity: 0.6 }]}
                  disabled={points < item.price}
                  onPress={() => setPoints(points - item.price)}
                >
                  <Text style={styles.buyText}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20 },
  header: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pointsText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
  },
  content: { flex: 1 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  itemDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
  },
  itemFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buyButton: {
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buyText: {
    color: '#F59E0B',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
