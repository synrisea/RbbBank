import { FlipCard } from '@/components/ui/flip-card';
import { translations } from '@/constants/translations';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AddCardScreen from './add-card/add-card-screen';
import { CardSchemaType } from './add-card/card.schema';

export default function MyCardsScreenContent() {
  const { theme, language } = useAppSettings();
  const isDarkMode = theme === 'dark';
  const t = translations[language];
  const [isAddCardModalVisible, setAddCardModalVisible] = useState(false);
  const [cards, setCards] = useState<CardSchemaType[]>([]);
  const router = useRouter();

  const loadCards = async () => {
    const data = await AsyncStorage.getItem('@user_card');
    if (data) {
      const parsed = JSON.parse(data);
      setCards(Array.isArray(parsed) ? parsed : [parsed]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCards();
    }, [])
  );

  // Auto-open add card modal if user has no cards
  React.useEffect(() => {
    if (cards.length === 0) {
      setAddCardModalVisible(true);
    }
  }, [cards.length]);

  const handleModalClose = () => {
    setAddCardModalVisible(false);
    loadCards();
  };

  const deleteCard = (index: number) => {
    Alert.alert("Delete Card", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const newCards = cards.filter((_, i) => i !== index);
          setCards(newCards);
          await AsyncStorage.setItem('@user_card', JSON.stringify(newCards));
        }
      }
    ]);
  };

  return (
    <View style={[styles.container, !isDarkMode && styles.containerLight]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, !isDarkMode && styles.backBtnLight]}>
          <Ionicons name="chevron-back" size={24} color={isDarkMode ? "white" : "#1E293B"} />
        </Pressable>
        <Text style={[styles.headerTitle, !isDarkMode && styles.textLight]}>{t.cards}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={cards}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.cardItemWrapper}>
            <FlipCard item={item} />
            <Pressable style={styles.deleteBtn} onPress={() => deleteCard(index)}>
              <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
              <Text style={styles.deleteText}>{t.cards} - Remove</Text>
            </Pressable>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.statsSection}>
            <Pressable style={styles.addCardBtn} onPress={() => setAddCardModalVisible(true)}>
              <Text style={styles.addCardText}>Add Card +</Text>
            </Pressable>
          </View>
        )}
      />
      <Modal
        visible={isAddCardModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleModalClose}
      >
        <AddCardScreen onClose={() => handleModalClose()} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E', padding: 10 },
  containerLight: { backgroundColor: '#F8FAFC' },
  textLight: { color: '#1E293B' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  backBtnLight: { backgroundColor: 'rgba(0,0,0,0.05)' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  cardItemWrapper: { marginBottom: 30, alignItems: 'center' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginRight: 10, alignSelf: 'flex-end' },
  deleteText: { color: '#FF4D4D', marginLeft: 5 },
  statsSection: { marginTop: 20 },
  addCardBtn: { backgroundColor: '#0066FF', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  addCardText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});