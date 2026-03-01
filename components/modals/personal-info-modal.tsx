import { translations } from '@/constants/translations';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PersonalInfoModal({ onClose }: { onClose: () => void }) {
  const { userAvatar, setUserAvatar, theme, language } = useAppSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');

  const isDarkMode = theme === 'dark';
  const t = translations[language];

  useEffect(() => {
    const loadData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
        setPhone(parsed.phone || '');
        setDob(parsed.dob || '');
        setAddress(parsed.address || '');
        setOccupation(parsed.occupation || '');
      }
    };
    loadData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = { name, email, phone, dob, address, occupation };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      Alert.alert("Success", "Profile updated successfully!");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  return (
    <View style={[styles.container, !isDarkMode && styles.containerLight]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={20}>
          <Ionicons name="close-outline" size={32} color={isDarkMode ? "white" : "#1E293B"} />
        </Pressable>
        <Text style={[styles.headerTitle, !isDarkMode && styles.textLight]}>{t.personalInfo}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <Pressable onPress={pickImage}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase() || 'U'}</Text>
              </View>
            )}
            <View style={[styles.editBadge, !isDarkMode && { borderColor: '#F8FAFC' }]}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </Pressable>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.fullName}</Text>
          <TextInput
            style={[styles.input, !isDarkMode && styles.inputLight]}
            value={name}
            onChangeText={setName}
            placeholder={t.fullName}
            placeholderTextColor="#475569"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.emailAddress}</Text>
          <TextInput
            style={[styles.input, !isDarkMode && styles.inputLight]}
            value={email}
            onChangeText={setEmail}
            placeholder={t.emailAddress}
            placeholderTextColor="#475569"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.phoneNumber}</Text>
          <TextInput
            style={[styles.input, !isDarkMode && styles.inputLight]}
            value={phone}
            onChangeText={setPhone}
            placeholder={t.phoneNumber}
            placeholderTextColor="#475569"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.dateOfBirth}</Text>
          <TextInput
            style={[styles.input, !isDarkMode && styles.inputLight]}
            value={dob}
            onChangeText={setDob}
            placeholder={t.dateOfBirth}
            placeholderTextColor="#475569"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.address}</Text>
          <TextInput
            style={[styles.input, !isDarkMode && styles.inputLight]}
            value={address}
            onChangeText={setAddress}
            placeholder={t.address}
            placeholderTextColor="#475569"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.occupation}</Text>
          <TextInput
            style={[styles.input, !isDarkMode && styles.inputLight]}
            value={occupation}
            onChangeText={setOccupation}
            placeholder={t.occupation}
            placeholderTextColor="#475569"
          />
        </View>

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{t.saveChanges}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  containerLight: { backgroundColor: '#F8FAFC' },
  textLight: { color: '#1E293B' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 40 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 25 },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0066FF', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: 'white', fontSize: 40, fontWeight: 'bold' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0066FF', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#0F121E' },
  inputGroup: { marginBottom: 25 },
  label: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase' },
  input: { backgroundColor: '#1A1D29', color: 'white', height: 60, borderRadius: 16, paddingHorizontal: 20, fontSize: 16, borderWidth: 1, borderColor: '#334155' },
  inputLight: { backgroundColor: 'white', color: '#1E293B', borderColor: '#CBD5E1' },
  saveBtn: { backgroundColor: '#0066FF', height: 64, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
