import { translations } from '@/constants/translations';
import { useAppSettings } from '@/hooks/use-app-settings';
import { TransactionType } from '@/types/transaction';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function StatisticsScreen() {
  const { theme, language } = useAppSettings();
  const isDarkMode = theme === 'dark';
  const t = translations[language];
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [activeTab, setActiveTab] = useState('Expense');

  const loadTransactions = async () => {
    const data = await AsyncStorage.getItem('@transactions');
    if (data) {
      setTransactions(JSON.parse(data));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  const totalIncome = transactions
    .filter(t => t.isIncome)
    .reduce((acc, t) => acc + parseFloat(t.amount.replace(/[^\d.]/g, '')), 0);

  const totalExpense = transactions
    .filter(t => !t.isIncome)
    .reduce((acc, t) => acc + parseFloat(t.amount.replace(/[^\d.]/g, '')), 0);

  // Simple dynamic chart data based on last 7 transactions
  const chartData = transactions.slice(0, 7).reverse().map(t => {
    const val = parseFloat(t.amount.replace(/[^\d.]/g, ''));
    return {
      height: Math.min(Math.max((val / 1000) * 100, 20), 100),
      isIncome: t.isIncome
    };
  });

  const categories = [
    { name: 'Food', amount: 450, color: '#F59E0B', icon: 'fast-food' },
    { name: 'Shopping', amount: 1200, color: '#10B981', icon: 'cart' },
    { name: 'Transport', amount: 300, color: '#3B82F6', icon: 'bus' },
    { name: 'Entertainment', amount: 150, color: '#8B5CF6', icon: 'game-controller' },
  ];

  return (
    <SafeAreaView style={[styles.container, !isDarkMode && styles.containerLight]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, !isDarkMode && styles.textLight]}>{t.statistics}</Text>
        <Pressable style={[styles.calendarBtn, !isDarkMode && styles.calendarBtnLight]}>
          <Ionicons name="calendar-outline" size={20} color={isDarkMode ? "white" : "#1E293B"} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.totalCard, !isDarkMode && styles.cardLight]}>
          <Text style={styles.totalLabel}>{t.totalBalance}</Text>
          <Text style={[styles.totalAmount, !isDarkMode && styles.textLight]}>$ {(totalIncome - totalExpense).toFixed(2)}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="arrow-down" size={16} color="#10B981" />
              </View>
              <View>
                <Text style={styles.statLabel}>{t.income}</Text>
                <Text style={[styles.statValue, !isDarkMode && styles.textLight]}>$ {totalIncome.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#EF444420' }]}>
                <Ionicons name="arrow-up" size={16} color="#EF4444" />
              </View>
              <View>
                <Text style={styles.statLabel}>{t.expense}</Text>
                <Text style={[styles.statValue, !isDarkMode && styles.textLight]}>$ {totalExpense.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.tabBar, !isDarkMode && styles.tabBarLight]}>
          {[t.income, t.expense].map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && (isDarkMode ? styles.activeTab : styles.activeTabLight)]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText, !isDarkMode && !activeTab && styles.textLightSecondary]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.chartPlaceholder, !isDarkMode && styles.cardLight]}>
          <Text style={styles.placeholderText}>{t.recentActivity}</Text>
          <View style={styles.barContainer}>
            {chartData.length > 0 ? chartData.map((data, i) => (
              <View key={i} style={[styles.bar, { height: data.height, backgroundColor: data.isIncome ? '#10B981' : '#0066FF' }]} />
            )) : (
              [40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <View key={i} style={[styles.bar, { height: h }]} />
              ))
            )}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>{t.income}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0066FF' }]} />
              <Text style={styles.legendText}>{t.expense}</Text>
            </View>
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, !isDarkMode && styles.textLight]}>{t.topCategories}</Text>
          {categories.map((cat, index) => (
            <View key={index} style={[styles.categoryItem, !isDarkMode && styles.cardLight]}>
              <View style={[styles.catIconBox, { backgroundColor: cat.color + '20' }]}>
                <Ionicons name={cat.icon as any} size={20} color={cat.color} />
              </View>
              <View style={styles.catInfo}>
                <Text style={[styles.catName, !isDarkMode && styles.textLight]}>{cat.name}</Text>
                <View style={[styles.progressBarBg, !isDarkMode && styles.progressBarBgLight]}>
                  <View style={[styles.progressBarFill, { width: `${(cat.amount / 1500) * 100}%`, backgroundColor: cat.color }]} />
                </View>
              </View>
              <Text style={[styles.catAmount, !isDarkMode && styles.textLight]}>$ {cat.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  containerLight: { backgroundColor: '#F8FAFC' },
  textLight: { color: '#1E293B' },
  textLightSecondary: { color: 'rgba(30, 41, 59, 0.6)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15 },
  headerTitle: { color: 'white', fontSize: 24, fontFamily: 'Poppins-Bold' },
  calendarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center' },
  calendarBtnLight: { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  totalCard: { backgroundColor: '#1A1D29', borderRadius: 24, padding: 25, alignItems: 'center', marginTop: 10 },
  cardLight: { backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  totalLabel: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, fontFamily: 'Poppins-Regular', marginBottom: 5 },
  totalAmount: { color: 'white', fontSize: 32, fontFamily: 'Poppins-Bold', marginBottom: 25 },
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)', paddingTop: 20 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  statLabel: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, fontFamily: 'Poppins-Regular' },
  statValue: { color: 'white', fontSize: 14, fontFamily: 'Poppins-Bold' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1A1D29', borderRadius: 16, padding: 6, marginTop: 30 },
  tabBarLight: { backgroundColor: '#E6EEF9' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#0F121E' },
  activeTabLight: { backgroundColor: '#0066FF' },
  tabText: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, fontFamily: 'Poppins-Medium' },
  activeTabText: { color: 'white' },
  chartPlaceholder: { backgroundColor: '#1A1D29', borderRadius: 24, marginTop: 30, padding: 20, alignItems: 'center' },
  placeholderText: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, fontFamily: 'Poppins-Medium', marginBottom: 20 },
  barContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 15, height: 120, marginBottom: 20 },
  bar: { width: 15, backgroundColor: '#0066FF', borderRadius: 8 },
  chartLegend: { flexDirection: 'row', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 12 },
  categorySection: { marginTop: 40 },
  sectionTitle: { color: 'white', fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 20 },
  categoryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#1A1D29', padding: 15, borderRadius: 20 },
  catIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  catInfo: { flex: 1, marginRight: 15 },
  catName: { color: 'white', fontSize: 15, fontFamily: 'Poppins-Medium', marginBottom: 8 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 3 },
  progressBarBgLight: { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  catAmount: { color: 'white', fontSize: 16, fontFamily: 'Poppins-Bold' },
});
