import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ durum }) {
  const getStyle = () => {
    switch (durum) {
      case 'Bekliyor': return { bg: '#ffedd5', color: '#c2410c' }; // Turuncu
      case 'İşlemde': return { bg: '#dbeafe', color: '#1d4ed8' };  // Mavi
      case 'Çözüldü': return { bg: '#dcfce7', color: '#15803d' };  // Yeşil
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const currentStyle = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: currentStyle.bg }]}>
      <Text style={[styles.text, { color: currentStyle.color }]}>{durum}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: 'bold' }
});