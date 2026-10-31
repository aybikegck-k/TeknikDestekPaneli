import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import StatusBadge from './StatusBadge';

export default function TicketCard({ ticket, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.idText}>ID: {ticket.id}</Text>
        <StatusBadge durum={ticket.durum} />
      </View>
      <Text style={styles.title}>{ticket.baslik}</Text>
      <Text style={styles.location}>📍 {ticket.konum}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fbcfe8',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  idText: { fontSize: 12, fontWeight: 'bold', color: '#be185d' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#831843', marginBottom: 4 },
  location: { fontSize: 12, color: '#9d174d' }
});