import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoanModal({ onBack, onConfirm }: { onBack: () => void, onConfirm: (amount: number) => void }) {
  const [amount, setAmount] = useState('1000');
  const [term, setTerm] = useState(12);

  // Variable interest rates based on loan term
  const getInterestRate = (months: number) => {
    switch (months) {
      case 6: return 0.03;  // 3% for 6 months
      case 12: return 0.05; // 5% for 12 months
      case 24: return 0.08; // 8% for 24 months
      case 36: return 0.12; // 12% for 36 months
      default: return 0.05;
    }
  };

  const interestRate = getInterestRate(term);
  const monthlyPayment = (parseFloat(amount) * (1 + interestRate)) / term;

  const handleApply = () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) return;

    Alert.alert(
      "Loan Application",
      `Are you sure you want to apply for a loan of $${numericAmount.toLocaleString()} for ${term} months?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Apply", onPress: () => onConfirm(numericAmount) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={20}>
          <Ionicons name="close-outline" size={32} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Apply for Loan</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Maximum Limit</Text>
          <Text style={styles.infoValue}>$50,000.00</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Loan Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#475569"
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Loan Term (Months)</Text>
          <View style={styles.termContainer}>
            {[6, 12, 24, 36].map((m) => (
              <Pressable
                key={m}
                style={[styles.termBtn, term === m && styles.termBtnActive]}
                onPress={() => setTerm(m)}
              >
                <Text style={[styles.termText, term === m && styles.termTextActive]}>{m}m</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Interest Rate</Text>
            <Text style={styles.summaryValue}>{(interestRate * 100).toFixed(1)}%</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monthly Payment</Text>
            <Text style={styles.summaryValue}>${monthlyPayment.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Repayment</Text>
            <Text style={styles.totalValue}>${(parseFloat(amount) * (1 + interestRate)).toFixed(2)}</Text>
          </View>
        </View>

        <Pressable style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 25 },
  infoCard: { backgroundColor: '#0066FF20', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#0066FF40', marginBottom: 30 },
  infoLabel: { color: '#0066FF', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', marginBottom: 5 },
  infoValue: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  inputSection: { marginBottom: 30 },
  label: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginBottom: 15, textTransform: 'uppercase' },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#334155', paddingBottom: 10 },
  currency: { color: 'white', fontSize: 32, fontWeight: 'bold', marginRight: 10 },
  input: { color: 'white', fontSize: 32, fontWeight: 'bold', flex: 1 },
  termContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  termBtn: { width: '22%', backgroundColor: '#1A1D29', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  termBtnActive: { backgroundColor: '#0066FF', borderColor: '#0066FF' },
  termText: { color: '#94A3B8', fontWeight: 'bold' },
  termTextActive: { color: 'white' },
  summaryCard: { backgroundColor: '#1A1D29', padding: 20, borderRadius: 24, marginBottom: 40 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  summaryLabel: { color: '#94A3B8', fontSize: 14 },
  summaryValue: { color: 'white', fontSize: 14, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 15, marginTop: 5 },
  totalLabel: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: '#0066FF', fontSize: 18, fontWeight: 'bold' },
  applyBtn: { backgroundColor: '#0066FF', height: 64, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  applyBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
