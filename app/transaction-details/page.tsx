import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // In a real app, we would fetch the full transaction details using the ID
  // For now, we'll use the params passed from the home screen
  const { title, category, amount, date, isIncome, icon } = params;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.amountContainer}>
          <View style={[styles.iconBox, { backgroundColor: isIncome === 'true' ? '#10B98120' : '#EF444420' }]}>
            <Ionicons name={icon as any || 'swap-horizontal'} size={40} color={isIncome === 'true' ? '#10B981' : '#EF4444'} />
          </View>
          <Text style={[styles.amountText, isIncome === 'true' ? styles.incomeText : styles.expenseText]}>
            {amount}
          </Text>
          <Text style={styles.statusText}>Success</Text>
        </View>

        <View style={styles.detailsCard}>
          <DetailItem label="Recipient/Sender" value={title as string} />
          <DetailItem label="Category" value={category as string} />
          <DetailItem label="Date" value={date as string} />
          <DetailItem label="Transaction ID" value={`TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`} />
          <DetailItem label="Status" value="Completed" valueColor="#10B981" />
        </View>

        <Pressable style={styles.downloadBtn}>
          <Ionicons name="download-outline" size={20} color="white" />
          <Text style={styles.downloadBtnText}>Download Receipt</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailItem = ({ label, value, valueColor = 'white' }: { label: string, value: string, valueColor?: string }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, { color: valueColor }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F121E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  content: {
    padding: 25,
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  amountText: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: 'white',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#1A1D29',
    borderRadius: 24,
    padding: 20,
    gap: 20,
    marginBottom: 40,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  downloadBtn: {
    flexDirection: 'row',
    backgroundColor: '#0066FF',
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  downloadBtnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});
