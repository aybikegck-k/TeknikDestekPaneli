import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { tickets } from '../../data/tickets';
import StatusBadge from '../../components/StatusBadge';

export default function ArizaDetayScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>⚠️ Arıza Bulunamadı</Text>
        <Text style={styles.errorText}>Aradığınız ID ({id}) sistemde kayıtlı değil.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.idLabel}>Talep ID: {ticket.id}</Text>
        <Text style={styles.title}>{ticket.baslik}</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Konum:</Text>
          <Text style={styles.value}>{ticket.konum}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Kategori:</Text>
          <Text style={styles.value}>{ticket.kategori}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Durum:</Text>
          <StatusBadge durum={ticket.durum} />
        </View>

        <View style={styles.descBox}>
          <Text style={styles.label}>Açıklama:</Text>
          <Text style={styles.descText}>{ticket.aciklama}</Text>
        </View>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Listeye Geri Dön</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf2f8', padding: 20, justifyContent: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#fbcfe8', gap: 12 },
  idLabel: { fontSize: 12, fontWeight: 'bold', color: '#be185d' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#831843', marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: '#9d174d' },
  value: { fontSize: 13, color: '#831843' },
  descBox: { marginTop: 8, borderTopWidth: 1, borderColor: '#fce7f3', paddingTop: 8 },
  descText: { fontSize: 13, color: '#831843', marginTop: 4, lineHeight: 18 },
  
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdf2f8', padding: 20 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: '#e11d48', marginBottom: 8 },
  errorText: { fontSize: 14, color: '#9d174d', marginBottom: 20, textAlign: 'center' },
  backButton: { backgroundColor: '#db2777', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginTop: 16, alignItems: 'center' },
  backButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
});