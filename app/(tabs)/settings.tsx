import PersonalInfoModal from '@/components/modals/personal-info-modal';
import { translations } from '@/constants/translations';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage, theme, setTheme, userAvatar } = useAppSettings();
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isLangModalVisible, setLangModalVisible] = useState(false);
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);

  const t = translations[language];
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || 'User');
        setUserEmail(parsed.email || 'user@example.com');
      }
    };
    loadUser();
  }, [isInfoModalVisible]);

  const handleLogout = () => {
    Alert.alert(t.logout, 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: t.logout,
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('isAuthenticated');
          router.replace('/signin/page');
        },
      },
    ]);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  ];

  return (
    <SafeAreaView style={[styles.container, !isDarkMode && styles.containerLight]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, !isDarkMode && styles.textLight]}>{t.settings}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileCard, !isDarkMode && styles.cardLight]}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, !isDarkMode && styles.textLight]}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
          <Pressable style={styles.editBtn} onPress={() => setInfoModalVisible(true)}>
            <Ionicons name="pencil" size={18} color="#0066FF" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <SettingItem
            icon="person-outline"
            label={t.personalInfo}
            onPress={() => setInfoModalVisible(true)}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="globe-outline"
            label={t.language}
            value={languages.find(l => l.code === language)?.name}
            onPress={() => setLangModalVisible(true)}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="color-palette-outline"
            label={t.theme}
            value={isDarkMode ? t.dark : t.light}
            onPress={() => setTheme(isDarkMode ? 'light' : 'dark')}
            isDarkMode={isDarkMode}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={[styles.settingRow, !isDarkMode && styles.cardLight]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#8B5CF620' }]}>
                <Ionicons name="notifications-outline" size={22} color="#8B5CF6" />
              </View>
              <Text style={[styles.settingLabel, !isDarkMode && styles.textLight]}>{t.notifications}</Text>
            </View>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
              trackColor={{ false: '#1E293B', true: '#0066FF' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.support}</Text>
          <SettingItem
            icon="help-circle-outline"
            label={t.helpCenter}
            onPress={() => setHelpModalVisible(true)}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="document-text-outline"
            label={t.privacyPolicy}
            onPress={() => setPrivacyModalVisible(true)}
            isDarkMode={isDarkMode}
          />
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>{t.logout}</Text>
        </Pressable>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={isLangModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, !isDarkMode && styles.containerLight]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, !isDarkMode && styles.textLight]}>{t.language}</Text>
            <Pressable onPress={() => setLangModalVisible(false)}><Ionicons name="close" size={28} color={isDarkMode ? "white" : "black"} /></Pressable>
          </View>
          <FlatList
            data={languages}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.langItem, language === item.code && styles.langItemActive]}
                onPress={() => { setLanguage(item.code as any); setLangModalVisible(false); }}
              >
                <Text style={styles.langFlag}>{item.flag}</Text>
                <Text style={[styles.langName, !isDarkMode && styles.textLight]}>{item.name}</Text>
                {language === item.code && <Ionicons name="checkmark-circle" size={24} color="#0066FF" />}
              </Pressable>
            )}
          />
        </View>
      </Modal>

      {/* Help Center Modal */}
      <Modal visible={isHelpModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, !isDarkMode && styles.containerLight]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, !isDarkMode && styles.textLight]}>{t.helpCenter}</Text>
            <Pressable onPress={() => setHelpModalVisible(false)}><Ionicons name="close" size={28} color={isDarkMode ? "white" : "black"} /></Pressable>
          </View>
          <ScrollView style={{ padding: 20 }}>
            <Text style={[styles.contentTitle, !isDarkMode && styles.textLight]}>Frequently Asked Questions</Text>
            <FAQItem question="How do I add a new card?" answer="Go to 'My Cards' tab and click the '+' button at the top right." isDarkMode={isDarkMode} />
            <FAQItem question="Is my data secure?" answer="Yes, we use industry-standard encryption and biometric authentication to protect your data." isDarkMode={isDarkMode} />
            <FAQItem question="How to apply for a loan?" answer="On the Home screen, click the 'Loan' button and follow the instructions." isDarkMode={isDarkMode} />
            <Text style={[styles.contentTitle, { marginTop: 20 }, !isDarkMode && styles.textLight]}>Contact Support</Text>
            <Text style={styles.contentText}>Email: support@rbb-bank.com</Text>
            <Text style={styles.contentText}>Phone: +1 (800) RBB-BANK</Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal visible={isPrivacyModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, !isDarkMode && styles.containerLight]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, !isDarkMode && styles.textLight]}>{t.privacyPolicy}</Text>
            <Pressable onPress={() => setPrivacyModalVisible(false)}><Ionicons name="close" size={28} color={isDarkMode ? "white" : "black"} /></Pressable>
          </View>
          <ScrollView style={{ padding: 20 }}>
            <Text style={[styles.contentText, !isDarkMode && styles.textLight]}>
              At RBB Bank, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
              {"\n\n"}
              1. Data Collection: We collect information you provide when creating an account, such as name, email, and phone number.
              {"\n\n"}
              2. Data Usage: Your data is used to provide banking services, process transactions, and improve our app.
              {"\n\n"}
              3. Security: We implement advanced security measures, including encryption and biometrics, to safeguard your information.
              {"\n\n"}
              4. Third Parties: We do not sell your personal data to third parties.
            </Text>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={isInfoModalVisible} animationType="slide" presentationStyle="pageSheet">
        <PersonalInfoModal onClose={() => setInfoModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const SettingItem = ({ icon, label, value, onPress, isDarkMode }: { icon: string, label: string, value?: string, onPress: () => void, isDarkMode: boolean }) => (
  <Pressable style={[styles.settingRow, !isDarkMode && styles.cardLight]} onPress={onPress}>
    <View style={styles.settingLeft}>
      <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 102, 255, 0.05)' }]}>
        <Ionicons name={icon as any} size={22} color={isDarkMode ? "white" : "#0066FF"} />
      </View>
      <Text style={[styles.settingLabel, !isDarkMode && styles.textLight]}>{label}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {value && <Text style={styles.valueText}>{value}</Text>}
      <Ionicons name="chevron-forward" size={20} color="rgba(148, 163, 184, 0.5)" />
    </View>
  </Pressable>
);

