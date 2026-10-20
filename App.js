import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
  useWindowDimensions
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';

// 1. BAŞLANGIÇ TALEP VERİLERİ (Açıklama alanları eklendi)
const baslangicTalepleri = [
  {
    id: 'TLP-1001',
    baslik: 'Bilgisayar açılmıyor',
    aciklama: 'Power tuşuna basılıyor ancak fanlar dönmüyor ve ekran gelmiyor.',
    kategori: 'Bilgisayar',
    birim: 'Öğrenci İşleri',
    oncelik: 'Yüksek',
    durum: 'Bekliyor'
  },
  {
    id: 'TLP-1002',
    baslik: 'Yazıcı bağlantı sorunu',
    aciklama: 'Ağdaki ortak yazıcıya çıktı gönderilemiyor, hata kodu veriyor.',
    kategori: 'Yazıcı',
    birim: 'Personel Daire',
    oncelik: 'Orta',
    durum: 'İşlemde'
  },
  {
    id: 'TLP-1003',
    baslik: 'İnternet bağlantısı kesildi',
    kategori: 'İnternet',
    aciklama: 'Kütüphane kat 2 kablosuz ağına bağlanılamıyor.',
    birim: 'Kütüphane',
    oncelik: 'Yüksek',
    durum: 'Bekliyor'
  },
  {
    id: 'TLP-1004',
    baslik: 'Ofis yazılımı hata veriyor',
    kategori: 'Yazılım',
    aciklama: 'Excel dosyaları açılırken lisans uyarısı çıkıp kapanıyor.',
    birim: 'Muhasebe',
    oncelik: 'Düşük',
    durum: 'Tamamlandı'
  }
];

// 2. SABİT SEÇENEKLER
const kategoriler = ['Bilgisayar', 'Yazıcı', 'İnternet', 'Yazılım'];
const oncelikler = ['Düşük', 'Orta', 'Yüksek'];
const durumFiltreleri = ['Tümü', 'Bekliyor', 'İşlemde', 'Tamamlandı'];

// 3. RENK YARDIMCI FONKSİYONLARI (Pembe Tema)
const oncelikRengi = (oncelik) => {
  if (oncelik === 'Yüksek') return '#e11d48';
  if (oncelik === 'Orta') return '#db2777';
  return '#16a34a';
};

const durumRengi = (durum) => {
  if (durum === 'Bekliyor') return '#e11d48';
  if (durum === 'İşlemde') return '#db2777';
  return '#16a34a';
};

// 4. TALEP KARTI BİLEŞENİ
function TalepKarti({ talep, onDurumDegistir, onDetaySec, onSil, detayAcik }) {
  const tamamlandi = talep.durum === 'Tamamlandı';

  return (
    <Pressable
      style={[
        styles.ticketCard,
        detayAcik && styles.ticketCardActive
      ]}
      onPress={() => onDetaySec(talep.id)}
      onLongPress={() => onSil(talep.id)}
    >
      {/* ÜST SATIR */}
      <View style={styles.ticketTop}>
        <Text style={styles.ticketId}>{talep.id}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: oncelikRengi(talep.oncelik) + '18' }
          ]}
        >
          <Text style={[styles.priorityText, { color: oncelikRengi(talep.oncelik) }]}>
            {talep.oncelik}
          </Text>
        </View>
      </View>

      {/* ARIZA BAŞLIĞI */}
      <Text style={styles.ticketTitle}>{talep.baslik}</Text>

      {/* KATEGORİ VE BİRİM */}
      <Text style={styles.ticketDetail}>
        {talep.kategori} • {talep.birim}
      </Text>

      {/* DETAY ALANI (G5 - Kısa dokunma ile açılır) */}
      {detayAcik && (
        <View style={styles.detailBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Açıklama:</Text>
            <Text style={styles.detailVal}>{talep.aciklama}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Birim:</Text>
            <Text style={styles.detailVal}>{talep.birim}</Text>
          </View>
          <Text style={styles.hintText}>ℹ️ Silmek için karta uzun basabilirsiniz.</Text>
        </View>
      )}

      {/* ALT SATIR */}
      <View style={styles.ticketBottom}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: durumRengi(talep.durum) + '18' }
          ]}
        >
          <Text style={[styles.statusText, { color: durumRengi(talep.durum) }]}>
            {talep.durum}
          </Text>
        </View>

        {!tamamlandi && (
          <Pressable
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onDurumDegistir(talep.id);
            }}
          >
            <Text style={styles.actionText}>
              {talep.durum === 'Bekliyor' ? 'İşleme Al →' : 'Tamamla ✓'}
            </Text>
          </Pressable>
        )}

        {tamamlandi && (
          <Text style={styles.completedText}>İşlem tamamlandı</Text>
        )}
      </View>
    </Pressable>
  );
}

