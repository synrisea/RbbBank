import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Pressable, TextInput, 
  ScrollView, Dimensions, LayoutAnimation, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlipCard } from '@/components/ui/flip-card';
import { CardType } from '@/types/card';

const { width } = Dimensions.get('window');

const PRESETS = ['10', '20', '50', '100', '250', '500'];

const PAYMENT_METHODS = [
    { id: '1', name: 'Apple Pay', icon: 'logo-apple', color: '#000000' },
    { id: '2', name: 'Mastercard **** 4242', icon: 'card-outline', color: '#EB001B' },
    { id: '3', name: 'Bank Account', icon: 'business-outline', color: '#10B981' },
];

export default function TopUpScreen({ cards, onBack, onConfirm }: { 
  cards: CardType[], 
  onBack: () => void,
  onConfirm: (amount: number, cardId: string) => void 
}) {
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [amount, setAmount] = useState('0');
  const [selectedMethod, setSelectedMethod] = useState('1');

  const handlePresetPress = (val: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAmount(val);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={20}>
          <Ionicons name="close-outline" size={32} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Top Up Balance</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Куда зачисляем */}
        <Text style={styles.sectionLabel}>Select Destination Card</Text>
        <FlatList
          data={cards}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - 40}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item, index }) => (
            <View style={{ width: width - 60, marginRight: 60, opacity: selectedCardIdx === index ? 1 : 0.5 }}>
              <FlipCard item={item} disabled={true} />
            </View>
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
            setSelectedCardIdx(index);
          }}
        />

        <View style={styles.content}>
          {/* Ввод суммы */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor="#475569"
            />
          </View>

          {/* Пресеты сумм */}
          <View style={styles.presetsGrid}>
            {PRESETS.map((val) => (
              <Pressable 
                key={val} 
                style={[styles.presetBtn, amount === val && styles.presetBtnActive]}
                onPress={() => handlePresetPress(val)}
              >
                <Text style={[styles.presetText, amount === val && styles.presetTextActive]}>
                  +${val}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Метод оплаты */}
          <Text style={styles.sectionLabel}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <Pressable 
              key={method.id} 
              style={[styles.methodItem, selectedMethod === method.id && styles.methodItemActive]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={[styles.iconBox, { backgroundColor: method.color + '20' }]}>
                <Ionicons name={method.icon as any} size={24} color={method.color} />
              </View>
              <Text style={styles.methodName}>{method.name}</Text>
              <View style={styles.radio}>
                {selectedMethod === method.id && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          ))}

          <Pressable 
            style={[styles.topUpBtn, parseFloat(amount) <= 0 && styles.disabledBtn]}
            onPress={() => onConfirm(parseFloat(amount), cards[selectedCardIdx].id)}
            disabled={parseFloat(amount) <= 0}
          >
            <Text style={styles.topUpBtnText}>Top Up Now</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  sectionLabel: { color: '#94A3B8', fontSize: 14, marginHorizontal: 20, marginTop: 30, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  content: { padding: 20 },
  amountContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  currencySymbol: { color: '#0066FF', fontSize: 40, fontWeight: 'bold', marginRight: 10 },
  amountInput: { color: 'white', fontSize: 60, fontWeight: 'bold', minWidth: 100, textAlign: 'center' },
  presetsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
  presetBtn: { width: '31%', backgroundColor: '#1A1D29', paddingVertical: 15, borderRadius: 16, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  presetBtnActive: { borderColor: '#0066FF', backgroundColor: '#0066FF20' },
  presetText: { color: 'white', fontSize: 16, fontWeight: '600' },
  presetTextActive: { color: '#0066FF' },
  methodItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1D29', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
  methodItemActive: { borderColor: '#334155', backgroundColor: '#1E293B' },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  methodName: { color: 'white', fontSize: 16, flex: 1, fontWeight: '500' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#475569', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0066FF' },
  topUpBtn: { backgroundColor: '#0066FF', height: 64, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  disabledBtn: { opacity: 0.5, backgroundColor: '#1E293B' },
  topUpBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});