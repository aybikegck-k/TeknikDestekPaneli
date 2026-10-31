import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#fce7f3' }, headerTintColor: '#831843' }}>
      <Stack.Screen name="index" options={{ title: 'Teknik Destek Paneli' }} />
      <Stack.Screen name="ariza/[id]" options={{ title: 'Arıza Detayı' }} />
    </Stack>
  );
}