// 5. ANA YÖNETİM PANELİ
function TeknikDestekPaneli() {
  // STATE'LER
  const [talepler, setTalepler] = useState(baslangicTalepleri);
  const [aktifDurumFiltresi, setAktifDurumFiltresi] = useState('Tümü');
  const [aramaMetni, setAramaMetni] = useState(''); // Özgün özellik: Arama
  const [seciliDetayId, setSeciliDetayId] = useState(null);

  // Form State'leri (G1)
  const [yeniBaslik, setYeniBaslik] = useState('');
  const [yeniAciklama, setYeniAciklama] = useState('');
  const [secilenKategori, setSecilenKategori] = useState('Bilgisayar');
  const [secilenOncelik, setSecilenOncelik] = useState('Orta');

  const { width } = useWindowDimensions();

  // YENİ TALEP EKLEME (G3 & G4)
  const talepEkle = () => {
    // Boşluk kontrolü (G3)
    if (!yeniBaslik.trim() || !yeniAciklama.trim()) {
      Alert.alert('Hata', 'Talep başlığı ve açıklaması boş bırakılamaz!');
      return;
    }

    const yeniTalep = {
      id: 'TLP-' + (1000 + talepler.length + 1),
      baslik: yeniBaslik.trim(),
      aciklama: yeniAciklama.trim(),
      kategori: secilenKategori,
      birim: 'Genel Birim',
      oncelik: secilenOncelik,
      durum: 'Bekliyor'
    };

    setTalepler([yeniTalep, ...talepler]);
    setYeniBaslik('');
    setYeniAciklama('');
    Alert.alert('Başarılı', 'Yeni destek talebi oluşturuldu.');
  };

  // UZUN BASMA İLE SİLME (G6)
  const talepSilOnayi = (id) => {
    Alert.alert(
      'Talep Sil',
      'Bu destek talebini silmek istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setTalepler(talepler.filter((item) => item.id !== id));
            Alert.alert('Bilgi', 'Talep başarıyla silindi.');
          }
        }
      ]
    );
  };

  // DURUM DEĞİŞTİRME (G7)
  const durumDegistir = (id) => {
    setTalepler((onceki) =>
      onceki.map((item) => {
        if (item.id !== id) return item;
        let yeniDurum = item.durum;
        if (item.durum === 'Bekliyor') yeniDurum = 'İşlemde';
        else if (item.durum === 'İşlemde') yeniDurum = 'Tamamlandı';
        return { ...item, durum: yeniDurum };
      })
    );
  };

  const detaySecToggle = (id) => {
    setSeciliDetayId((onceki) => (onceki === id ? null : id));
  };

  // FİLTRELEME VE ARAMA (Özgün Özellik)
  const filtrelenmisTalepler = talepler.filter((item) => {
    const durumUyumu =
      aktifDurumFiltresi === 'Tümü' || item.durum === aktifDurumFiltresi;
    const aramaUyumu =
      item.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      item.id.toLowerCase().includes(aramaMetni.toLowerCase());
    return durumUyumu && aramaUyumu;
  });

  // LİSTE ÜST ALANI (Form ve Filtreler)
  const listeBasligi = (
    <View>
      {/* BAŞLIK */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>BİLGİ İŞLEM DAİRE BAŞKANLIĞI</Text>
        <Text style={styles.title}>Teknik Destek Paneli</Text>
        <Text style={styles.subtitle}>Yeni talep oluşturun ve yönetin.</Text>
      </View>

      {/* YENİ TALEP FORMU (G1, G2, G3) */}
      <View style={styles.formContainer}>
        <Text style={styles.formSectionTitle}>Yeni Arıza / Destek Talebi Aç</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Talep Başlığı (Örn: Ekran kırıldı)"
          placeholderTextColor="#9d174d"
          value={yeniBaslik}
          onChangeText={setYeniBaslik}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Açıklama giriniz..."
          placeholderTextColor="#9d174d"
          value={yeniAciklama}
          onChangeText={setYeniAciklama}
          multiline
        />

        {/* Kategori Seçim Butonları (G2) */}
        <Text style={styles.labelSmall}>Kategori Seçin:</Text>
        <View style={styles.chipRow}>
          {kategoriler.map((kat) => (
            <Pressable
              key={kat}
              style={[
                styles.chip,
                secilenKategori === kat && styles.activeChip
              ]}
              onPress={() => setSecilenKategori(kat)}
            >
              <Text
                style={[
                  styles.chipText,
                  secilenKategori === kat && styles.activeChipText
                ]}
              >
                {kat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Öncelik Seçim Butonları */}
        <Text style={styles.labelSmall}>Öncelik Seviyesi:</Text>
        <View style={styles.chipRow}>
          {oncelikler.map((onc) => (
            <Pressable
              key={onc}
              style={[
                styles.chip,
                secilenOncelik === onc && styles.activePriorityChip
              ]}
              onPress={() => setSecilenOncelik(onc)}
            >
              <Text
                style={[
                  styles.chipText,
                  secilenOncelik === onc && styles.activeChipText
                ]}
              >
                {onc}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.saveButton} onPress={talepEkle}>
          <Text style={styles.saveButtonText}>Talebi Kaydet</Text>
        </Pressable>
      </View>

      {/* ÖZGÜN ÖZELLİK: ARAMA ÇUBUĞU */}
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Başlık veya ID ile arama yapın..."
        placeholderTextColor="#9d174d"
        value={aramaMetni}
        onChangeText={setAramaMetni}
      />

      {/* DURUM FİLTRELERİ */}
      <View style={styles.filterContainer}>
        {durumFiltreleri.map((filtre) => (
          <Pressable
            key={filtre}
            onPress={() => setAktifDurumFiltresi(filtre)}
            style={[
              styles.filterButton,
              aktifDurumFiltresi === filtre && styles.activeFilter
            ]}
          >
            <Text
              style={[
                styles.filterText,
                aktifDurumFiltresi === filtre && styles.activeFilterText
              ]}
            >
              {filtre}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* LİSTE BAŞLIĞI VE SAYACI */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Talep Listesi</Text>
        <Text style={styles.sectionCount}>{filtrelenmisTalepler.length} kayıt</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf2f8" />
      <FlatList
        data={filtrelenmisTalepler}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TalepKarti
            talep={item}
            onDurumDegistir={durumDegistir}
            onDetaySec={detaySecToggle}
            onSil={talepSilOnayi}
            detayAcik={seciliDetayId === item.id}
          />
        )}
        ListHeaderComponent={listeBasligi}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Kayıt bulunamadı</Text>
            <Text style={styles.emptyText}>Bu kriterlere uygun destek talebi yok.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TeknikDestekPaneli />
    </SafeAreaProvider>
  );
}

// 6. STİLLER (Pembe Tema)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf2f8' },
  listContent: { paddingHorizontal: 20, paddingBottom: 45, flexGrow: 1 },
  header: {
    backgroundColor: '#fce7f3',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#fbcfe8'
  },
  headerLabel: { fontSize: 11, fontWeight: 'bold', color: '#be185d', letterSpacing: 0.8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#831843', marginTop: 6 },
  subtitle: { fontSize: 13, color: '#9d174d', marginTop: 4 },
  
  // FORM STİLLERİ
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#fbcfe8'
  },
  formSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#831843', marginBottom: 10 },
  input: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fbcfe8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#831843',
    marginBottom: 10
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  labelSmall: { fontSize: 12, fontWeight: '600', color: '#9d174d', marginTop: 4, marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: {
    backgroundColor: '#fce7f3',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fbcfe8'
  },
  activeChip: { backgroundColor: '#db2777', borderColor: '#db2777' },
  activePriorityChip: { backgroundColor: '#be185d', borderColor: '#be185d' },
  chipText: { fontSize: 11, color: '#9d174d', fontWeight: '600' },
  activeChipText: { color: '#ffffff' },
  saveButton: {
    backgroundColor: '#db2777',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6
  },
  saveButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },

  // ARAMA VE FİLTRELER
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fbcfe8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#831843',
    marginBottom: 12
  },
  filterContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  filterButton: {
    backgroundColor: '#fce7f3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbcfe8'
  },
  activeFilter: { backgroundColor: '#db2777', borderColor: '#db2777' },
  filterText: { color: '#9d174d', fontSize: 12, fontWeight: '600' },
  activeFilterText: { color: '#ffffff' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#831843' },
  sectionCount: { fontSize: 13, color: '#9d174d', fontWeight: '600' },

  // KART STİLLERİ
  ticketCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fbcfe8'
  },
  ticketCardActive: { borderColor: '#db2777', backgroundColor: '#fff1f2' },
  ticketTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketId: { color: '#9d174d', fontSize: 12, fontWeight: '600' },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  priorityText: { fontSize: 11, fontWeight: 'bold' },
  ticketTitle: { color: '#831843', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  ticketDetail: { color: '#9d174d', fontSize: 12, marginTop: 4 },
  
  detailBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff1f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbcfe8',
    gap: 4
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailKey: { fontSize: 12, fontWeight: '600', color: '#9d174d' },
  detailVal: { fontSize: 12, color: '#831843', flex: 1, textAlign: 'right' },
  hintText: { fontSize: 10, color: '#be185d', marginTop: 4, fontStyle: 'italic' },

  ticketBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  actionButton: {
    backgroundColor: '#fce7f3',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbcfe8'
  },
  actionText: { color: '#be185d', fontSize: 11, fontWeight: 'bold' },
  completedText: { fontSize: 11, color: '#16a34a', fontWeight: '600' },

  emptyContainer: { alignItems: 'center', padding: 25, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#fbcfe8' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#831843' },
  emptyText: { fontSize: 12, color: '#9d174d', marginTop: 4, textAlign: 'center' }
});