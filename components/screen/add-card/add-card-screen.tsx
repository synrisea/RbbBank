import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { cardSchema, CardSchemaType } from './card.schema'; 

export default function AddCardPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CardSchemaType, string>>>({});

  const handleChange = (field: keyof CardSchemaType, value: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length > 2) {
        value = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      } else {
        value = cleaned;
      }
    }

    setForm(prev => ({ ...prev, [field]: value }));
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

        cardsArray.push(result.data);

        await AsyncStorage.setItem('@user_card', JSON.stringify(cardsArray));
        
        router.replace('/');
        } catch (e) {
          console.error(e);
        }
    } 
    else {
      const formattedErrors: any = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </Pressable>
          <Text style={styles.title}>Add New Card</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={[styles.input, errors.cardNumber && styles.inputError]}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor="#555"
            keyboardType="numeric"
            maxLength={16}
            onChangeText={(v) => handleChange('cardNumber', v)}
          />
          {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            style={[styles.input, errors.cardHolderName && styles.inputError]}
            placeholder="Ali Aliyev"
            placeholderTextColor="#555"
            autoCapitalize="characters"
            onChangeText={(v) => handleChange('cardHolderName', v)}
          />
          {errors.cardHolderName && <Text style={styles.errorText}>{errors.cardHolderName}</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={[styles.input, errors.expiry && styles.inputError]}
              placeholder="MM/YY"
              placeholderTextColor="#555"
              keyboardType="numeric"
              maxLength={5}
              value={form.expiry}
              onChangeText={(v) => handleChange('expiry', v)}
            />
            {errors.expiry && <Text style={styles.errorText}>{errors.expiry}</Text>}
          </View>

          <View style={[styles.inputWrapper, { width: 120 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={[styles.input, errors.cvv && styles.inputError]}
              placeholder="***"
              placeholderTextColor="#555"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
              onChangeText={(v) => handleChange('cvv', v)}
            />
            {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
          </View>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Card</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F121E' },
  scrollContent: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 40, marginTop: 20 },
  backButton: { marginRight: 15 },
  title: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  
  inputWrapper: { marginBottom: 20 },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: 17, marginBottom: 12, marginLeft: 4 },
  input: { 
    backgroundColor: '#1A1D29', 
    color: 'white', 
    padding: 16, 
    borderRadius: 16, 
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  inputError: { borderColor: '#FF4444', backgroundColor: 'rgba(255, 68, 68, 0.05)' },
  errorText: { color: '#FF4444', fontSize: 12, marginTop: 6, marginLeft: 4 },
  
  row: { flexDirection: 'row' },
  
  saveButton: { 
    backgroundColor: '#0066FF', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 20,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});