const FAQItem = ({ question, answer, isDarkMode }: { question: string, answer: string, isDarkMode: boolean }) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={{ color: isDarkMode ? 'white' : '#1E293B', fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>{question}</Text>
    <Text style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: 14 }}>{answer}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  containerLight: { backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 25, paddingVertical: 15 },
  headerTitle: { color: 'white', fontSize: 24, fontFamily: 'Poppins-Bold' },
  textLight: { color: '#1E293B' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1D29', padding: 20, borderRadius: 24, marginTop: 10, marginBottom: 30 },
  cardLight: { backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatarBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#0066FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  avatarText: { color: 'white', fontSize: 24, fontFamily: 'Poppins-Bold' },
  profileInfo: { flex: 1 },
  profileName: { color: 'white', fontSize: 18, fontFamily: 'Poppins-Bold' },
  profileEmail: { color: 'rgba(148, 163, 184, 0.8)', fontSize: 14, fontFamily: 'Poppins-Regular' },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0, 102, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  section: { marginBottom: 30 },
  sectionTitle: { color: 'rgba(148, 163, 184, 0.5)', fontSize: 13, fontFamily: 'Poppins-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15, marginLeft: 5 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1A1D29', padding: 15, borderRadius: 20, marginBottom: 12 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { color: 'white', fontSize: 15, fontFamily: 'Poppins-Medium' },
  valueText: { color: '#0066FF', fontSize: 14, fontWeight: 'bold' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10, paddingVertical: 15 },
  logoutText: { color: '#EF4444', fontSize: 16, fontFamily: 'Poppins-Bold' },
  modalContainer: { flex: 1, backgroundColor: '#0F121E' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  langItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  langItemActive: { backgroundColor: 'rgba(0, 102, 255, 0.1)' },
  langFlag: { fontSize: 24, marginRight: 15 },
  langName: { color: 'white', fontSize: 18, flex: 1 },
  contentTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  contentText: { color: 'rgba(148, 163, 184, 0.8)', fontSize: 15, lineHeight: 24 },
});
