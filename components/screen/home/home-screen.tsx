import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, 
  FlatList, Dimensions, Animated, Pressable 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CardSchemaType } from '../add-card/card.schema';

const { width } = Dimensions.get('window');

const TRANSACTIONS = [
  { id: '1', title: 'Apple Store', category: 'Entertainment', amount: '- $5,99', icon: 'logo-apple' },
  { id: '2', title: 'Spotify', category: 'Music', amount: '- $12,99', icon: 'musical-notes' },
  { id: '3', title: 'Money Transfer', category: 'Transaction', amount: '$300', icon: 'swap-horizontal', isIncome: true },
  { id: '4', title: 'Grocery', category: 'Food', amount: '- $88', icon: 'cart' },
];

const FlipCard = ({ item }: { item: CardSchemaType }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <Pressable onPress={handleFlip} style={styles.cardWrapper}>
      <Animated.View style={[styles.cardContainer, { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity }]}>
        <Image source={require('@/assets/images/card-bg.png')} style={styles.cardBg} resizeMode="cover" />
        <View style={styles.cardOverlay}>
          
          <View style={styles.cardTopRow}>
            <MaterialCommunityIcons name="integrated-circuit-chip" size={30} color="#94A3B8" />
            <Ionicons name="wifi" size={24} color="#94A3B8" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>

          <View style={styles.cardNumberRow}>
            {item.cardNumber.match(/.{1,4}/g)?.map((group, index) => (
                <Text key={index} style={styles.cardNumText}>{group}</Text>
            ))}
          </View>

          <View style={styles.cardBottomRow}>
            <View style={{ gap: 10 }}>
              <View>
                <Text style={styles.cardLabel}>Card Holder</Text>
                <Text style={styles.cardValue}>{item.cardHolderName}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expiry Date</Text>
                <Text style={styles.cardValue}>{item.expiry}</Text>
              </View>
            </View>

            <View style={styles.mcLogos}>
               <View style={[styles.mcCircle, { backgroundColor: '#EB001B', marginRight: -12 }]} />
               <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', opacity: 0.9 }]} />
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.cardContainer, styles.cardBack, { transform: [{ rotateY: backInterpolate }], opacity: backOpacity }]}>
        <View style={styles.blackStripe} />
        <View style={styles.cvvContainer}>
          <Text style={styles.cvvLabel}>CVV</Text>
          <View style={styles.cvvBox}>
            <Text style={styles.cvvText}>{item.cvv || "000"}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const [cards, setCards] = useState<CardSchemaType[]>([]);
  const [userName, setUserName] = useState<string>("User");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          if (userData) setUserName(JSON.parse(userData).name);

          const cardData = await AsyncStorage.getItem("@user_card");
          if (cardData) {
            const parsed = JSON.parse(cardData);
            setCards(Array.isArray(parsed) ? parsed : [parsed]);
          }
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#0066FF" />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.mockAvatar} />
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userNameText}>{userName}</Text>
            </View>
          </View>
          <View style={styles.searchCircle}>
            <Ionicons name="search" size={20} color="white" />
          </View>
        </View>

        <FlatList
          data={cards}
          renderItem={({ item }) => <FlipCard item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - 40}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.cardsList}
        />

        <View style={styles.actionsRow}>
          {[
            { label: 'Send', icon: 'arrow-up' },
            { label: 'Receive', icon: 'arrow-down' },
            { label: 'Loan', icon: 'cash-outline' },
            { label: 'Topup', icon: 'add-circle-outline' }
          ].map((action, i) => (
            <View key={i} style={styles.actionItem}>
              <View style={styles.actionCircle}>
                <Ionicons name={action.icon as any} size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.transSection}>
          <View style={styles.transHeader}>
            <Text style={styles.transTitle}>Transaction</Text>
            <Text style={styles.seeAllText}>Sell All</Text>
          </View>

          {TRANSACTIONS.map((item) => (
            <View key={item.id} style={styles.transCard}>
              <View style={styles.transIconBox}>
                <Ionicons name={item.icon as any} size={22} color="white" />
              </View>
              <View style={styles.transInfo}>
                <Text style={styles.transName}>{item.title}</Text>
                <Text style={styles.transCat}>{item.category}</Text>
              </View>
              <Text style={[styles.transAmount, item.isIncome && styles.incomeAmount]}>
                {item.amount}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mockAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A1D29' },
  welcomeText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  userNameText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  searchCircle: { width: 45, height: 45, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  
  cardsList: { paddingHorizontal: 10 },
  cardWrapper: { width: width - 40, height: 240, marginHorizontal: 10 },
  cardContainer: { 
    width: '100%', height: '100%', borderRadius: 35, overflow: 'hidden', 
    backgroundColor: '#1E293B', position: 'absolute', backfaceVisibility: 'hidden' 
  },
  cardBg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 1 },
  cardOverlay: { flex: 1, padding: 30, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardNumText: { 
    color: 'white', 
    fontSize: 31, 
    fontWeight: '200',
    fontFamily: 'Courier',
  },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 2 },
  cardValue: { color: 'white', fontSize: 18, fontWeight: '400' },
  mcLogos: { flexDirection: 'row', marginBottom: 5 },
  mcCircle: { width: 25, height: 25, borderRadius: 16 },

  cardBack: { backgroundColor: '#1A1D29', justifyContent: 'center', alignItems: 'center' },
  blackStripe: { width: '100%', height: 50, backgroundColor: '#000', position: 'absolute', top: 40 },
  cvvContainer: { marginTop: 40, alignItems: 'center' },
  cvvLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 },
  cvvBox: { backgroundColor: 'white', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 8 },
  cvvText: { color: 'black', fontSize: 20, fontWeight: 'bold', letterSpacing: 4 },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 30 },
  actionItem: { alignItems: 'center', gap: 10 },
  actionCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  actionLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },

  transSection: { paddingHorizontal: 25, marginTop: 40 },
  transHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  transTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  seeAllText: { color: '#0066FF', fontSize: 15 },
  transCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  transIconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A1D29', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  transInfo: { flex: 1 },
  transName: { color: 'white', fontSize: 17, fontWeight: '600', marginBottom: 4 },
  transCat: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  transAmount: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  incomeAmount: { color: '#0066FF' }
});