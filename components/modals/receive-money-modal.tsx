import { FlipCard } from '@/components/ui/flip-card';
import { translations } from '@/constants/translations';
import { useAppSettings } from '@/hooks/use-app-settings';
import { CardType } from '@/types/card';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ReceiveMoneyModal({ cards, onClose }: { cards: CardType[], onClose: () => void }) {
  const currentCard = cards[0];
  const { theme, language } = useAppSettings();
  const isDarkMode = theme === 'dark';
  const t = translations[language];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My RBB Bank Card Number: ${currentCard?.cardNumber || 'N/A'}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, !isDarkMode && styles.containerLight]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={20}>
          <Ionicons name="close-outline" size={32} color={isDarkMode ? "white" : "#1E293B"} />
        </Pressable>
        <Text style={[styles.headerTitle, !isDarkMode && styles.textLight]}>{t.receive}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Share your card details or QR code to receive money from others.
        </Text>

        <View style={styles.cardContainer}>
          {currentCard ? <FlipCard item={currentCard} disabled={true} /> : null}
        </View>

        <View style={[styles.qrPlaceholder, !isDarkMode && styles.qrPlaceholderLight]}>
          <Ionicons name="qr-code-outline" size={180} color={isDarkMode ? "white" : "#1E293B"} />
          <Text style={styles.qrText}>{t.scanToPay}</Text>
        </View>

        <Pressable style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="white" />
          <Text style={styles.shareBtnText}>{t.shareCard}</Text>
        </Pressable>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  containerLight: { backgroundColor: '#F8FAFC' },
  textLight: { color: '#1E293B' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { paddingHorizontal: 25, alignItems: 'center', paddingTop: 10, paddingBottom: 40 },
  description: { color: '#94A3B8', textAlign: 'center', fontSize: 15, marginBottom: 30, lineHeight: 22 },
  cardContainer: { width: width - 50, marginBottom: 40, alignItems: 'center' },
  qrPlaceholder: { backgroundColor: '#1A1D29', padding: 30, borderRadius: 30, alignItems: 'center', marginBottom: 40, borderWidth: 1, borderColor: '#334155' },
  qrPlaceholderLight: { backgroundColor: 'white', borderColor: '#E2E8F0' },
  qrText: { color: '#94A3B8', marginTop: 15, fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
  shareBtn: { backgroundColor: '#0066FF', flexDirection: 'row', width: '100%', height: 64, borderRadius: 24, justifyContent: 'center', alignItems: 'center', gap: 12 },
  shareBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
