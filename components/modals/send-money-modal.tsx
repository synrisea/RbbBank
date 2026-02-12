import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Pressable, TextInput, 
  ScrollView, Dimensions, LayoutAnimation, Platform, 
  Modal, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlipCard } from '@/components/ui/flip-card';
import { CardType } from '@/types/card';
import { useAppSettings } from '@/hooks/use-app-settings';
import { translations } from '@/constants/translations';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DEFAULT_USERS = [
  { id: '1', name: 'Yamilet', initials: 'Y' },
  { id: '2', name: 'Alexa', initials: 'A' },
  { id: '3', name: 'Yakub', initials: 'Y' },
  { id: '4', name: 'Krishna', initials: 'K' },
];

export default function SendMoneyModal({ cards, onClose, onConfirm }: { 
  cards: CardType[], 
  onClose: () => void,
  onConfirm: (amount: number, cardId: string, recipient: string) => void 
}) {
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [selectedUserId, setSelectedUserId] = useState(DEFAULT_USERS[0].id);
  const [amount, setAmount] = useState('0');
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isSeeAllVisible, setSeeAllVisible] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const stored = await AsyncStorage.getItem('@recent_recipients');
        if (stored) setUsers(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load users", e);
      }
    };
    loadUsers();
  }, []);

  const saveUsers = async (updatedUsers: typeof users) => {
    await AsyncStorage.setItem('@recent_recipients', JSON.stringify(updatedUsers));
  };

  const handleAddNewRecipient = () => {
    if (newCardNumber.length === 19) {
      const lastFour = newCardNumber.slice(-4);
      const newUser = {
        id: Math.random().toString(),
        name: `Card **${lastFour}`,
        initials: '*', 
      };
      const updatedUsers = [newUser, ...users];
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      setSelectedUserId(newUser.id);
      setNewCardNumber('');
      setAddModalVisible(false);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  const deleteRecipient = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveUsers(updated);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const currentCard = cards[selectedIdx] || cards[0];
  const currentBalance = currentCard?.balance || 0;
  const numericAmount = parseFloat(amount) || 0;
  const isInvalidAmount = numericAmount > currentBalance || numericAmount <= 0 || amount === '';

  // Use global settings for translations
  const { language, theme } = useAppSettings();
  const t = translations[language];
  const isDarkMode = theme === 'dark';

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, !isDarkMode && styles.containerLight]}>
          
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={20}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </Pressable>
            <Text style={styles.headerTitle}>Send Money</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            <FlatList
              data={cards}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 40}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
              renderItem={({ item, index }) => (
                <Pressable 
                  onPress={() => setSelectedIdx(index)} 
                  style={{ 
                    opacity: selectedIdx === index ? 1 : 0.4, 
                    marginRight: 15,
                    transform: [{ scale: selectedIdx === index ? 1 : 0.92 }] 
                  }}
                >
                  <FlipCard item={item} disabled={true} />
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
            />

            <View style={[styles.balanceContainer, !isDarkMode && styles.cardLight]}>
                <Text style={styles.balanceLabel}>{t.availableBalance}</Text>
                <Text style={styles.balanceValue}>${currentBalance.toLocaleString()}</Text>
            </View>

            <View style={styles.content}>
              
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Recent Recipients</Text>
                <Pressable onPress={() => setSeeAllVisible(true)}>
                    <Text style={styles.seeAllBtn}>See All</Text>
                </Pressable>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userList}>
                <Pressable style={styles.addUser} onPress={() => setAddModalVisible(true)}>
                  <Ionicons name="add" size={30} color="white" />
                </Pressable>
                {users.slice(0, 5).map(user => (
                  <Pressable 
                    key={user.id} 
                    style={styles.userCircleContainer} 
                    onPress={() => setSelectedUserId(user.id)}
                  >
                    <View style={[
                      styles.initialsOuter, 
                      selectedUserId === user.id && styles.selectedUserCircle
                    ]}>
                      <Text style={styles.initials}>{user.initials}</Text>
                    </View>
                    <Text style={[styles.userName, selectedUserId === user.id && styles.userNameActive]} numberOfLines={1}>
                      {user.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Enter Your Amount</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput 
                    style={styles.input} 
                    keyboardType="numeric" 
                    value={amount} 
                    onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd(), 200)}
                    onChangeText={(val) => setAmount(val.replace(/[^0-9.]/g, ''))}
                  />
                </View>
                {numericAmount > currentBalance && <Text style={styles.errorText}>Insufficient funds</Text>}
              </View>

              <Pressable 
                style={[styles.sendBtn, isInvalidAmount && styles.sendBtnDisabled]} 
                onPress={() => onConfirm(numericAmount, currentCard.id, users.find(u => u.id === selectedUserId)?.name || "")}
                disabled={isInvalidAmount}
              >
                <Text style={styles.sendBtnText}>Confirm and Send</Text>
              </Pressable>
            </View>
          </ScrollView>

          <Modal visible={isSeeAllVisible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { padding: 20 }]}>
              <View style={styles.modalHeaderClose}>
                <Text style={styles.modalTitleLarge}>All Contacts</Text>
                <Pressable onPress={() => setSeeAllVisible(false)}><Ionicons name="close" size={28} color="white" /></Pressable>
              </View>
              <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.recipientRow}>
                    <View style={styles.recipientInfo}>
                      <View style={styles.smallInitials}><Text style={{color:'white'}}>{item.initials}</Text></View>
                      <Text style={styles.recipientName}>{item.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', gap: 20}}>
                        <Pressable onPress={() => { setSelectedUserId(item.id); setSeeAllVisible(false); }}>
                            <Ionicons name="send" size={20} color="#0066FF" />
                        </Pressable>
                        <Pressable onPress={() => deleteRecipient(item.id)}>
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </Pressable>
                    </View>
                  </View>
                )}
              />
            </View>
          </Modal>

          <Modal visible={isAddModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView behavior="padding">
                <View style={styles.modalContentSmall}>
                  <View style={styles.modalHeaderClose}>
                    <Text style={styles.modalTitleSmall}>New Recipient</Text>
                    <Pressable onPress={() => setAddModalVisible(false)}><Ionicons name="close" size={24} color="white" /></Pressable>
                  </View>
                  <TextInput 
                    style={styles.modalInput} 
                    placeholder="0000 0000 0000 0000" 
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                    value={newCardNumber}
                    onChangeText={(t) => setNewCardNumber(formatCardNumber(t))}
                  />
                  <Pressable 
                    style={[styles.modalBtn, newCardNumber.length < 19 && { opacity: 0.5 }]} 
                    onPress={handleAddNewRecipient}
                  >
                    <Text style={styles.sendBtnText}>Save Contact</Text>
                  </Pressable>
                </View>
              </KeyboardAvoidingView>
            </View>
          </Modal>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  containerLight: { backgroundColor: '#F8FAFC' },
  cardLight: { backgroundColor: 'white', borderColor: '#E2E8F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: Platform.OS === 'android' ? 25 : 0 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  content: { paddingHorizontal: 20 },
  
  // Баланс
  balanceContainer: { alignItems: 'center', marginVertical: 20, backgroundColor: '#1A1D29', marginHorizontal: 20, padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#334155' },
  balanceLabel: { color: '#94A3B8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 },
  balanceValue: { color: '#10B981', fontSize: 34, fontWeight: '900' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  label: { color: 'white', fontSize: 16, fontWeight: '600' },
  seeAllBtn: { color: '#0066FF', fontWeight: 'bold' },
  
  userList: { flexDirection: 'row', marginBottom: 30 },
  userCircleContainer: { alignItems: 'center', marginRight: 15, width: 70 },
  initialsOuter: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  selectedUserCircle: { borderColor: '#0066FF' },
  initials: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1E293B', textAlign: 'center', lineHeight: 52, color: 'white', fontSize: 18 },
  userName: { color: '#94A3B8', fontSize: 11, marginTop: 8, textAlign: 'center' },
  userNameActive: { color: 'white', fontWeight: 'bold' },
  addUser: { width: 60, height: 60, borderRadius: 30, borderStyle: 'dashed', borderWidth: 1, borderColor: '#475569', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  
  amountBox: { backgroundColor: '#1A1D29', padding: 25, borderRadius: 24, marginBottom: 30, borderWidth: 1, borderColor: '#334155' },
  amountLabel: { color: '#94A3B8', fontSize: 14, marginBottom: 10, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  currencySymbol: { color: '#0066FF', fontSize: 32, fontWeight: 'bold', marginRight: 10 },
  input: { color: 'white', fontSize: 42, fontWeight: 'bold' },
  errorText: { color: '#EF4444', fontSize: 12, textAlign: 'center', marginTop: 10 },
  
  sendBtn: { backgroundColor: '#0066FF', height: 64, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#1E293B', opacity: 0.5 },
  sendBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // Модалки
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContentSmall: { backgroundColor: '#1E293B', padding: 25, borderRadius: 30 },
  modalHeaderClose: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitleLarge: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  modalTitleSmall: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalInput: { backgroundColor: '#0F121E', color: 'white', padding: 18, borderRadius: 15, fontSize: 18, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  modalBtn: { backgroundColor: '#0066FF', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  recipientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1D29', padding: 15, borderRadius: 20, marginBottom: 12 },
  recipientInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  smallInitials: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  recipientName: { color: 'white', fontSize: 16, fontWeight: '500' }
});