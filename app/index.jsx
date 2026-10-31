import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { tickets as baslangicTalepleri } from '../data/tickets';
import TicketCard from '../components/TicketCard';

export default function AnaEkran() {
  const router = useRouter();
  const [talepler, setTalepler] = useState(baslangicTalepleri);
  
  // 'liste' veya 'form' görünümünü kontrol eden state (Bileşen/Görünüm yönetimi)
  const [aktifGorunum, setAktifGorunum] = useState('liste');

  // Form state'leri
  const [yeniBaslik, setYeniBaslik] = useState('');
  const [yeniKonum, setYeniKonum] = useState('');
  const [yeniAciklama, setYeniAciklama] = useState('');

  const talepEkle = () => {
    if (!yeniBaslik.trim() || !yeniKonum.trim()) {
      Alert.alert('Hata', 'Başlık ve konum boş bırakılamaz!');
      return;
    }

    const yeniTalep = {
      id: String(Date.now().toString().slice(-3)),
      baslik: yeniBaslik.trim(),
      konum: yeniKonum.trim(),
      aciklama: yeniAciklama.trim(),
      kategori: 'Genel',
      oncelik: 'Orta',
      durum: 'Bekliyor'
    };

    setTalepler([yeniTalep, ...talepler]);
    setYeniBaslik('');
    setYeniKonum('');
    setYeniAciklama('');
    setAktifGorunum('liste'); // Kayıttan sonra listeye dön
    Alert.alert('Başarılı', 'Yeni arıza eklendi.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf2f8" />
      
      {/* Üst Bilgi ve Görünüm Değiştirme Butonları (Component Navigasyonu) */}
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Teknik Destek Paneli</Text>
        <View style={styles.tabRow}>
          <Pressable 
            style={[styles.tabBtn, aktifGorunum === 'liste' && styles.activeTab]} 
            onPress={() => setAktifGorunum('liste')}
          >
            <Text style={[styles.tabText, aktifGorunum === 'liste' && styles.activeTabText]}>Arıza Listesi</Text>
          </Pressable>
          <Pressable 
            style={[styles.tabBtn, aktifGorunum === 'form' && styles.activeTab]} 
            onPress={() => setAktifGorunum('form')}
          >
            <Text style={[styles.tabText, aktifGorunum === 'form' && styles.activeTabText]}>+ Yeni Arıza</Text>
          </Pressable>
        </View>
      </View>

      {/* Koşullu Bileşen Gösterimi (Component Yapısı) */}
      {aktifGorunum === 'liste' ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Kayıtlı Arızalar ({talepler.length})</Text>
          <FlatList
            data={talepler}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard
                ticket={item}
                onPress={() => router.push(`/ariza/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Yeni Arıza / Talep Formu</Text>
          <TextInput
            style={styles.input}
            placeholder="Arıza Başlığı"
            placeholderTextColor="#9d174d"
            value={yeniBaslik}
            onChangeText={setYeniBaslik}
          />
          <TextInput
            style={styles.input}
            placeholder="Konum (Örn: Lab 2)"
            placeholderTextColor="#9d174d"
            value={yeniKonum}
            onChangeText={setYeniKonum}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Açıklama..."
            placeholderTextColor="#9d174d"
            value={yeniAciklama}
            onChangeText={setYeniAciklama}
            multiline
          />
          <Pressable style={styles.saveButton} onPress={talepEkle}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf2f8', padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#831843', marginBottom: 12, textAlign: 'center' },
  tabRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#fce7f3', borderRadius: 8, borderWidth: 1, borderColor: '#fbcfe8' },
  activeTab: { backgroundColor: '#db2777', borderColor: '#db2777' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#831843' },
  activeTabText: { color: '#ffffff' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#831843', marginBottom: 10, marginHorizontal: 4 },
  listContent: { paddingBottom: 20 },
  formContainer: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#fbcfe8', gap: 10 },
  input: { backgroundColor: '#fdf2f8', borderWidth: 1, borderColor: '#fbcfe8', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#831843' },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#db2777', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  saveButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
});