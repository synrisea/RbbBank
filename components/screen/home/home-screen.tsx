import LoanModal from '@/components/modals/loan-modal';
import ReceiveMoneyModal from '@/components/modals/receive-money-modal';
import SendMoneyModal from '@/components/modals/send-money-modal';
import TopUpScreen from '@/components/screen/topup/topup-screen';
import { FlipCard } from '@/components/ui/flip-card';
import { translations } from '@/constants/translations';
import { useAppSettings } from '@/hooks/use-app-settings';
import { CardType } from '@/types/card';
import { TransactionType } from '@/types/transaction';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions, FlatList,
    Image,
    Modal, Pressable,
    ScrollView, StyleSheet, Text, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const { language, theme, userAvatar } = useAppSettings();
    const t = translations[language];
    const isDarkMode = theme === 'dark';

    const [cards, setCards] = useState<CardType[]>([]);
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [userName, setUserName] = useState<string>("User");
    const [loading, setLoading] = useState(true);

    const [isSendModalVisible, setSendModalVisible] = useState(false);
    const [isTopupModalVisible, setTopupModalVisible] = useState(false);
    const [isReceiveModalVisible, setReceiveModalVisible] = useState(false);
    const [isLoanModalVisible, setLoanModalVisible] = useState(false);
    const [isAllTransactionsVisible, setAllTransactionsVisible] = useState(false);

    const loadData = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            if (userData) setUserName(JSON.parse(userData).name);

            const cardData = await AsyncStorage.getItem("@user_card");
            if (cardData) {
                const parsed = JSON.parse(cardData);
                setCards(Array.isArray(parsed) ? parsed : [parsed]);
            }

            const transData = await AsyncStorage.getItem("@transactions");
            if (transData) setTransactions(JSON.parse(transData));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(React.useCallback(() => { loadData(); }, []));

    // Check if user has no cards and redirect to add card
    React.useEffect(() => {
        if (!loading && cards.length === 0) {
            router.push('/(tabs)/my-cards');
        }
    }, [loading, cards.length]);

    const clearHistory = async () => {
        await AsyncStorage.removeItem('@transactions');
        setTransactions([]);
    };

    const handleTopup = async (amount: number, cardId: string) => {
        const cardIndex = cards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;
        const updatedCards = [...cards];
        updatedCards[cardIndex].balance += amount;

        const newTrans: TransactionType = {
            id: Math.random().toString(36).substring(7),
            cardId: cardId,
            title: 'Top Up Wallet',
            category: 'Deposit',
            amount: `+ $${amount.toFixed(2)}`,
            icon: 'add-circle',
            date: new Date().toLocaleDateString(),
            isIncome: true
        };

        const updatedTransactions = [newTrans, ...transactions];
        await AsyncStorage.setItem('@user_card', JSON.stringify(updatedCards));
        await AsyncStorage.setItem('@transactions', JSON.stringify(updatedTransactions));
        setCards(updatedCards);
        setTransactions(updatedTransactions);
        setTopupModalVisible(false);
    };

    const handleTransaction = async (amount: number, cardId: string, recipient: string) => {
        const cardIndex = cards.findIndex(c => c.id === cardId);
        if (cardIndex === -1 || cards[cardIndex].balance < amount) {
            alert("Insufficient funds!"); return;
        }

        const updatedCards = [...cards];
        updatedCards[cardIndex].balance -= amount;

        const newTrans: TransactionType = {
            id: Math.random().toString(36).substring(7),
            cardId: cardId,
            title: recipient,
            category: 'Transfer',
            amount: `- $${amount.toFixed(2)}`,
            icon: 'swap-horizontal',
            date: new Date().toLocaleDateString(),
            isIncome: false
        };

        const updatedTransactions = [newTrans, ...transactions];
        await AsyncStorage.setItem('@user_card', JSON.stringify(updatedCards));
        await AsyncStorage.setItem('@transactions', JSON.stringify(updatedTransactions));
        setCards(updatedCards);
        setTransactions(updatedTransactions);
        setSendModalVisible(false);
    };

    const handleLoan = async (amount: number) => {
        if (cards.length === 0) return;
        const updatedCards = [...cards];
        updatedCards[0].balance += amount;

        const newTrans: TransactionType = {
            id: Math.random().toString(36).substring(7),
            cardId: cards[0].id,
            title: 'Bank Loan',
            category: 'Loan',
            amount: `+ $${amount.toFixed(2)}`,
            icon: 'cash-outline',
            date: new Date().toLocaleDateString(),
            isIncome: true
        };

        const updatedTransactions = [newTrans, ...transactions];
        await AsyncStorage.setItem('@user_card', JSON.stringify(updatedCards));
        await AsyncStorage.setItem('@transactions', JSON.stringify(updatedTransactions));
        setCards(updatedCards);
        setTransactions(updatedTransactions);
        setLoanModalVisible(false);
        alert("Loan approved and credited to your card!");
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#0066FF" />;

    return (
        <SafeAreaView style={[styles.container, !isDarkMode && styles.containerLight]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        {userAvatar ? (
                            <Image source={{ uri: userAvatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.mockAvatar}>
                                <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
                            </View>
                        )}
                        <View>
                            <Text style={[styles.welcomeText, !isDarkMode && styles.textLightSecondary]}>{t.welcome}</Text>
                            <Text style={[styles.userNameText, !isDarkMode && styles.textLight]}>{userName}</Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    data={cards}
                    renderItem={({ item }) => <FlipCard item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={width - 20}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    contentContainerStyle={styles.cardsList}
                    keyExtractor={(item) => item.id}
                />

                <View style={styles.actionsRow}>
                    {[
                        { label: t.send, icon: 'arrow-up', action: () => setSendModalVisible(true) },
                        { label: t.receive, icon: 'arrow-down', action: () => setReceiveModalVisible(true) },
                        { label: t.loan, icon: 'cash-outline', action: () => setLoanModalVisible(true) },
                        { label: t.topup, icon: 'add-circle-outline', action: () => setTopupModalVisible(true) }
                    ].map((item, i) => (
                        <Pressable key={i} style={styles.actionItem} onPress={item.action}>
                            <View style={[styles.actionCircle, !isDarkMode && styles.actionCircleLight]}><Ionicons name={item.icon as any} size={24} color={isDarkMode ? "white" : "#0066FF"} /></View>
                            <Text style={[styles.actionLabel, !isDarkMode && styles.textLightSecondary]}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.transSection}>
                    <View style={styles.transHeader}>
                        <Text style={[styles.transTitle, !isDarkMode && styles.textLight]}>{t.transaction}</Text>
                        <Pressable onPress={() => setAllTransactionsVisible(true)}>
                            <Text style={styles.seeAllText}>{t.seeAll}</Text>
                        </Pressable>
                    </View>

                    {transactions.length === 0 ? (
                        <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>{t.noTransactions}</Text>
                    ) : (
                        transactions.slice(0, 4).map((item) => (
                            <TransactionItem key={item.id} item={item} isDarkMode={isDarkMode} />
                        ))
                    )}
                </View>
            </ScrollView>

            <Modal visible={isAllTransactionsVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={[styles.modalContainer, !isDarkMode && styles.containerLight]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, !isDarkMode && styles.textLight]}>{t.history}</Text>
                        <Pressable onPress={() => setAllTransactionsVisible(false)}>
                            <Ionicons name="close-circle" size={32} color={isDarkMode ? "white" : "#1E293B"} opacity={0.5} />
                        </Pressable>
                    </View>

                    <FlatList
                        data={transactions}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                        renderItem={({ item }) => <TransactionItem item={item} isDarkMode={isDarkMode} />}
                        ListEmptyComponent={<Text style={styles.emptyText}>{t.noTransactions}</Text>}
                    />

                    {transactions.length > 0 && (
                        <Pressable style={styles.clearBtn} onPress={clearHistory}>
                            <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>{t.clearHistory}</Text>
                        </Pressable>
                    )}
                </View>
            </Modal>

            <Modal visible={isSendModalVisible} animationType="slide" presentationStyle="pageSheet">
                <SendMoneyModal cards={cards} onClose={() => setSendModalVisible(false)} onConfirm={handleTransaction} />
            </Modal>

            <Modal visible={isTopupModalVisible} animationType="slide" presentationStyle="pageSheet">
                <TopUpScreen cards={cards} onBack={() => setTopupModalVisible(false)} onConfirm={handleTopup} />
            </Modal>

            <Modal visible={isReceiveModalVisible} animationType="slide" presentationStyle="pageSheet">
                <ReceiveMoneyModal cards={cards} onClose={() => setReceiveModalVisible(false)} />
            </Modal>

            <Modal visible={isLoanModalVisible} animationType="slide" presentationStyle="pageSheet">
                <LoanModal onBack={() => setLoanModalVisible(false)} onConfirm={handleLoan} />
            </Modal>
        </SafeAreaView>
    );
}

const TransactionItem = ({ item, isDarkMode }: { item: TransactionType, isDarkMode: boolean }) => {
    const router = useRouter();
    return (
        <Pressable
            style={[styles.transCard, !isDarkMode && styles.cardLight]}
            onPress={() => router.push({
                pathname: "/transaction-details/page",
                params: {
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    amount: item.amount,
                    date: item.date,
                    isIncome: item.isIncome.toString(),
                    icon: item.icon
                }
            })}
        >
            <View style={[styles.transIconBox, !isDarkMode && styles.transIconBoxLight]}>
                <Ionicons name={item.icon as any} size={22} color={item.isIncome ? "#10B981" : (isDarkMode ? "white" : "#1E293B")} />
            </View>
            <View style={styles.transInfo}>
                <Text style={[styles.transName, !isDarkMode && styles.textLight]}>{item.title}</Text>
                <Text style={[styles.transCat, !isDarkMode && styles.textLightSecondary]}>{item.category} • {item.date}</Text>
            </View>
            <Text style={[styles.transAmount, item.isIncome && styles.incomeAmount, !isDarkMode && !item.isIncome && styles.textLight]}>
                {item.amount}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F121E' },
    containerLight: { backgroundColor: '#F8FAFC' },
    textLight: { color: '#1E293B' },
    textLightSecondary: { color: 'rgba(30, 41, 59, 0.6)' },
    scrollContent: { paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
    userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    mockAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0066FF', justifyContent: 'center', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    avatarInitial: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    welcomeText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
    userNameText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    searchCircle: { width: 45, height: 45, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    searchCircleLight: { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
    cardsList: { paddingHorizontal: 10, paddingVertical: 10 },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 30 },
    actionItem: { alignItems: 'center', gap: 10 },
    actionCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1A1D29', justifyContent: 'center', alignItems: 'center' },
    actionCircleLight: { backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    actionLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
    transSection: { paddingHorizontal: 25, marginTop: 40 },
    transHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    transTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    seeAllText: { color: '#0066FF', fontSize: 15, fontWeight: '600' },
    transCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#1A1D29', padding: 12, borderRadius: 18 },
    cardLight: { backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    transIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0F121E', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    transIconBoxLight: { backgroundColor: '#F1F5F9' },
    transInfo: { flex: 1 },
    transName: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 2 },
    transCat: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
    transAmount: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    incomeAmount: { color: '#10B981' },
    modalContainer: { flex: 1, backgroundColor: '#0F121E' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
    modalTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    emptyText: { color: 'gray', textAlign: 'center', marginTop: 50, fontSize: 16 },
    clearBtn: { alignSelf: 'center', marginBottom: 30, padding: 10 }
});
