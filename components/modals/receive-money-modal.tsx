import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlipCard } from '@/components/ui/flip-card';
import { CardType } from '@/types/card';

const { width } = Dimensions.get('window');

export default function ReceiveMoneyModal({ cards, onClose }: { cards: CardType[], onClose: () => void }) {
  const currentCard = cards[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My RBB Bank Card Number: ${currentCard.cardNumber}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={20}>
          <Ionicons name="close-outline" size={32} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Receive Money</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Share your card details or QR code to receive money from others.
        </Text>

        <View style={styles.cardContainer}>
          <FlipCard item={currentCard} disabled={true} />
        </View>

        <View style={styles.qrPlaceholder}>
          <Ionicons name="qr-code-outline" size={180} color="white" />
          <Text style={styles.qrText}>Scan to pay</Text>
        </View>

        <Pressable style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="white" />
          <Text style={styles.shareBtnText}>Share Card Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 25, alignItems: 'center' },
  description: { color: '#94A3B8', textAlign: 'center', fontSize: 15, marginBottom: 30, lineHeight: 22 },
  cardContainer: { width: width - 50, marginBottom: 40 },
  qrPlaceholder: { backgroundColor: '#1A1D29', padding: 30, borderRadius: 30, alignItems: 'center', marginBottom: 40, borderWidth: 1, borderColor: '#334155' },
  qrText: { color: '#94A3B8', marginTop: 15, fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
  shareBtn: { backgroundColor: '#0066FF', flexDirection: 'row', width: '100%', height: 64, borderRadius: 24, justifyContent: 'center', alignItems: 'center', gap: 12 },
  shareBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
