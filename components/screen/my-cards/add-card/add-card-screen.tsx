import { FlipCard } from '@/components/ui/flip-card';
import { translations } from '@/constants/translations';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView, Platform,
    Pressable, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { cardSchema, CardSchemaType } from './card.schema';

interface AddCardScreenProps {
  onClose?: () => void; 
}

export default function AddCardScreen({ onClose }: AddCardScreenProps) {
  const router = useRouter();
  const { theme, language } = useAppSettings();
  const isDarkMode = theme === 'dark';
  const t = translations[language];
  
  const [form, setForm] = useState<CardSchemaType>({
    cardNumber: '',
    cardHolderName: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CardSchemaType, string>>>({});

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleChange = (field: keyof CardSchemaType, value: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    let formattedValue = value;
    if (field === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length > 2) {
        formattedValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      } else {
        formattedValue = cleaned;
      }
    }

    setForm(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSave = async () => {
    const result = cardSchema.safeParse(form);

    if (result.success) {
      try {
        const existingData = await AsyncStorage.getItem('@user_card');
        let cardsArray = [];
        
        if (existingData) {
          const parsed = JSON.parse(existingData);
          cardsArray = Array.isArray(parsed) ? parsed : [parsed];
        }

        const newCard = {
          ...result.data,
          id: Math.random().toString(36).substring(7),
          balance: 0,
          color: '#1E293B'
        };
        cardsArray.push(newCard);
        await AsyncStorage.setItem('@user_card', JSON.stringify(cardsArray));
        
        if (onClose) {
          onClose();
        } else {
          router.replace('/(tabs)/home');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const formattedErrors: any = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setErrors(formattedErrors);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: isDarkMode ? '#0F121E' : '#F8FAFC' }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          {/* Используем handleClose вместо router.back() */}
          <Pressable onPress={handleClose} style={[styles.backButton, { backgroundColor: isDarkMode ? '#1A1D29' : '#E6EEF9' }] }>
            <Ionicons 
              name={onClose ? "close" : "chevron-back"} 
              size={28} 
              color={isDarkMode ? 'white' : '#1E293B'} 
            />
          </Pressable>
          <Text style={[styles.title, { color: isDarkMode ? 'white' : '#1E293B' }]}>{t.addNewCard}</Text>
        </View>

        <View style={styles.previewContainer}>
           <FlipCard item={form} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.6)' }]}>{t.cardNumberLabel}</Text>
            <TextInput
              style={[styles.input, errors.cardNumber && styles.inputError, { backgroundColor: isDarkMode ? '#1A1D29' : '#FFFFFF', color: isDarkMode ? 'white' : '#1E293B' }]}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={isDarkMode ? '#888' : '#9CA3AF'}
              keyboardType="numeric"
              maxLength={16}
              value={form.cardNumber}
              onChangeText={(v) => handleChange('cardNumber', v)}
            />
            {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.6)' }]}>{t.cardHolder}</Text>
            <TextInput
              style={[styles.input, errors.cardHolderName && styles.inputError, { backgroundColor: isDarkMode ? '#1A1D29' : '#FFFFFF', color: isDarkMode ? 'white' : '#1E293B' }]}
              placeholder="ALI ALIYEV"
              placeholderTextColor={isDarkMode ? '#888' : '#9CA3AF'}
              autoCapitalize="characters"
              value={form.cardHolderName}
              onChangeText={(v) => handleChange('cardHolderName', v)}
            />
            {errors.cardHolderName && <Text style={styles.errorText}>{errors.cardHolderName}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
              <Text style={[styles.label, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.6)' }]}>{t.expiryDate}</Text>
              <TextInput
                style={[styles.input, errors.expiry && styles.inputError, { backgroundColor: isDarkMode ? '#1A1D29' : '#FFFFFF', color: isDarkMode ? 'white' : '#1E293B' }]}
                placeholder="MM/YY"
                placeholderTextColor={isDarkMode ? '#888' : '#9CA3AF'}
                keyboardType="numeric"
                maxLength={5}
                value={form.expiry}
                onChangeText={(v) => handleChange('expiry', v)}
              />
              {errors.expiry && <Text style={styles.errorText}>{errors.expiry}</Text>}
            </View>

            <View style={[styles.inputWrapper, { width: 120 }]}>
              <Text style={[styles.label, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.6)' }]}>{t.cvv}</Text>
              <TextInput
                style={[styles.input, errors.cvv && styles.inputError, { backgroundColor: isDarkMode ? '#1A1D29' : '#FFFFFF', color: isDarkMode ? 'white' : '#1E293B' }]}
                placeholder="***"
                placeholderTextColor={isDarkMode ? '#888' : '#9CA3AF'}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                value={form.cvv}
                onChangeText={(v) => handleChange('cvv', v)}
              />
              {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
            </View>
          </View>

          <Pressable style={[styles.saveButton, { opacity: 1 }]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t.saveCard}</Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  scrollContent: { padding: 24, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backButton: { 
    width: 45, height: 45, borderRadius: 23, 
    backgroundColor: '#1A1D29', justifyContent: 'center', alignItems: 'center',
    marginRight: 15 
  },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  previewContainer: { 
    alignItems: 'center', 
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  formContainer: { marginTop: 10 },
  inputWrapper: { marginBottom: 20 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  input: { 
    backgroundColor: '#1A1D29', 
    color: 'white', 
    padding: 18, 
    borderRadius: 20, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  inputError: { borderColor: '#FF4444' },
  errorText: { color: '#FF4444', fontSize: 12, marginTop: 6, marginLeft: 4 },
  row: { flexDirection: 'row' },
  saveButton: { 
    backgroundColor: '#0066FF', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginTop: 20,
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});